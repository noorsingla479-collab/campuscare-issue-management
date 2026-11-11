import { useState } from 'react';
import type { Issue, StudentProfile, ActivityLog } from '@/types';
import { useProfile } from '@/store';
import {
  User, Mail, Hash, Building2, GraduationCap, Phone, Save, Pencil,
  ClipboardList, CheckCircle2, History, Star, MessageSquare,
} from 'lucide-react';
import { formatDate, formatDateTime, CategoryBadge, StatusBadge } from '@/components/Badges';

interface ProfilePageProps {
  issues: Issue[];
  activity: ActivityLog[];
}

export function ProfilePage({ issues, activity }: ProfilePageProps) {
  const { profile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<StudentProfile>(profile);
  const [saved, setSaved] = useState(false);

  const myIssues = issues.filter((i) => i.author === profile.name);
  const myResolved = myIssues.filter((i) => i.status === 'Resolved');
  const myFeedback = myIssues.filter((i) => i.feedback);

  const handleSave = () => {
    updateProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    { key: 'name', label: 'Full name', icon: User, type: 'text' },
    { key: 'email', label: 'Email', icon: Mail, type: 'email' },
    { key: 'rollNo', label: 'Roll number', icon: Hash, type: 'text' },
    { key: 'department', label: 'Department', icon: Building2, type: 'text' },
    { key: 'year', label: 'Year', icon: GraduationCap, type: 'text' },
    { key: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
  ] as const;

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Your details, report stats, and activity history.</p>
        </div>
        {!editing && (
          <button onClick={() => { setDraft(profile); setEditing(true); }} className="btn-secondary">
            <Pencil className="h-4 w-4" /> Edit profile
          </button>
        )}
      </div>

      {/* Profile card */}
      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-600 to-teal-500" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-brand-100 text-2xl font-bold text-brand-700 shadow-sm">
              {profile.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm text-slate-500">{profile.rollNo} · {profile.department}</p>
            </div>
          </div>

          {saved && (
            <div className="mt-4 rounded-xl bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-700">
              Profile saved successfully.
            </div>
          )}

          {editing ? (
            <div className="mt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className="label">
                      <span className="inline-flex items-center gap-1.5"><f.icon className="h-4 w-4" /> {f.label}</span>
                    </label>
                    <input
                      className="input"
                      type={f.type}
                      value={draft[f.key]}
                      onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary">
                  <Save className="h-4 w-4" /> Save changes
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">{f.label}</p>
                    <p className="truncate text-sm font-medium text-slate-800">{profile[f.key]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ClipboardList className="h-5 w-5" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{myIssues.length}</p>
          <p className="text-sm text-slate-500">Total reports submitted</p>
        </div>
        <div className="card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{myResolved.length}</p>
          <p className="text-sm text-slate-500">Resolved reports</p>
        </div>
        <div className="card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Star className="h-5 w-5" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{myFeedback.length}</p>
          <p className="text-sm text-slate-500">Feedback submitted</p>
        </div>
      </div>

      {/* Activity history */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
        </div>

        {/* recent issues as activity */}
        <div className="space-y-2">
          {myIssues.slice(0, 6).map((issue) => (
            <div key={issue.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{issue.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <CategoryBadge category={issue.category} size="sm" />
                  <StatusBadge status={issue.status} size="sm" />
                </div>
              </div>
              <span className="flex-shrink-0 text-xs text-slate-400">{formatDate(issue.submittedAt)}</span>
            </div>
          ))}

          {activity.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 p-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <MessageSquare className="h-3.5 w-3.5" />
              </span>
              <p className="flex-1 truncate text-sm text-slate-600">{a.action}</p>
              <span className="flex-shrink-0 text-xs text-slate-400">{formatDateTime(a.at)}</span>
            </div>
          ))}

          {myIssues.length === 0 && activity.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
