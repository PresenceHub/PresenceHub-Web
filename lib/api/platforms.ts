import "server-only";

import {
  API_URL_NOT_CONFIGURED_MESSAGE,
  apiGetJson,
  getPresenceHubApiWithBearer,
} from "./client";
import { parsePlatformsPayload, type PlatformDto } from "./platforms-payload";

export type { PlatformDto };

/**
 * Fetches available social platforms for the authenticated workspace.
 * Returns an empty list when the API is unavailable or the request fails.
 */
export async function listPlatforms(
  token: string,
  workspaceUuid: string | null,
): Promise<PlatformDto[]> {
  const api = getPresenceHubApiWithBearer(token, {
    workspaceUuid: workspaceUuid ?? undefined,
  });

  if (!api) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[platforms]", API_URL_NOT_CONFIGURED_MESSAGE);
    }
    return [];
  }

  const { res, raw } = await apiGetJson(api, "api/v1/platforms");

  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[platforms] Request failed:",
        res.status,
        typeof raw === "object" && raw && "message" in raw
          ? (raw as { message: unknown }).message
          : raw,
      );
    }
    return [];
  }

  return parsePlatformsPayload(raw);
}
