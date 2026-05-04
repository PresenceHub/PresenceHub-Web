/** Session token (e.g. Bearer / Sanctum personal access token). */
export const AUTH_SESSION_COOKIE = "ph_session";

/** JSON-encoded user snapshot from last login/register (`AuthUser` shape). */
export const AUTH_USER_COOKIE = "ph_user";

/** Current workspace UUID for `X-Workspace-Uuid` on authenticated API calls. */
export const AUTH_WORKSPACE_COOKIE = "ph_workspace";

/** Session snapshot when user uuid is unknown (token-only stub path). */
export const AUTH_USER_UUID_STUB = "";
