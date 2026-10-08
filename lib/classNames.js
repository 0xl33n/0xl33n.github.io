/** Joins truthy class names with a single space. */
export function classNames(...names) {
  return names.filter(Boolean).join(' ');
}
