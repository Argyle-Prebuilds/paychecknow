import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthOpts } from "../utils";

type Data = any;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // for simplicity, get only the first profile
  const userId = req.query.userId as string;
  const url = `${process.env.NEXT_PUBLIC_ARGYLE_BASE_URL}/profiles?user=${userId}&limit=1`;

  return fetch(url, getAuthOpts())
    .then((response) => response.json())
    .then((data) => {
      res.json(data.results[0]);
    });
}
