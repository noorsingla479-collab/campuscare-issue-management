import type { Category, Status, Priority } from '@/types';
import {
  Zap, Droplets, Wifi, Sparkles, Wrench, School, CircleDot,
  type LucideIcon,
} from 'lucide-react';
import { CATEGORY_META, STATUS_META, PRIORITY_META } from '@/types';

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  Electricity: Zap,
  'Water Supply': Droplets,
  'Wi-Fi': Wifi,
  Cleanliness: Sparkles,
  'Hostel Maintenance': Wrench,
  'Classroom Facilities': School,
  Other: CircleDot,
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function CategoryBadge({ category, size = 'md' }: { category: Category; size?: 'sm' | 'md' }) {
  const meta = CATEGORY_META[category];
  const Icon = CATEGORY_ICONS[category];
  return (
    <span
      className={`chip ${meta.bg} ${meta.color} ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : ''}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {category}
    </span>
  );
}

export function StatusBadge({ status, size = 'md' }: { status: Status; size?: 'sm' | 'md' }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`chip ${meta.bg} ${meta.color} ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : ''}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority, size = 'md' }: { priority: Priority; size?: 'sm' | 'md' }) {
  const meta = PRIORITY_META[priority];
  return (
    <span
      className={`chip border ${meta.bg} ${meta.color} ${meta.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : ''
      }`}
    >
      {priority} priority
    </span>
  );
}
