/**
 * Reference data (campuses, departments, roster, roles, categories) rarely
 * changes during a session, so it is cached rather than refetched per mount.
 * Anything tied to a live service — attendance, clock-in state, reports,
 * instant messages — must not use this.
 */
export const REFERENCE_DATA_STALE_TIME = 1000 * 60 * 60; // 1 hour

/**
 * Data that moves while a service is running and has no other refresh trigger:
 * the live service, attendance reports and instant messages.
 */
export const LIVE_DATA_REFETCH_INTERVAL = 1000 * 60; // 1 minute
