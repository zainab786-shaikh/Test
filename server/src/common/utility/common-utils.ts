export function generateNextCode(prefix: string, lastPath?: string): string {
  if (!lastPath) return `${prefix}01`;

  const match = lastPath.match(new RegExp(`${prefix}(\\d+)`));
  const lastNumber = match ? parseInt(match[1], 10) : 0;

  return `${prefix}${String(lastNumber + 1).padStart(2, '0')}`;
}