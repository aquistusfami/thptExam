declare module "next-auth" {
  interface User {
    id: string;
    role: "STUDENT" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "STUDENT" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STUDENT" | "ADMIN";
  }
}
