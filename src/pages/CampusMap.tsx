import { useState, useMemo } from 'react';
import type { Issue, Location } from '@/types';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetail } from '@/components/IssueDetail';
import {
  Home, School, BookOpen, UtensilsCrossed, Trophy, Bath, Building2, MapPin,
} from 'lucide-react';

interface CampusMapProps {
  issues: Issue[];
}

interface Area {
  name: Location;
  label: string;
  desc: string;
  icon: typeof Home;
  color: string;
  bg: string;
  // SVG coordinates (percent)
  x: number;
  y: number;
  w: number;
  h: number;
}

const AREAS: Area[] = [
  { name: 'Hostel', label: 'Hostels', desc: 'Residential blocks A, B & C', icon: Home, color: '#2563eb', bg: '#dbeafe', x: 4, y: 12, w: 26, h: 30 },
  { name: 'Academic Block', label: 'Academic Block', desc: 'Lecture halls & classrooms', icon: School, color: '#0d9488', bg: '#ccfbf1', x: 36, y: 10, w: 28, h: 32 },
  { name: 'Library', label: 'Library', desc: 'Reading halls & archives', icon: BookOpen, color: '#7c3aed', bg: '#ede9fe', x: 70, y: 8, w: 26, h: 24 },
  { name: 'Cafeteria', label: 'Cafeteria', desc: 'Dining & food court', icon: UtensilsCrossed, color: '#f59e0b', bg: '#fef3c7', x: 70, y: 40, w: 26, h: 22 },
  { name: 'Sports Area', label: 'Sports Complex', desc: 'Grounds, courts & gym', icon: Trophy, color: '#ef4444', bg: '#fee2e2', x: 36, y: 56, w: 28, h: 26 },
  { name: 'Washroom', label: 'Washrooms', desc: 'Public restrooms', icon: Bath, color: '#0891b2', bg: '#cffafe', x: 6, y: 56, w: 22, h: 22 },
  { name: 'Other', label: 'Other Areas', desc: 'Gardens, parking & more', icon: Building2, color: '#64748b', bg: '#f1f5f9', x: 4, y: 84, w: 92, h: 8 },
];

export function CampusMap({ issues }: CampusMapProps) {
  const [active, setActive] = useState<Area>(AREAS[0]);
  const [selected, setSelected] = useState<Issue | null>(null);

  const issuesByArea = useMemo(() => {
    const map: Record<string, Issue[]> = {};
    issues.forEach((i) => {
      const key = i.location;
      (map[key] ??= []).push(i);
    });
    return map;
  }, [issues]);

  const activeIssues = issuesByArea[active.name] ?? [];
  const currentSelected = selected ? issues.find((i) => i.id === selected.id) ?? null : null;

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Campus Map</h1>
        <p className="mt-1 text-sm text-slate-500">
          An illustrative directory of campus areas. Browse locations and view related issues.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Campus layout</h3>
              <span className="text-xs text-slate-400">Illustrative — not to scale</span>
            </div>
            <div
              className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-brand-50/30"
              style={{ aspectRatio: '16 / 10' }}
            >
              {/* Decorative paths */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="50%" cy="50%" r="4%" fill="#e0f2fe" />
              </svg>

              {AREAS.map((area) => {
                const count = (issuesByArea[area.name] ?? []).length;
                const isActive = active.name === area.name;
                return (
                  <button
                    key={area.name}
                    onClick={() => setActive(area)}
                    className={`absolute flex flex-col items-center justify-center rounded-xl border-2 p-2 text-center transition ${
                      isActive
                        ? 'border-slate-900 shadow-lg scale-[1.03] z-10'
                        : 'border-transparent hover:border-slate-300 hover:shadow-md'
                    }`}
                    style={{
                      left: `${area.x}%`,
                      top: `${area.y}%`,
                      width: `${area.w}%`,
                      height: `${area.h}%`,
                      background: area.bg,
                    }}
                  >
                    <area.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: area.color }} />
                    <span
                      className="mt-1 text-[10px] font-bold leading-tight sm:text-xs"
                      style={{ color: area.color }}
                    >
                      {area.label}
                    </span>
                    {count > 0 && (
                      <span className="mt-0.5 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-600 shadow-sm">
                        {count} issue{count > 1 ? 's' : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Area directory */}
          <div className="card mt-4 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Area directory</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {AREAS.map((area) => {
                const count = (issuesByArea[area.name] ?? []).length;
                return (
                  <button
                    key={area.name}
                    onClick={() => setActive(area)}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition ${
                      active.name === area.name
                        ? 'border-brand-300 bg-brand-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: area.bg, color: area.color }}
                    >
                      <area.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">{area.label}</p>
                      <p className="text-[10px] text-slate-500">{count} issue{count === 1 ? '' : 's'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active area panel */}
        <div className="card flex flex-col p-4 lg:sticky lg:top-4 lg:self-start">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: active.bg, color: active.color }}
            >
              <active.icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">{active.label}</h3>
              <p className="text-xs text-slate-500">{active.desc}</p>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {activeIssues.length} associated issue{activeIssues.length === 1 ? '' : 's'}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto" style={{ maxHeight: 400 }}>
            {activeIssues.length > 0 ? (
              activeIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onClick={() => setSelected(issue)} />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400">No issues reported here yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <IssueDetail
        issue={currentSelected}
        open={!!currentSelected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
