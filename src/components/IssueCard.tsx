import type { Issue } from '@/types';
import { CategoryBadge, StatusBadge, PriorityBadge, formatDate } from './Badges';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
  showAuthor?: boolean;
}

export function IssueCard({ issue, onClick, showAuthor }: IssueCardProps) {
  return (
    <button
      onClick={onClick}
      className="card group w-full p-4 text-left transition hover:shadow-card-hover hover:border-brand-200 active:scale-[0.99] cursor-pointer"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-brand-600">{issue.id}</span>
            <StatusBadge status={issue.status} size="sm" />
          </div>
          <h4 className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-700">
            {issue.title}
          </h4>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-slate-500">{issue.description}</p>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={issue.category} size="sm" />
        <PriorityBadge priority={issue.priority} size="sm" />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {issue.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {formatDate(issue.submittedAt)}
        </span>
        {showAuthor && <span className="inline-flex items-center gap-1">by {issue.author}</span>}
      </div>
    </button>
  );
}
