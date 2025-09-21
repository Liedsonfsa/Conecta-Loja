import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine classes with tailwind-merge for optimal class merging
 * @param {...string} inputs - Class strings to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
