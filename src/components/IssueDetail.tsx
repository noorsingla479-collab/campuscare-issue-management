import { useEffect } from 'react';
import type { Issue, Status } from '@/types';
import { Modal } from './Modal';
import { CategoryBadge, StatusBadge, PriorityBadge, formatDate, formatDateTime, timeAgo } from './Badges';
import { CATEGORY_ICONS } from './Badges';
import { CheckCircle2, Circle, Clock, MapPin, Calendar, User, MessageSquare, Star } from 'lucide-react';
import { STATUSES } from '@/types';

interface IssueDetailProps {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: Status) => void;
  adminMode?: boolean;
  extraFooter?: React.ReactNode;
}

const STATUS_ORDER: Status[] = ['Submitted', 'In Progress', 'Resolved'];

export function IssueDetail({
  issue,
  open,
  onClose,
  onStatusChange,
  adminMode = false,
  extraFooter,
}: IssueDetailProps) {
  useEffect(() => {
    return;
  }, [issue]);

  if (!issue) return null;
  const Icon = CATEGORY_ICONS[issue.category];
  const currentStep = STATUS_ORDER.indexOf(issue.status);

  return (
    <Modal open={open} onClose={onClose} title={`Issue ${issue.id}`} size="xl">
      <div className="space-y-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} size="sm" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{issue.title}</h2>
        </div>

        {/* Progress tracker */}
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            {STATUS_ORDER.map((s, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              return (
                <div key={s} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        done
                          ? 'bg-brand-600 text-white'
                          : 'bg-white border-2 border-slate-200 text-slate-300'
                      } ${active ? 'ring-4 ring-brand-100' : ''}`}
                    >
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        done ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                  {i < STATUS_ORDER.length - 1 && (
                    <div
                      className={`mx-1 h-0.5 flex-1 rounded transition ${
                        i < currentStep ? 'bg-brand-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Icon className="h-3.5 w-3.5" /> Category
            </div>
            <p className="text-sm font-medium text-slate-800">{issue.category}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <MapPin className="h-3.5 w-3.5" /> Location
            </div>
            <p className="text-sm font-medium text-slate-800">{issue.location}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="h-3.5 w-3.5" /> Submitted
            </div>
            <p className="text-sm font-medium text-slate-800">
              {formatDate(issue.submittedAt)}
              <span className="ml-1 text-xs text-slate-400">({timeAgo(issue.submittedAt)})</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <User className="h-3.5 w-3.5" /> Reported by
            </div>
            <p className="text-sm font-medium text-slate-800">{issue.author}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-1.5 text-sm font-semibold text-slate-700">Description</h4>
          <p className="rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
            {issue.description}
          </p>
        </div>

        {issue.image && (
          <div>
            <h4 className="mb-1.5 text-sm font-semibold text-slate-700">Attached image</h4>
            <img
              src={issue.image}
              alt={issue.title}
              className="max-h-64 w-full rounded-xl object-cover"
            />
          </div>
        )}

        {/* Timeline */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700">Status timeline</h4>
          <ol className="relative space-y-3 border-l-2 border-slate-100 pl-4">
            {issue.statusHistory.map((h, i) => (
              <li key={i} className="relative">
                <span
                  className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                    h.status === 'Resolved'
                      ? 'bg-teal-500'
                      : h.status === 'In Progress'
                        ? 'bg-brand-500'
                        : 'bg-slate-400'
                  }`}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">{h.status}</span>
                  <span className="text-xs text-slate-400">{formatDateTime(h.at)}</span>
                </div>
                <p className="text-xs text-slate-500">{h.note}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Feedback */}
        {issue.feedback && (
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-teal-800">
              <MessageSquare className="h-4 w-4" /> Your feedback
            </div>
            <div className="mb-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < issue.feedback!.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-600">"{issue.feedback.comment}"</p>
          </div>
        )}

        {/* Admin controls */}
        {adminMode && onStatusChange && issue.status !== 'Resolved' && (
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-brand-800">
              <Clock className="h-4 w-4" /> Demo Administrator mode
            </div>
            <p className="mb-2 text-xs text-brand-700">
              This is a simulated admin action. No real campus authority is notified.
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.filter((s) => s !== issue.status).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(issue.id, s)}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 border border-brand-200 transition hover:bg-brand-100"
                >
                  Mark as {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {extraFooter && <div className="border-t border-slate-100 pt-4">{extraFooter}</div>}
      </div>
    </Modal>
  );
}
