import create, { SetState, GetState } from "zustand";
import { StoreSlice } from "stores/utils";
import { persist, devtools } from "zustand/middleware";
import { EarlyPayStore, createEarlyPaySlice } from "stores/early-pay";

type Feature = keyof EarlyPayStore;

type GeneralVals = {
  userId: string;
  userToken: string;
  accountIds: string[];
  linkItemIds: string[];
};

type GeneralActions = {
  getAccountId: () => string;
  getLinkItemId: () => string;
  addAccountId: (id: string) => void;
  addLinkItemId: (id: string) => void;
  setUser: (id: string, token: string) => void;
  setFeatureState: (feature: Feature, isActive: boolean) => void;
  reset: () => void;
};

type GeneralStore = GeneralActions & GeneralVals;

type GlobalStore = GeneralStore & EarlyPayStore;

const initialState: GeneralVals = {
  userId: "",
  userToken: "",
  accountIds: [] as string[],
  linkItemIds: [] as string[],
};

const createGeneralStoreSlice: StoreSlice<GeneralStore> = (
  set: SetState<any>,
  get: GetState<any>
) => ({
  ...initialState,
  getAccountId: () => get().accountIds[0] ?? "",
  getLinkItemId: () => get().linkItemIds ?? "",
  addAccountId: (id) =>
    set((state: GeneralStore) => ({ accountIds: [...state.accountIds, id] })),
  addLinkItemId: (id) =>
    set((state: GeneralStore) => ({ linkItemIds: [...state.linkItemIds, id] })),
  setUser: (id, token) => set({ userId: id, userToken: token }),
  setIsOnboarded: (yesNo) => set({ isOnboarded: yesNo }),
  setFeatureState: (feature, isActive) =>
    set((state: GlobalStore) => ({
      [feature]: { ...state[feature], isActive },
    })),
  reset: () => set(store(set, get), true),
});

const store = (set: SetState<any>, get: GetState<any>) => ({
  ...createGeneralStoreSlice(set, get),
  ...createEarlyPaySlice(set, get),
});

export const useGlobalStore = create<GlobalStore>(
  devtools(
    persist(store, {
      name: "global",
    })
  )
);
