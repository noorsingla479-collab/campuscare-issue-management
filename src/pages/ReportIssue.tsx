import { useState, useRef } from 'react';
import type { Category, Location, Priority, Issue } from '@/types';
import { CATEGORIES, LOCATIONS, PRIORITIES, CATEGORY_META } from '@/types';
import { CATEGORY_ICONS } from '@/components/Badges';
import { useProfile } from '@/store';
import {
  Send, ImagePlus, X, CheckCircle2, AlertCircle, MapPin, Flag, FileText,
} from 'lucide-react';

interface ReportIssueProps {
  onSubmit: (issue: Issue) => void;
  existingIds: Issue[];
}

export function ReportIssue({ onSubmit, existingIds }: ReportIssueProps) {
  const { profile } = useProfile();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [location, setLocation] = useState<Location | ''>('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle('');
    setCategory('');
    setLocation('');
    setPriority('Medium');
    setDescription('');
    setImage(undefined);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setError('Image must be under 1.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const genId = () => {
    const nums = existingIds
      .map((i) => parseInt(i.id.replace(/\D/g, ''), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 1000;
    return `CC-${max + 1}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !category || !location || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    const id = genId();
    const now = new Date().toISOString();
    const issue: Issue = {
      id,
      title: title.trim(),
      category: category as Category,
      description: description.trim(),
      location: location as Location,
      priority,
      status: 'Submitted',
      image,
      submittedAt: now,
      author: profile.name,
      statusHistory: [{ status: 'Submitted', note: 'Issue reported by student.', at: now }],
    };
    onSubmit(issue);
    setSubmittedId(id);
    setSuccess(true);
    reset();
  };

  if (success) {
    return (
      <div className="animate-fade-in">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
            <CheckCircle2 className="h-8 w-8 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Issue submitted successfully</h2>
          <p className="mt-2 text-sm text-slate-500">
            Your report has been logged. Reference ID:
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-brand-600">{submittedId}</p>
          <p className="mt-3 text-xs text-slate-400">
            This is a frontend prototype — no real campus authority is notified.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setSuccess(false)}
              className="btn-primary"
            >
              Report another issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Report an Issue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tell us what's wrong and where. We'll log it and keep you updated.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="card p-5 space-y-4">
          <div>
            <label className="label">Issue title <span className="text-rose-500">*</span></label>
            <input
              className="input"
              placeholder="e.g. Broken projector in Lecture Hall 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={90}
            />
          </div>

          <div>
            <label className="label">
              <span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4" /> Category <span className="text-rose-500">*</span></span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((c) => {
                const meta = CATEGORY_META[c];
                const Icon = CATEGORY_ICONS[c];
                const selected = category === c;
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${
                      selected
                        ? 'border-brand-400 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.bg} ${meta.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location <span className="text-rose-500">*</span></span>
              </label>
              <select
                className="input"
                value={location}
                onChange={(e) => setLocation(e.target.value as Location)}
              >
                <option value="">Select a location</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="inline-flex items-center gap-1.5"><Flag className="h-4 w-4" /> Priority</span>
              </label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                      priority === p
                        ? p === 'High'
                          ? 'border-rose-300 bg-rose-50 text-rose-700'
                          : p === 'Medium'
                            ? 'border-amber-300 bg-amber-50 text-amber-700'
                            : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="label">Description <span className="text-rose-500">*</span></label>
            <textarea
              className="input min-h-[110px] resize-y"
              placeholder="Describe the issue in detail. What happened? When did it start?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <p className="mt-1 text-right text-xs text-slate-400">{description.length}/500</p>
          </div>

          <div>
            <label className="label">Attach an image (optional)</label>
            {image ? (
              <div className="relative inline-block">
                <img src={image} alt="Preview" className="h-40 w-auto rounded-xl border border-slate-200 object-cover" />
                <button
                  type="button"
                  onClick={() => { setImage(undefined); if (fileRef.current) fileRef.current.value = ''; }}
                  className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-md transition hover:bg-rose-600"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center transition hover:border-brand-300 hover:bg-brand-50/50">
                <ImagePlus className="h-6 w-6 text-slate-400" />
                <span className="text-sm font-medium text-slate-500">Click to upload an image</span>
                <span className="text-xs text-slate-400">PNG, JPG up to 1.5 MB</span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={reset} className="btn-secondary">Reset</button>
          <button type="submit" className="btn-primary">
            <Send className="h-4 w-4" /> Submit Issue
          </button>
        </div>
      </form>
    </div>
  );
}
