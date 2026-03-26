export const STATUSES = [
    'Applied',
    'OA',
    'Phone Screen',
    'Technical Round',
    'Onsite/Final',
    'Offer',
    'Rejected',
    'Ghosted',
    'Withdrawn',
];

export const KANBAN_COLUMNS = [
    'Applied',
    'OA',
    'Phone Screen',
    'Technical Round',
    'Onsite/Final',
    'Rejected',
    'Ghosted',
];

export const JOB_TYPES = ['Full-time', 'Internship', 'Contract'];

export const STATUS_COLORS = {
    'Applied': { bg: '#3b82f620', text: '#3b82f6', border: '#3b82f6' },
    'OA': { bg: '#06b6d420', text: '#06b6d4', border: '#06b6d4' },
    'Phone Screen': { bg: '#f59e0b20', text: '#f59e0b', border: '#f59e0b' },
    'Technical Round': { bg: '#f9731620', text: '#f97316', border: '#f97316' },
    'Onsite/Final': { bg: '#ec489920', text: '#ec4899', border: '#ec4899' },
    'Offer': { bg: '#10b98120', text: '#10b981', border: '#10b981' },
    'Rejected': { bg: '#ef444420', text: '#ef4444', border: '#ef4444' },
    'Ghosted': { bg: '#6b728020', text: '#6b7280', border: '#6b7280' },
    'Withdrawn': { bg: '#a1a1aa20', text: '#a1a1aa', border: '#a1a1aa' },
};

export const TERMINAL_STATUSES = ['Offer', 'Rejected', 'Ghosted', 'Withdrawn'];

export const SALARY_OPTIONS = [
    '',
    ...Array.from({ length: 46 }, (_, i) => `$${(i + 5) * 10}k`),
    '$500k+'
];

export const EMPTY_APPLICATION = {
    id: '',
    company: '',
    role: '',
    url: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    dateApplied: new Date().toISOString().split('T')[0],
    status: 'Applied',
    salaryMin: '',
    salaryMax: '',
    resumeFile: null,
    resumeName: '',
    interviewDate: '',
    notes: '',
    createdAt: '',
    updatedAt: '',
};
