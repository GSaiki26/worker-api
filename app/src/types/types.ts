// Interfaces
export interface GetCredsBody {
  type: "bearer";
  level: "admin" | "user";
  credential?: string;
}
