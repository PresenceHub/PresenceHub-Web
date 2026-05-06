export type AuthUser = {
    uuid: string;
    email: string | null;
    name?: string | null;
  };
  
  export type AuthSession = {
    user: AuthUser;
  };
  