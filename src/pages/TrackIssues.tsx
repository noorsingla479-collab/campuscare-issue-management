import { useMemo, useState } from 'react';
import type { Issue, Category, Status } from '@/types';
import { CATEGORIES, STATUSES } from '@/types';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetail } from '@/components/IssueDetail';
import { Search, Filter, SlidersHorizontal, Inbox } from 'lucide-react';

interface TrackIssuesProps {
  issues: Issue[];
  adminMode: boolean;
  onStatusChange: (id: string, status: Status) => void;
}

export function TrackIssues({ issues, adminMode, onStatusChange }: TrackIssuesProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [status, setStatus] = useState<Status | 'All'>('All');
  const [selected, setSelected] = useState<Issue | null>(null);

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      if (category !== 'All' && i.category !== category) return false;
      if (status !== 'All' && i.status !== status) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [issues, query, category, status]);

  // keep selected in sync with updates
  const currentSelected = selected
    ? issues.find((i) => i.id === selected.id) ?? null
    : null;

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Track Issues</h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse all reported campus issues. Click any card for full details and progress.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search by title, ID, description, or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                className="input appearance-none pl-9 pr-8"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category | 'All')}
              >
                <option value="All">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                className="input appearance-none pl-9 pr-8"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status | 'All')}
              >
                <option value="All">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {issues.length} issues
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={() => setSelected(issue)} showAuthor />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Inbox className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No issues match your filters</p>
          <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}

      <IssueDetail
        issue={currentSelected}
        open={!!currentSelected}
        onClose={() => setSelected(null)}
        adminMode={adminMode}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
