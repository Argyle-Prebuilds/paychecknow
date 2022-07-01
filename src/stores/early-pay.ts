import { SetState, GetState } from "zustand";
import { StoreSlice } from "stores/utils";
import { formatSnakeCase, getDate } from "utils";

export const featureName = "earlypay";

type EarlyPay = {
  [featureName]: {
    isActive: boolean;
    isPaused: boolean;
    transactions: any[];
    upcoming: any[];
    activeAccounts: string[];
  };
};

type EarlyPayActions = {
  setIsPaused: (isPaused: boolean) => void;
  setTransactions: (accounts: any[], decision: any) => void;
  setActiveAccounts: (accounts: string[]) => void;
};

export type EarlyPayStore = EarlyPay & EarlyPayActions;

function createTransaction(linkItem: string, amountDue: number) {
  const employer = formatSnakeCase(linkItem);
  const logo = `https://res.cloudinary.com/argyle-media/image/upload/v1600705681/partner-logos/${linkItem}.png`;

  return {
    employer,
    logo,
    datetime: getDate(0),
    amount: amountDue,
  };
}

const initialEarlyPayState: EarlyPay = {
  [featureName]: {
    isActive: false,
    isPaused: false,
    transactions: [],
    upcoming: [],
    activeAccounts: [],
  },
};

export const createEarlyPaySlice: StoreSlice<EarlyPayStore> = (
  set: SetState<EarlyPayStore>,
  get: GetState<EarlyPayStore>
) => ({
  ...initialEarlyPayState,
  setIsPaused: (isPaused) =>
    set((state) => ({
      [featureName]: {
        ...state[featureName],
        isPaused,
      },
    })),
  setTransactions: (accounts, decision) =>
    set((state) => {
      const transactions = accounts.map((account) => {
        const initialAmount = decision.payouts[account.id].initial;
        const dailyAmount = decision.payouts[account.id].daily;

        return {
          initial: createTransaction(account.link_item, initialAmount),
          daily: createTransaction(account.link_item, dailyAmount),
        };
      });

      // TODO: use better names here
      return {
        [featureName]: {
          ...state[featureName],
          transactions: transactions.map((transaction) => transaction.initial),
          upcoming: transactions.map((transaction) => transaction.daily),
        },
      };
    }),
  setActiveAccounts: (accounts) =>
    set((state) => {
      return {
        [featureName]: {
          ...state[featureName],
          activeAccounts: accounts,
        },
      };
    }),
});
