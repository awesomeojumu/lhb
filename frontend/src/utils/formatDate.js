// src/utils/formatDate.js
import { format, isValid, parseISO } from "date-fns";

/**
 * Formats a date to a readable string.
 * @param {string|Date} date - Date string or object.
 * @param {string} pattern - Format pattern (default: 'dd MMM yyyy').
 */
export const formatDate = (date, pattern = "dd MMM yyyy") => {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, pattern) : "";
};

/**
 * Converts to ISO date string for API submission (yyyy-MM-dd).
 */
export const toISODate = (date) => {
  if (!date) return null;
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return isValid(parsedDate) ? parsedDate.toISOString() : null;
};
