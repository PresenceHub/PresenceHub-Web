export type ApiFieldErrors = Record<string, string[]>;

export type NormalizedApiError = {
  message: string;
  fieldErrors?: ApiFieldErrors;
};

function firstMessage(errors: ApiFieldErrors): string | undefined {
  for (const msgs of Object.values(errors)) {
    if (msgs?.length) return msgs[0];
  }
  return undefined;
}

/** Laravel-style `{ message, errors: { field: string[] } }` */
export function normalizeApiErrorBody(body: unknown): NormalizedApiError {
  if (!body || typeof body !== "object") {
    return { message: "Request failed" };
  }
  const o = body as Record<string, unknown>;
  const message = typeof o.message === "string" ? o.message : "Request failed";

  const rawErrors = o.errors;
  if (!rawErrors || typeof rawErrors !== "object" || Array.isArray(rawErrors)) {
    return { message };
  }

  const fieldErrors: ApiFieldErrors = {};
  for (const [key, val] of Object.entries(rawErrors)) {
    if (Array.isArray(val) && val.every((v) => typeof v === "string")) {
      fieldErrors[key] = val as string[];
    }
  }

  const merged =
    Object.keys(fieldErrors).length > 0
      ? { message: firstMessage(fieldErrors) ?? message, fieldErrors }
      : { message };

  return merged;
}
