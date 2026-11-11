import type { Issue } from '@/types';
import { IssueCard } from '@/components/IssueCard';
import { BarChart, DonutChart } from '@/components/Charts';
import {
  ClipboardList, Clock, Loader, CheckCircle2, Plus, TrendingUp, ArrowRight,
} from 'lucide-react';

interface DashboardProps {
  issues: Issue[];
  onReport: () => void;
  onIssueClick: (issue: Issue) => void;
  onViewAll: () => void;
}

export function Dashboard({ issues, onReport, onIssueClick, onViewAll }: DashboardProps) {
  const total = issues.length;
  const pending = issues.filter((i) => i.status === 'Submitted').length;
  const inProgress = issues.filter((i) => i.status === 'In Progress').length;
  const resolved = issues.filter((i) => i.status === 'Resolved').length;

  const stats = [
    {
      label: 'Total Reported',
      value: total,
      icon: ClipboardList,
      tint: 'bg-brand-50 text-brand-600',
    },
    { label: 'Pending', value: pending, icon: Clock, tint: 'bg-slate-100 text-slate-600' },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Loader,
      tint: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle2,
      tint: 'bg-teal-50 text-teal-600',
    },
  ];

  // category distribution
  const catCounts = issues.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});
  const catColors: Record<string, string> = {
    Electricity: '#f59e0b',
    'Water Supply': '#0ea5e9',
    'Wi-Fi': '#8b5cf6',
    Cleanliness: '#10b981',
    'Hostel Maintenance': '#f43f5e',
    'Classroom Facilities': '#2563eb',
    Other: '#64748b',
  };
  const donutData = Object.entries(catCounts).map(([k, v]) => ({
    label: k,
    value: v,
    color: catColors[k] ?? '#94a3b8',
  }));

  // weekly reporting (last 7 days)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const dayIdx = (today.getDay() + 6) % 7; // 0 = Mon
  const weekData = weekDays.map((label, i) => {
    if (i > dayIdx) return { label, value: 0 };
    const d = new Date(today);
    d.setDate(today.getDate() - (dayIdx - i));
    const count = issues.filter((iss) => {
      const sd = new Date(iss.submittedAt);
      return sd.toDateString() === d.toDateString();
    }).length;
    return { label, value: count };
  });

  const recent = [...issues]
    .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 text-white sm:p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-20 h-32 w-32 rounded-full bg-teal-400/20" />
        <div className="relative">
          <p className="text-sm font-medium text-brand-100">Welcome back to</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">CampusCare</h1>
          <p className="mt-2 max-w-lg text-sm text-brand-100">
            A better campus starts with you. Report issues, track progress, and help keep your campus running smoothly.
          </p>
          <button
            onClick={onReport}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Report an Issue
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tint}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Issue distribution</h3>
              <p className="text-xs text-slate-500">By category</p>
            </div>
            <TrendingUp className="h-4 w-4 text-slate-300" />
          </div>
          <DonutChart data={donutData} />
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Weekly reporting</h3>
            <p className="text-xs text-slate-500">Issues reported this week</p>
          </div>
          <BarChart data={weekData} />
        </div>
      </div>

      {/* Recent */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent issue reports</h3>
            <p className="text-xs text-slate-500">Latest activity across campus</p>
          </div>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recent.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={() => onIssueClick(issue)} showAuthor />
          ))}
        </div>
        {recent.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No issues reported yet.</p>
        )}
      </div>
    </div>
  );
}
