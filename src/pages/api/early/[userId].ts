import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";
import { getAuthOpts } from "../utils";
import {
  parseISO,
  formatISO,
  subMonths,
  startOfMonth,
  endOfMonth,
  differenceInMonths,
  getDate,
  getDaysInMonth,
} from "date-fns";
import { BasePay } from "models/base-pay";
import { supabase } from "supabaseClient";
import qs from "qs";

type Data = any;

export function getEmployments(userId: string) {
  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/employments?user=${userId}`;

  return fetch(url, getAuthOpts())
    .then((response) => response.json())
    .then((data) => {
      return data?.results;
    });
}

export function getPayouts(userId: string) {
  const previousMonth = subMonths(new Date(), 1);
  const fromStartDate = formatISO(startOfMonth(previousMonth), {
    representation: "date",
  });
  const toStartDate = formatISO(endOfMonth(previousMonth), {
    representation: "date",
  });

  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/payouts?user=${userId}&from_start_date=${fromStartDate}&to_start_date=${toStartDate}`;

  return fetch(url, getAuthOpts())
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    });
}

export function getLinkItem(linkItemId: string) {
  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/link-items/${linkItemId}`;

  return fetch(url, getAuthOpts())
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getAccounts(userId: string) {
  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/accounts?user=${userId}`;

  return fetch(url, getAuthOpts())
    .then((response) => response.json())
    .then((data) => {
      const connected = data.results.filter(
        (account: any) => account.was_connected && account.status !== "error"
      );
      return connected;
    });
}

function getPayoutAmounts(monthly: number) {
  const today = new Date();
  const factorOfPayCycle = getDate(today) / getDaysInMonth(today);
  const initialPayout = factorOfPayCycle * monthly;
  const dailyPayout = monthly / getDaysInMonth(today);

  return {
    initial: initialPayout,
    daily: dailyPayout,
  };
}

export function toMonthlyPay(pay: BasePay) {
  const { period, amount } = pay;
  const decimal = Number(amount);

  if (period === "hourly") {
    return decimal * 20 * 8;
  }
  if (period === "weekly") {
    return decimal * 4;
  }
  if (period === "biweekly") {
    return decimal * 2;
  }
  if (period === "semimonthly") {
    return decimal * 2;
  }
  if (period === "monthly") {
    return decimal;
  }
  if (period === "annual") {
    return decimal / 12;
  }
}

function getNormalizedConfig(config) {
  const normalized = { ...config };

  if (config.pay_cycle === "week") {
    normalized.pay = config.pay * 4;
  }
  if (config.duration_cycle === "week") {
    normalized.duration = config.duration / 4;
  }

  return normalized;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cookie = getCookie("argyle-x-session", { req, res });
  const params = qs.parse(req.query);
  const userId = params.userId;
  const activeAccounts = params.a || [];

  const { data: rawConfig } = await supabase
    .from("config")
    .select()
    .eq("id", cookie)
    .single();

  const config = getNormalizedConfig(rawConfig);

  const accounts = await getAccounts(userId);
  const userEmployments = await getEmployments(userId);
  const userPayouts = await getPayouts(userId);

  const data = {
    monthly: 0,
    durations: [],
    combined: {
      initial: 0,
      daily: 0,
    },
    payouts: {},
    criteria: {
      duration: false,
      pay: false,
    },
  };

  const isActive = (account) => activeAccounts.includes(account.id);

  const linkItems = await Promise.all(
    accounts.map((account) => {
      return getLinkItem(account.link_item);
    })
  );

  accounts.forEach((account) => {
    const linkItem = linkItems.find((li) => li.id === account.link_item);
    const employment = userEmployments.find((ue) => ue.account === account.id);
    const payouts = userPayouts.filter((up) => up.account === account.id);

    if (linkItem.kind === "employer" || linkItem.kind === "platform") {
      const hireDate = parseISO(employment.hire_datetime);
      const duration = differenceInMonths(new Date(), hireDate);

      const pay = employment.base_pay;
      const monthly = toMonthlyPay(pay);
      const payoutAmounts = getPayoutAmounts(monthly);

      data.monthly += monthly;
      data.durations.push(duration);
      data.payouts[account.id] = payoutAmounts;

      if (!isActive(account)) {
        data.combined.initial += payoutAmounts.initial;
        data.combined.daily += payoutAmounts.daily;
      }
    } else {
      const startDate = parseISO(
        account.availability.activities.available_from
      );
      const duration = differenceInMonths(new Date(), startDate);

      const amountFromPayouts = payouts.reduce((acc: number, val: any) => {
        return acc + Number(val.gross_pay);
      }, 0);

      const pay = {
        amount: amountFromPayouts,
        period: "monthly",
        currency: "USD",
      };

      const monthly = toMonthlyPay(pay);
      const payoutAmounts = getPayoutAmounts(monthly);

      data.monthly += monthly;
      data.durations.push(duration);
      data.payouts[account.id] = payoutAmounts;
      if (!isActive(account)) {
        data.combined.initial += payoutAmounts.initial;
        data.combined.daily += payoutAmounts.daily;
      }
    }
  });

  const isLongEnough = (duration) => duration > config.duration;
  if (data.durations.some(isLongEnough)) {
    data.criteria.duration = true;
  }

  if (data.monthly > config.pay) {
    data.criteria.pay = true;
  }

  if (data.criteria.duration && data.criteria.pay) {
    res.json({
      approved: true,
      ...data,
    });
  } else {
    res.json({
      approved: false,
      ...data,
    });
  }
}
