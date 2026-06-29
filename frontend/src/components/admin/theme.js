// Shared color tokens for the admin dashboard — fixed light/navy palette,
// independent of the site-wide dark-mode toggle.

export const D = {
  font:     "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  ivory:    '#ffffff',
  paper:    '#f6f7f9',
  paper3:   '#eef0f3',
  ink:      '#0b1f3a',
  slate:    '#4b5b75',
  mute:     '#8a8d96',
  rule:     '#e6e7eb',
  cobalt:   '#1e3a8a',
  cobaltHi: '#2546b8',
  error:    '#991b1b',
  errorBg:  '#fee2e2',
};

export const BRK = {
  bg:     '#0b1f3a',
  bg2:    '#06152b',
  fg:     '#ffffff',
  mute:   'rgba(255,255,255,0.65)',
  mute2:  'rgba(255,255,255,0.4)',
  line:   'rgba(255,255,255,0.10)',
  accent: '#7c9bff',
};

// ── Status badge config (Driver / Member / Trip enums) ───────────────────
export const STATUS_CFG = {
  ACTIVE:      { label: 'Active',      bg: '#2546b8',              color: '#fff' },
  PENDING:     { label: 'Pending',     bg: D.paper,                color: D.slate, border: `1px solid ${D.rule}` },
  SUSPENDED:   { label: 'Suspended',   bg: '#fee2e2',               color: '#991b1b' },
  INACTIVE:    { label: 'Inactive',    bg: '#fee2e2',               color: '#991b1b' },
  REQUESTED:   { label: 'Requested',   bg: '#fffbeb',               color: '#92400e', border: '1px solid #fde68a' },
  ACCEPTED:    { label: 'Accepted',    bg: 'rgba(37,70,184,0.11)',  color: '#2546b8' },
  IN_PROGRESS: { label: 'En Route',    bg: '#fff7ed',               color: '#c2410c', border: '1px solid #fed7aa' },
  COMPLETED:   { label: 'Completed',   bg: '#0b1f3a',               color: '#fff' },
  CANCELLED:   { label: 'Cancelled',   bg: '#fee2e2',               color: '#991b1b' },
};
