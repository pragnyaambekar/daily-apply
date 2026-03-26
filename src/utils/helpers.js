import { TERMINAL_STATUSES } from '../constants';

export function formatSalary(app) {
    if (app.salaryMin && app.salaryMax) return `${app.salaryMin} – ${app.salaryMax}`;
    if (app.salaryMin) return `${app.salaryMin}`;
    if (app.salaryMax) return `Up to ${app.salaryMax}`;
    if (app.salary) return app.salary;
    return null;
}

export function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function daysSince(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function needsFollowUp(app) {
    if (TERMINAL_STATUSES.includes(app.status)) return false;
    const days = daysSince(app.updatedAt || app.createdAt);
    return days !== null && days >= 7;
}

export function computeStats(applications) {
    const total = applications.length;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = applications.filter(
        (a) => new Date(a.dateApplied) >= oneWeekAgo
    ).length;

    const statusCounts = {};
    applications.forEach((app) => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const activePipeline = applications.filter(
        (a) => !TERMINAL_STATUSES.includes(a.status)
    ).length;

    const offers = statusCounts['Offer'] || 0;

    return { total, thisWeek, statusCounts, activePipeline, offers };
}

export function exportToJSON(applications) {
    const data = JSON.stringify(applications, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function exportToCSV(applications) {
    const headers = [
        'Company',
        'Role',
        'Status',
        'Date Applied',
        'Location',
        'Job Type',
        'Salary',
        'URL',
        'Interview Date',
        'Notes',
    ];
    const rows = applications.map((a) => [
        `"${(a.company || '').replace(/"/g, '""')}"`,
        `"${(a.role || '').replace(/"/g, '""')}"`,
        `"${a.status}"`,
        a.dateApplied,
        `"${(a.location || '').replace(/"/g, '""')}"`,
        `"${a.jobType}"`,
        `"${(formatSalary(a) || '').replace(/"/g, '""')}"`,
        `"${(a.url || '').replace(/"/g, '""')}"`,
        a.interviewDate || '',
        `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export function importFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    resolve(data);
                } else {
                    reject(new Error('Invalid format: expected an array'));
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

export function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
