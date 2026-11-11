import { useMemo, useState } from 'react';
import type { Issue, Status, Category, Location, Priority } from '@/types';
import { CATEGORIES, LOCATIONS, PRIORITIES } from '@/types';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetail } from '@/components/IssueDetail';
import { Modal } from '@/components/Modal';
import { useProfile } from '@/store';
import {
  Search, Inbox, Pencil, Trash2, Star, MessageSquare, AlertCircle, Save,
} from 'lucide-react';

interface MyReportsProps {
  issues: Issue[];
  adminMode: boolean;
  onStatusChange: (id: string, status: Status) => void;
  onUpdate: (id: string, patch: Partial<Issue>) => void;
  onDelete: (id: string) => void;
}

export function MyReports({ issues, adminMode, onStatusChange, onUpdate, onDelete }: MyReportsProps) {
  const { profile } = useProfile();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Issue | null>(null);
  const [editing, setEditing] = useState<Issue | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Issue | null>(null);
  const [feedbackFor, setFeedbackFor] = useState<Issue | null>(null);

  const myIssues = useMemo(
    () => issues.filter((i) => i.author === profile.name),
    [issues, profile.name],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return myIssues;
    const q = query.toLowerCase();
    return myIssues.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q),
    );
  }, [myIssues, query]);

  const currentSelected = selected ? issues.find((i) => i.id === selected.id) ?? null : null;

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">My Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Issues you've submitted. Edit or delete pending reports, and leave feedback on resolved ones.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-4">
          <p className="text-2xl font-bold text-slate-900">{myIssues.length}</p>
          <p className="text-xs text-slate-500">Total reports</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-slate-600">
            {myIssues.filter((i) => i.status === 'Submitted').length}
          </p>
          <p className="text-xs text-slate-500">Pending</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-brand-600">
            {myIssues.filter((i) => i.status === 'In Progress').length}
          </p>
          <p className="text-xs text-slate-500">In progress</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-teal-600">
            {myIssues.filter((i) => i.status === 'Resolved').length}
          </p>
          <p className="text-xs text-slate-500">Resolved</p>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Search your reports..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((issue) => (
            <div key={issue.id} className="relative">
              <IssueCard issue={issue} onClick={() => setSelected(issue)} />
              <div className="absolute right-3 top-3 z-10 flex gap-1">
                {issue.status !== 'Resolved' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditing(issue); }}
                    className="rounded-lg bg-white/90 p-1.5 text-slate-500 shadow-sm transition hover:bg-white hover:text-brand-600"
                    aria-label="Edit issue"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
                {issue.status !== 'Resolved' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(issue); }}
                    className="rounded-lg bg-white/90 p-1.5 text-slate-500 shadow-sm transition hover:bg-white hover:text-rose-600"
                    aria-label="Delete issue"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                {issue.status === 'Resolved' && !issue.feedback && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setFeedbackFor(issue); }}
                    className="rounded-lg bg-teal-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm transition hover:bg-teal-600"
                  >
                    + Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Inbox className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {query ? "No reports match your search" : "You haven't reported any issues yet"}
          </p>
        </div>
      )}

      {/* Detail */}
      <IssueDetail
        issue={currentSelected}
        open={!!currentSelected}
        onClose={() => setSelected(null)}
        adminMode={adminMode}
        onStatusChange={onStatusChange}
        extraFooter={
          currentSelected && currentSelected.status === 'Resolved' && !currentSelected.feedback ? (
            <button
              onClick={() => { setFeedbackFor(currentSelected); setSelected(null); }}
              className="btn-primary w-full"
            >
              <Star className="h-4 w-4" /> Leave feedback
            </button>
          ) : currentSelected && currentSelected.status !== 'Resolved' ? (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(currentSelected); setSelected(null); }}
                className="btn-secondary flex-1"
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => { setConfirmDelete(currentSelected); setSelected(null); }}
                className="btn-secondary flex-1 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          ) : null
        }
      />

      {/* Edit modal */}
      <EditModal
        issue={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          if (editing) onUpdate(editing.id, patch);
          setEditing(null);
        }}
      />

      {/* Delete confirm */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete report" size="md">
        {confirmDelete && (
          <div>
            <div className="mb-3 flex items-center gap-2 text-rose-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">This cannot be undone</span>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold">{confirmDelete.title}</span> ({confirmDelete.id})?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Cancel</button>
              <button
                onClick={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }}
                className="btn-primary bg-rose-600 hover:bg-rose-700"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Feedback modal */}
      <FeedbackModal
        issue={feedbackFor}
        open={!!feedbackFor}
        onClose={() => setFeedbackFor(null)}
        onSubmit={(rating, comment) => {
          if (feedbackFor) {
            onUpdate(feedbackFor.id, {
              feedback: { rating, comment, at: new Date().toISOString() },
            });
          }
          setFeedbackFor(null);
        }}
      />
    </div>
  );
}

function EditModal({
  issue,
  open,
  onClose,
  onSave,
}: {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
  onSave: (patch: Partial<Issue>) => void;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [location, setLocation] = useState<Location>('Other');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [description, setDescription] = useState('');

  // sync when issue changes
  useMemo(() => {
    if (issue) {
      setTitle(issue.title);
      setCategory(issue.category);
      setLocation(issue.location);
      setPriority(issue.priority);
      setDescription(issue.description);
    }
  }, [issue]);

  if (!issue) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit ${issue.id}`} size="lg">
      <div className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <select className="input" value={location} onChange={(e) => setLocation(e.target.value as Location)}>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={() => onSave({ title: title.trim(), category, location, priority, description: description.trim() })}
            className="btn-primary"
          >
            <Save className="h-4 w-4" /> Save changes
          </button>
        </div>
      </div>
    </Modal>
  );
}

function FeedbackModal({
  issue,
  open,
  onClose,
  onSubmit,
}: {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useMemo(() => {
    if (issue) { setRating(5); setComment(''); }
  }, [issue]);

  if (!issue) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Feedback for ${issue.id}`} size="md">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          How was your experience with the resolution of <span className="font-semibold">"{issue.title}"</span>?
        </p>
        <div>
          <label className="label">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className="transition active:scale-90"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`h-8 w-8 ${
                    n <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Comment</label>
          <textarea
            className="input min-h-[90px]"
            placeholder="Share your thoughts about the resolution..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={300}
          />
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={() => onSubmit(rating, comment.trim())} className="btn-primary">
            <MessageSquare className="h-4 w-4" /> Submit feedback
          </button>
        </div>
      </div>
    </Modal>
  );
}
