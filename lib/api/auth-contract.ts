/**
 * Successful JSON bodies from PresenceHub API auth endpoints (`POST .../login`, `POST .../register`).
 * Resources use `uuid`, not `id`.
 */

export type AuthApiRoleDto = {
  uuid: string;
  slug: string;
  name: string;
  description?: string;
};

export type AuthApiWorkspaceDto = {
  uuid: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthApiUserDto = {
  uuid: string;
  name: string;
  email: string;
  role?: AuthApiRoleDto;
  currentWorkspace?: AuthApiWorkspaceDto;
  workspaces?: AuthApiWorkspaceDto[];
  createdAt?: string;
  updatedAt?: string;
};

/** Root shape for a successful login or registration response. */
export type AuthSuccessResponseBody = {
  token: string;
  user: AuthApiUserDto;
};
