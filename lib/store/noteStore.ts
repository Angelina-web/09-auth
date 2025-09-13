import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateNotePayload } from "../api/clientApi";

type NoteDraftStore = {
  draft: CreateNotePayload;
  setDraft: (draft: CreateNotePayload) => void;
  clearDraft: () => void;
};

const initialDraft: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
