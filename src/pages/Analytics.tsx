import { useMemo } from 'react';
import type { Issue } from '@/types';
import { BarChart, DonutChart, LineChart } from '@/components/Charts';
import { Clock, TrendingUp, CheckCircle2, Hourglass, Activity } from 'lucide-react';

interface AnalyticsProps {
  issues: Issue[];
}

const CAT_COLORS: Record<string, string> = {
  Electricity: '#f59e0b',
  'Water Supply': '#0ea5e9',
  'Wi-Fi': '#8b5cf6',
  Cleanliness: '#10b981',
  'Hostel Maintenance': '#f43f5e',
  'Classroom Facilities': '#2563eb',
  Other: '#64748b',
};

export function Analytics({ issues }: AnalyticsProps) {
  const resolved = issues.filter((i) => i.status === 'Resolved');
  const pending = issues.filter((i) => i.status !== 'Resolved');

  const catCounts = useMemo(() => {
    const map: Record<string, number> = {};
    issues.forEach((i) => { map[i.category] = (map[i.category] ?? 0) + 1; });
    return map;
  }, [issues]);

  const donutData = Object.entries(catCounts).map(([k, v]) => ({
    label: k,
    value: v,
    color: CAT_COLORS[k] ?? '#94a3b8',
  }));

  // resolved vs pending donut
  const statusData = [
    { label: 'Resolved', value: resolved.length, color: '#14b8a6' },
    { label: 'Pending', value: pending.length, color: '#94a3b8' },
  ];

  // weekly reporting (last 7 days) + line chart
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const dayIdx = (today.getDay() + 6) % 7;
  const weekData = weekDays.map((label, i) => {
    if (i > dayIdx) return { label, value: 0 };
    const d = new Date(today);
    d.setDate(today.getDate() - (dayIdx - i));
    const count = issues.filter((iss) =>
      new Date(iss.submittedAt).toDateString() === d.toDateString(),
    ).length;
    return { label, value: count };
  });

  // last 4 weeks bar
  const weeksData = [1, 2, 3, 4].map((w) => {
    const start = new Date(today);
    start.setDate(today.getDate() - w * 7);
    const end = new Date(today);
    end.setDate(today.getDate() - (w - 1) * 7);
    const count = issues.filter((iss) => {
      const d = new Date(iss.submittedAt);
      return d >= start && d < end;
    }).length;
    return { label: `W-${w}`, value: count, color: w === 1 ? '#2563eb' : '#bfdbfe' };
  }).reverse();

  // Average resolution time (illustrative sample data)
  const avgResolutionHours = 38; // sample baseline
  const sampleAvgNote = 'Illustrative sample data';

  const byPriority = [
    { label: 'High', value: issues.filter((i) => i.priority === 'High').length, color: '#fda4af' },
    { label: 'Medium', value: issues.filter((i) => i.priority === 'Medium').length, color: '#fcd34d' },
    { label: 'Low', value: issues.filter((i) => i.priority === 'Low').length, color: '#6ee7b7' },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">
          Insights into campus issue trends, resolution performance, and category breakdowns.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Activity className="h-5 w-5" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{issues.length}</p>
          <p className="text-xs text-slate-500">Total issues</p>
        </div>
        <div className="card p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {issues.length ? Math.round((resolved.length / issues.length) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-500">Resolution rate</p>
        </div>
        <div className="card p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Hourglass className="h-5 w-5" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{pending.length}</p>
          <p className="text-xs text-slate-500">Open issues</p>
        </div>
        <div className="card p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Clock className="h-5 w-5" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{avgResolutionHours}h</p>
          <p className="text-xs text-slate-500">Avg. resolution time <span className="text-slate-400">· sample</span></p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Issue distribution by category</h3>
          <p className="mb-4 text-xs text-slate-500">All reported issues</p>
          <DonutChart data={donutData} />
        </div>

        <div className="card p-5">
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Resolved vs Pending</h3>
          <p className="mb-4 text-xs text-slate-500">Current status split</p>
          <DonutChart data={statusData} />
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Weekly reporting trend</h3>
              <p className="text-xs text-slate-500">Issues reported per day this week</p>
            </div>
            <TrendingUp className="h-4 w-4 text-brand-400" />
          </div>
          <LineChart data={weekData} />
        </div>

        <div className="card p-5">
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Issues per week (last 4 weeks)</h3>
          <p className="mb-4 text-xs text-slate-500">Weekly volume comparison</p>
          <BarChart data={weeksData} />
        </div>
      </div>

      {/* Priority + sample resolution */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Priority breakdown</h3>
          <BarChart data={byPriority} max={Math.max(1, ...byPriority.map((p) => p.value))} height={160} />
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Average resolution time by category</h3>
          <p className="mb-4 text-xs text-slate-400">
            <Clock className="mr-1 inline h-3 w-3" /> {sampleAvgNote}
          </p>
          <div className="space-y-2.5">
            {Object.entries(catCounts).map(([cat], i) => {
              const hours = 18 + ((i * 13) % 48); // sample deterministic
              const pct = Math.min(100, (hours / 60) * 100);
              return (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">{cat}</span>
                    <span className="font-semibold text-slate-800">{hours}h avg</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: CAT_COLORS[cat] ?? '#94a3b8' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
