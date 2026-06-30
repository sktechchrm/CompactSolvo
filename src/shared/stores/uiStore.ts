import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  activeDrawer: string | null;
  activeModal: string | null;
  setTheme: (t: Theme) => void;
  toggleSidebar: () => void;
  setSidebar: (v: boolean) => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        theme: 'system',
        sidebarOpen: true,
        activeDrawer: null,
        activeModal: null,
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        setSidebar: (v) => set({ sidebarOpen: v }),
        openDrawer: (id) => set({ activeDrawer: id }),
        closeDrawer: () => set({ activeDrawer: null }),
        openModal: (id) => set({ activeModal: id }),
        closeModal: () => set({ activeModal: null }),
      }),
      {
        name: 'chrm_ui_v1',
        partialize: (s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen }),
      }
    )
  )
);
