export type Category =
  | 'Electricity'
  | 'Water Supply'
  | 'Wi-Fi'
  | 'Cleanliness'
  | 'Hostel Maintenance'
  | 'Classroom Facilities'
  | 'Other';

export type Location =
  | 'Hostel'
  | 'Academic Block'
  | 'Library'
  | 'Cafeteria'
  | 'Washroom'
  | 'Sports Area'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High';

export type Status = 'Submitted' | 'In Progress' | 'Resolved';

export interface StatusUpdate {
  status: Status;
  note: string;
  at: string;
}

export interface Feedback {
  rating: number;
  comment: string;
  at: string;
}

export interface Issue {
  id: string;
  title: string;
  category: Category;
  description: string;
  location: Location;
  priority: Priority;
  status: Status;
  image?: string;
  submittedAt: string;
  resolvedAt?: string;
  statusHistory: StatusUpdate[];
  feedback?: Feedback;
  author: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  rollNo: string;
  department: string;
  year: string;
  phone: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  at: string;
}

export const CATEGORIES: Category[] = [
  'Electricity',
  'Water Supply',
  'Wi-Fi',
  'Cleanliness',
  'Hostel Maintenance',
  'Classroom Facilities',
  'Other',
];

export const LOCATIONS: Location[] = [
  'Hostel',
  'Academic Block',
  'Library',
  'Cafeteria',
  'Washroom',
  'Sports Area',
  'Other',
];

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

export const STATUSES: Status[] = ['Submitted', 'In Progress', 'Resolved'];

export const CATEGORY_META: Record<Category, { color: string; bg: string; icon: string }> = {
  Electricity: { color: 'text-amber-700', bg: 'bg-amber-50', icon: 'Zap' },
  'Water Supply': { color: 'text-sky-700', bg: 'bg-sky-50', icon: 'Droplets' },
  'Wi-Fi': { color: 'text-violet-700', bg: 'bg-violet-50', icon: 'Wifi' },
  Cleanliness: { color: 'text-emerald-700', bg: 'bg-emerald-50', icon: 'Sparkles' },
  'Hostel Maintenance': { color: 'text-rose-700', bg: 'bg-rose-50', icon: 'Wrench' },
  'Classroom Facilities': { color: 'text-brand-700', bg: 'bg-brand-50', icon: 'School' },
  Other: { color: 'text-slate-700', bg: 'bg-slate-100', icon: 'CircleDot' },
};

export const PRIORITY_META: Record<Priority, { color: string; bg: string; border: string }> = {
  Low: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  High: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
};

export const STATUS_META: Record<Status, { color: string; bg: string; dot: string }> = {
  Submitted: { color: 'text-slate-700', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  'In Progress': { color: 'text-brand-700', bg: 'bg-brand-50', dot: 'bg-brand-500' },
  Resolved: { color: 'text-teal-700', bg: 'bg-teal-50', dot: 'bg-teal-500' },
};
