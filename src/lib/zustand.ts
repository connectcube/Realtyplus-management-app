import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";

// Define the notifications type correctly
type Notifications = {
   messages: any[];
   requests: any[];
};

// Define the user type
interface User {
   userName: string | null;
   firstName: string | null;
   lastName: string | null;
   role: string | null;
   email: string | null;
   uid: string | null;
   id: string | null;
   phone: string | null;
   properties: any[];
   tenants: any[];
   messages: any[];
   requests: any;
   notifications: Notifications;
   maintenance: any[];
}

// Define the store state type
interface UserState {
   user: User;
   setUser: (userData: Partial<User>) => void;
   clearUser: () => void;
}

// Initial state
const initialState: User = {
   userName: null,
   firstName: null,
   lastName: null,
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
      requests: []
   },
   requests: null
};

// Create the store with persistence
export const useStore = create<UserState>()(
   persist(
      set => ({
         user: initialState,
         setUser: userData =>
            set(state => ({
               user: {
                  ...state.user,
                  ...userData
               }
            })),
         clearUser: () => set({user: initialState})
      }),
      {
         name: "realtyplus-user-storage",
         storage: createJSONStorage(() => localStorage)
      }
   )
);
