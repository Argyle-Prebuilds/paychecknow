import { endOfMonth, formatISO, startOfMonth, subMonths } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthOpts } from "../utils";

type Data = any;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = req.query.userId;
  const today = new Date();
  const startMonth = subMonths(today, 7);
  const endMonth = subMonths(today, 1);
  const fromStartDate = formatISO(startOfMonth(startMonth), {
    representation: "date",
  });
  const toStartDate = formatISO(endOfMonth(endMonth), {
    representation: "date",
  });

  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/payouts?user=${userId}&from_start_date=${fromStartDate}&to_start_date=${toStartDate}`;

  fetch(url, getAuthOpts())
    .then((response) => response.json())
    .then((data) => {
      res.json(data.results);
    });
}
