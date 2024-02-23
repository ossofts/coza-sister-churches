import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./types";
import { removeToken } from "@/services/authToken";

type UserStore = {
  user: User | null;
  setUser: (newUser: User) => void;
  removeUser: () => void;
};

const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      setUser: (newUser) =>
        set(() => ({
          user: {
            ...newUser
          }
        })),
      removeUser: () =>
        set(() => ({
          user: null
        }))
    }),
    {
      name: "user-store"
    }
  )
);

export default useUserStore;

export const useLogout = () => {
  const removeUser = useUserStore((state) => state.removeUser);

  const logout = () => {
    removeUser();
    removeToken();
  };
  return logout;
};
