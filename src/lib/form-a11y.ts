export function fieldDescribedBy(
  hintId: string,
  errorId: string,
  fieldError?: string
): string {
  return fieldError ? `${hintId} ${errorId}` : hintId
}
