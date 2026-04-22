import { create } from 'zustand';
import { UserProfile, User } from '@/types';

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  isOnboarded: boolean;
  setUser: (user: User) => void;
  setProfile: (profile: UserProfile) => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
  updateProfileField: (field: keyof UserProfile, value: unknown) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  profile: null,
  isOnboarded: false,
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  setProfile: (profile) => set({ profile, isOnboarded: profile.isCompleted }),

  setIsOnboarded: (isOnboarded) => set({ isOnboarded }),

  updateProfileField: (field, value) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, [field]: value } : null,
    })),

  reset: () => set(initialState),
}));
