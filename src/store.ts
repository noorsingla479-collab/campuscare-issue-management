import { useEffect, useState, useCallback } from 'react';
import type { Issue, StudentProfile, ActivityLog } from '@/types';

const ISSUES_KEY = 'campuscare.issues';
const PROFILE_KEY = 'campuscare.profile';
const ACTIVITY_KEY = 'campuscare.activity';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9 + (n % 8), (n * 7) % 60, 0, 0);
  return d.toISOString();
};

const SAMPLE_ISSUES: Issue[] = [
  {
    id: 'CC-1001',
    title: 'Flickering lights in Room 204',
    category: 'Electricity',
    description:
      'The ceiling lights in Room 204 of the Academic Block flicker continuously, making it hard to attend lectures. Started two days ago.',
    location: 'Academic Block',
    priority: 'Medium',
    status: 'In Progress',
    submittedAt: daysAgo(2),
    author: 'Aarav Sharma',
    statusHistory: [
      { status: 'Submitted', note: 'Issue reported by student.', at: daysAgo(2) },
      {
        status: 'In Progress',
        note: 'Electrician assigned, inspection scheduled.',
        at: daysAgo(1),
      },
    ],
  },
  {
    id: 'CC-1002',
    title: 'No water supply in Hostel B wing',
    category: 'Water Supply',
    description: 'There has been no water in the B wing bathrooms of Hostel 3 since morning.',
    location: 'Hostel',
    priority: 'High',
    status: 'Resolved',
    submittedAt: daysAgo(6),
    resolvedAt: daysAgo(4),
    author: 'Aarav Sharma',
    statusHistory: [
      { status: 'Submitted', note: 'Issue reported by student.', at: daysAgo(6) },
      { status: 'In Progress', note: 'Plumber dispatched to Hostel 3.', at: daysAgo(5) },
      { status: 'Resolved', note: 'Pipe valve replaced, supply restored.', at: daysAgo(4) },
    ],
    feedback: { rating: 5, comment: 'Very quick response, thank you!', at: daysAgo(3) },
  },
  {
    id: 'CC-1003',
    title: 'Slow Wi-Fi in Library reading hall',
    category: 'Wi-Fi',
    description: 'Wi-Fi connectivity in the library reading hall is extremely slow during evening hours.',
    location: 'Library',
    priority: 'Medium',
    status: 'Submitted',
    submittedAt: daysAgo(1),
    author: 'Priya Verma',
    statusHistory: [{ status: 'Submitted', note: 'Issue reported by student.', at: daysAgo(1) }],
  },
  {
    id: 'CC-1004',
    title: 'Cafeteria tables not cleaned',
    category: 'Cleanliness',
    description: 'Several tables in the cafeteria remain uncleaned after lunch hours.',
    location: 'Cafeteria',
    priority: 'Low',
    status: 'Resolved',
    submittedAt: daysAgo(10),
    resolvedAt: daysAgo(8),
    author: 'Rohan Mehta',
    statusHistory: [
      { status: 'Submitted', note: 'Issue reported by student.', at: daysAgo(10) },
      { status: 'In Progress', note: 'Cleaning staff notified.', at: daysAgo(9) },
      { status: 'Resolved', note: 'Cleaning schedule updated.', at: daysAgo(8) },
    ],
    feedback: { rating: 4, comment: 'Better, but needs consistency.', at: daysAgo(7) },
  },
  {
    id: 'CC-1005',
    title: 'Broken chair in Classroom 12',
    category: 'Classroom Facilities',
    description: 'Three chairs in Classroom 12 are broken and unsafe to sit on.',
    location: 'Academic Block',
    priority: 'Medium',
    status: 'In Progress',
    submittedAt: daysAgo(3),
    author: 'Sneha Iyer',
    statusHistory: [
      { status: 'Submitted', note: 'Issue reported by student.', at: daysAgo(3) },
      { status: 'In Progress', note: 'New chairs requisitioned.', at: daysAgo(2) },
    ],
  },
  {
    id: 'CC-1006',
    title: 'Washroom tap leaking near Sports Area',
    category: 'Water Supply',
    description: 'A tap near the sports complex washroom has been leaking continuously.',
    location: 'Sports Area',
    priority: 'Low',
    status: 'Submitted',
    submittedAt: daysAgo(0),
    author: 'Aarav Sharma',
    statusHistory: [{ status: 'Submitted', note: 'Issue reported by student.', at: daysAgo(0) }],
  },
  {
    id: 'CC-1007',
    title: 'Hostel room window latch broken',
    category: 'Hostel Maintenance',
    description: 'The window latch in Hostel 5, Room 112 is broken and wont close properly.',
    location: 'Hostel',
    priority: 'Medium',
    status: 'Resolved',
    submittedAt: daysAgo(14),
    resolvedAt: daysAgo(11),
    author: 'Karan Singh',
    statusHistory: [
      { status: 'Submitted', note: 'Issue reported by student.', at: daysAgo(14) },
      { status: 'In Progress', note: 'Maintenance request filed.', at: daysAgo(13) },
      { status: 'Resolved', note: 'Latch replaced.', at: daysAgo(11) },
    ],
  },
  {
    id: 'CC-1008',
    title: 'Projector not working in Lecture Hall 1',
    category: 'Classroom Facilities',
    description: 'The projector in Lecture Hall 1 does not power on, affecting morning lectures.',
    location: 'Academic Block',
    priority: 'High',
    status: 'In Progress',
    submittedAt: daysAgo(4),
    author: 'Priya Verma',
    statusHistory: [
      { status: 'Submitted', note: 'Issue reported by student.', at: daysAgo(4) },
      { status: 'In Progress', note: 'Technician inspecting projector unit.', at: daysAgo(3) },
    ],
  },
];

const SAMPLE_PROFILE: StudentProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@campus.edu',
  rollNo: 'CS21-042',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  phone: '+91 98765 43210',
};

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>(() => {
    const existing = read<Issue[] | null>(ISSUES_KEY, null);
    if (existing && existing.length > 0) return existing;
    write(ISSUES_KEY, SAMPLE_ISSUES);
    return SAMPLE_ISSUES;
  });

  useEffect(() => {
    write(ISSUES_KEY, issues);
  }, [issues]);

  const addIssue = useCallback((issue: Issue) => {
    setIssues((prev) => [issue, ...prev]);
  }, []);

  const updateIssue = useCallback((id: string, patch: Partial<Issue>) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const deleteIssue = useCallback((id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { issues, addIssue, updateIssue, deleteIssue, setIssues };
}

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile>(() =>
    read<StudentProfile>(PROFILE_KEY, SAMPLE_PROFILE),
  );

  useEffect(() => {
    write(PROFILE_KEY, profile);
  }, [profile]);

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  return { profile, updateProfile };
}

export function useActivity() {
  const [activity, setActivity] = useState<ActivityLog[]>(() =>
    read<ActivityLog[]>(ACTIVITY_KEY, []),
  );

  useEffect(() => {
    write(ACTIVITY_KEY, activity);
  }, [activity]);

  const logActivity = useCallback((action: string) => {
    const entry: ActivityLog = {
      id: `ACT-${Date.now()}`,
      action,
      at: new Date().toISOString(),
    };
    setActivity((prev) => [entry, ...prev].slice(0, 50));
  }, []);

  return { activity, logActivity };
}

export function generateId(existing: Issue[]): string {
  const nums = existing
    .map((i) => parseInt(i.id.replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `CC-${max + 1}`;
}
