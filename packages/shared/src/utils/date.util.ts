
import { format as formatDateFn } from 'date-fns';

/**
 * Get today's date with time reset to 00:00:00
 */
export function getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

/**
 * Get difference in days between two dates
 */
export function getDayDifference(start: Date, end: Date): number {
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Add days to a given date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Subtract days from a given date
 */
export function subtractDays(date: Date, days: number): Date {
    return addDays(date, -days);
}

/**
 * Format date using `date-fns` or native fallback
 */
export function formatDate(date: Date, formatStr = 'yyyy-MM-dd'): string {
    try {
        return formatDateFn(date, formatStr); // using date-fns
    } catch {
        return date.toISOString().split('T')[0]; // fallback
    }
}

/**
 * Compare two dates (ignores time)
 * Returns:
 * -1 if a < b
 *  0 if a == b
 *  1 if a > b
 */
export function compareDates(a: Date, b: Date): number {
    const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return da < db ? -1 : da > db ? 1 : 0;
}

/**
 * Check if a date is between two dates (inclusive)
 */
export function isBetween(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
}

/**
 * Check if two dates are the same day (ignoring time)
 */
export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/**
 * Strip time portion from date (00:00:00)
 */
export function stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Convert date to ISO string (without time)
 */
export function toIsoDate(date: Date): string {
    return date.toISOString().split('T')[0];
}
