import { useState, useEffect, useCallback } from 'react';
import type { Issue, Status } from '@/types';
import { useIssues, useActivity } from '@/store';
import {
  LayoutDashboard, FilePlus2, ListChecks, FileText, Map, BarChart3,
  User, ShieldCheck, ShieldOff, Menu, X, GraduationCap, Bell,
} from 'lucide-react';
import { Dashboard } from '@/pages/Dashboard';
import { ReportIssue } from '@/pages/ReportIssue';
import { TrackIssues } from '@/pages/TrackIssues';
import { MyReports } from '@/pages/MyReports';
import { CampusMap } from '@/pages/CampusMap';
import { Analytics } from '@/pages/Analytics';
import { ProfilePage } from '@/pages/ProfilePage';

type PageId =
  | 'dashboard'
  | 'report'
  | 'track'
  | 'myreports'
  | 'map'
  | 'analytics'
  | 'profile';

const NAV: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'report', label: 'Report an Issue', icon: FilePlus2 },
  { id: 'track', label: 'Track Issues', icon: ListChecks },
  { id: 'myreports', label: 'My Reports', icon: FileText },
  { id: 'map', label: 'Campus Map', icon: Map },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
];

const ADMIN_KEY = 'campuscare.admin';

export default function App() {
  const { issues, addIssue, updateIssue, deleteIssue } = useIssues();
  const { activity, logActivity } = useActivity();
  const [page, setPage] = useState<PageId>('dashboard');
  const [adminMode, setAdminMode] = useState<boolean>(() => {
    try { return localStorage.getItem(ADMIN_KEY) === 'true'; } catch { return false; }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(ADMIN_KEY, String(adminMode)); } catch { /* ignore */ }
  }, [adminMode]);

  const navigate = useCallback((p: PageId) => {
    setPage(p);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddIssue = useCallback((issue: Issue) => {
    addIssue(issue);
    logActivity(`Reported issue ${issue.id}: "${issue.title}"`);
  }, [addIssue, logActivity]);

  const handleUpdateIssue = useCallback((id: string, patch: Partial<Issue>) => {
    updateIssue(id, patch);
    if (patch.feedback) {
      logActivity(`Submitted feedback for ${id}`);
    } else {
      logActivity(`Edited issue ${id}`);
    }
  }, [updateIssue, logActivity]);

  const handleDeleteIssue = useCallback((id: string) => {
    deleteIssue(id);
    logActivity(`Deleted issue ${id}`);
  }, [deleteIssue, logActivity]);

  const handleStatusChange = useCallback((id: string, status: Status) => {
    const issue = issues.find((i) => i.id === id);
    if (!issue) return;
    const now = new Date().toISOString();
    const newHistory = [
      ...issue.statusHistory,
      {
        status,
        note:
          status === 'In Progress'
            ? 'Issue taken up by maintenance team (demo admin).'
            : status === 'Resolved'
              ? 'Issue marked resolved (demo admin).'
              : 'Status reset to Submitted (demo admin).',
        at: now,
      },
    ];
    updateIssue(id, {
      status,
      statusHistory: newHistory,
      resolvedAt: status === 'Resolved' ? now : undefined,
    });
    logActivity(`Admin changed ${id} status to ${status}`);
  }, [issues, updateIssue, logActivity]);

  const currentLabel = NAV.find((n) => n.id === page)?.label ?? '';

  const pendingCount = issues.filter((i) => i.status !== 'Resolved').length;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            issues={issues}
            onReport={() => navigate('report')}
            onIssueClick={() => navigate('track')}
            onViewAll={() => navigate('track')}
          />
        );
      case 'report':
        return <ReportIssue onSubmit={handleAddIssue} existingIds={issues} />;
      case 'track':
        return (
          <TrackIssues issues={issues} adminMode={adminMode} onStatusChange={handleStatusChange} />
        );
      case 'myreports':
        return (
          <MyReports
            issues={issues}
            adminMode={adminMode}
            onStatusChange={handleStatusChange}
            onUpdate={handleUpdateIssue}
            onDelete={handleDeleteIssue}
          />
        );
      case 'map':
        return <CampusMap issues={issues} />;
      case 'analytics':
        return <Analytics issues={issues} />;
      case 'profile':
        return <ProfilePage issues={issues} activity={activity} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-teal-500 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-slate-900">CampusCare</p>
              <p className="text-[11px] text-slate-400">A better campus starts with you</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                />
                {item.label}
                {item.id === 'track' && pendingCount > 0 && (
                  <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin mode toggle */}
        <div className="m-3 rounded-xl border border-slate-200 p-3">
          <div className="mb-1.5 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            <span className="text-xs font-semibold text-slate-800">Demo Administrator</span>
          </div>
          <p className="mb-2.5 text-[11px] leading-relaxed text-slate-500">
            Simulated admin mode lets you change issue statuses. No real authority is contacted.
          </p>
          <button
            onClick={() => setAdminMode((v) => !v)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition ${
              adminMode
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              {adminMode ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
              {adminMode ? 'Admin mode ON' : 'Admin mode OFF'}
            </span>
            <span
              className={`h-4 w-7 rounded-full p-0.5 transition ${
                adminMode ? 'bg-white/30' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block h-3 w-3 rounded-full bg-white transition ${
                  adminMode ? 'translate-x-3' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">{currentLabel}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('report')}
              className="hidden btn-primary sm:inline-flex"
            >
              <FilePlus2 className="h-4 w-4" /> Quick Report
            </button>
            <button
              onClick={() => navigate('track')}
              className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{renderPage()}</main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-400">
          CampusCare · A better campus starts with you · Frontend prototype with sample data
        </footer>
      </div>
    </div>
  );
}
