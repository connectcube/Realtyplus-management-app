import { create } from "zustand";

// Define the user type
interface User {
  userName: string | null;
  role: string | null;
  email: string | null;
  uid: string | null;
  id: string | null;
  phone: string | null;
  properties?: any | null;
  tenants?: any | null;
  messages?: any | null;
  requests?: any | null;
  notifications?: notifications;
  maintenance?: any | null;
}
type notifications = {
  messages: [];
  requests: [];
};

// Define the store state type
interface UserState {
  user: User | null;
  setUser: (userData: Partial<User>) => void;
}

// Create the store
export const useStore = create<UserState>((set) => ({
  user: {
    userName: null,
    role: null,
    email: null,
    uid: null,
    id: null,
    phone: null,
    properties: [],
    tenants: [],
    messages: [],
    maintenance: [],
    notifications: {
      messages: [],
      requests: [],
    },
    requests: null,
  },
  setUser: (userData) =>
    set((state) => ({
      user: {
        ...state.user,
        ...userData,
      },
    })),
}));
