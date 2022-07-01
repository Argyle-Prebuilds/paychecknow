import { getUnitHeaders } from "../utils";

type DepositAccount = any;
export async function createDepositAccount(
  customerId: string,
  purpose: string
) {
  const url = `${process.env.UNIT_API_URL}/accounts`;

  const request = {
    method: "POST",
    headers: getUnitHeaders(),
    body: JSON.stringify({
      data: {
        type: "depositAccount",
        attributes: {
          depositProduct: "checking",
          tags: {
            purpose: purpose,
          },
        },
        relationships: {
          customer: {
            data: {
              type: "customer",
              id: customerId,
            },
          },
        },
      },
    }),
  };

  const response = await fetch(url, request);
  const json = await response.json();
  const result = json.data as DepositAccount;

  return result;
}

export async function getDepositAccounts(customerId: string) {
  const url = `${process.env.UNIT_API_URL}/accounts?filter[customerId]=${customerId}`;

  const request = {
    method: "GET",
    headers: getUnitHeaders(),
  };
  const response = await fetch(url, request);
  const json = await response.json();

  const result = json.data as DepositAccount[];

  return result;
}
