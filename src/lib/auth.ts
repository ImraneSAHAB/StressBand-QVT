export type UserRole = "patient" | "pro";

export type User = {
  email: string;
  password: string;
  role: UserRole;
};

const USERS_KEY = "sbqvt_users";
const CURRENT_USER_KEY = "sbqvt_current_user";

const DEFAULT_USERS: User[] = [
  {
    email: "patient@example.com",
    password: "patient123",
    role: "patient",
  },
  {
    email: "pro@example.com",
    password: "pro123",
    role: "pro",
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function loadUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return DEFAULT_USERS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as User[];
  } catch {
    return DEFAULT_USERS;
  }
}

function saveUsers(users: User[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  try {
    const rawEmail = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!rawEmail) return null;
    const users = loadUsers();
    return users.find((u) => u.email === rawEmail) ?? null;
  } catch {
    return null;
  }
}

export function signOut(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    // ignore
  }
}

export type AuthResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function signUp(
  email: string,
  password: string,
  role: UserRole,
): AuthResult<User> {
  if (!email || !password) {
    return { ok: false, error: "Merci de renseigner un email et un mot de passe." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = loadUsers();
  const exists = users.some((u) => u.email === normalizedEmail);

  if (exists) {
    return { ok: false, error: "Un compte existe déjà avec cet email." };
  }

  const newUser: User = {
    email: normalizedEmail,
    password,
    role,
  };

  const updated = [...users, newUser];
  saveUsers(updated);

  if (isBrowser()) {
    try {
      window.localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);
    } catch {
      // ignore
    }
  }

  return { ok: true, data: newUser };
}

export function signIn(email: string, password: string): AuthResult<User> {
  if (!email || !password) {
    return { ok: false, error: "Merci de renseigner un email et un mot de passe." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = loadUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user || user.password !== password) {
    return { ok: false, error: "Identifiants incorrects." };
  }

  if (isBrowser()) {
    try {
      window.localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);
    } catch {
      // ignore
    }
  }

  return { ok: true, data: user };
}
