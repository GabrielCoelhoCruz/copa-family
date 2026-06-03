import type { ZodError } from 'zod'

export type ActionState = {
  error?: string
  fieldErrors?: Record<string, string>
}

export function actionStateFromZod(error: ZodError, fallback: string): ActionState {
  const fieldErrors: Record<string, string> = {}

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && fieldErrors[field] === undefined) {
      fieldErrors[field] = issue.message
    }
  }

  return {
    error: error.issues[0]?.message ?? fallback,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
  }
}

export function hasFieldErrors(state: ActionState): boolean {
  return Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0)
}
