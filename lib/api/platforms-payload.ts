export type PlatformDto = {
  slug: string;
  name: string;
};

function normalizePlatform(item: unknown): PlatformDto | null {
  if (!item || typeof item !== "object") {
    return null;
  }
  const record = item as Record<string, unknown>;
  const slug = typeof record.slug === "string" ? record.slug.trim() : "";
  const name = typeof record.name === "string" ? record.name.trim() : "";
  if (!slug || !name) {
    return null;
  }
  return { slug, name };
}

/**
 * Maps Laravel `PlatformResource::collection` responses and plain arrays to DTOs.
 */
export function parsePlatformsPayload(raw: unknown): PlatformDto[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => normalizePlatform(item))
      .filter((p): p is PlatformDto => p !== null);
  }

  if (raw && typeof raw === "object" && "data" in raw) {
    const data = (raw as { data: unknown }).data;
    if (Array.isArray(data)) {
      return data
        .map((item) => normalizePlatform(item))
        .filter((p): p is PlatformDto => p !== null);
    }
  }

  return [];
}
