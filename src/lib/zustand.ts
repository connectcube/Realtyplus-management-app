import { create } from "zustand";

// Define the store state type
interface UserState {
  userName: string | null;
  role: string | null;
  email: string | null;
  uid: string | null;
  id: string | null;
  phone: string | null;
  updateProfile: (profile: Omit<UserState, "updateProfile">) => void;
}

// Create the store
export const useStore = create<UserState>((set) => ({
  userName: null,
  role: null,
  email: null,
  uid: null,
  id: null,
  phone: null,
  updateProfile: (profile) =>
    set(() => ({
      userName: profile.userName,
      role: profile.role,
      email: profile.email,
      uid: profile.uid,
      id: profile.id,
      phone: profile.phone,
    })),
}));
