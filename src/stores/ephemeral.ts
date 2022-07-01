import create, { SetState } from "zustand";
import { devtools } from "zustand/middleware";

type EphemeralStoreVals = {
  isLinkScriptLoaded: boolean;
};

type EphemeralActions = {
  confirmLinkIsLoaded: () => void;
};

type EphemeralStore = EphemeralStoreVals & EphemeralActions;

const initialState: EphemeralStoreVals = {
  isLinkScriptLoaded: false,
};

const store = (set: SetState<EphemeralStore>) => ({
  ...initialState,
  confirmLinkIsLoaded: () => set({ isLinkScriptLoaded: true }),
});

export const useEphemeralStore = create<EphemeralStore>(devtools(store));
