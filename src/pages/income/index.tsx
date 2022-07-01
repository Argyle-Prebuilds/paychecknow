import type { ElementType, ReactElement } from "react";
import Link from "next/link";
import WithBottomNavigation from "layouts/with-bottom-navigation";
import { AddSmallIcon, LogotypeIcon, SendSmallIcon } from "components/icons";
import { useProfile } from "hooks/useProfile";
import { Avatar } from "components/avatar";
import {
  Heading,
  Paragraph,
  Subheading,
  Subparagraph,
} from "components/typography";
import { InlineButton } from "components/button";
import { useGlobalStore } from "stores/global";
import { Splitter } from "components/splitter";
import { EarlyNextPayoutViewView } from "views/early-next-payout";
import { useAccounts } from "hooks/useAccounts";
import { IncomeChart } from "views/income-chart";
import { useEmployments } from "hooks/useEmployments";
import { useIncome } from "hooks/useIncome";
import { formatSnakeCase } from "utils";
import { formatISO, parseISO } from "date-fns";
import { DataPoint } from "components/data-point";
import { usePayouts } from "hooks/usePayouts";
import currency from "currency.js";

type BlockProps = {
  header: string;
  text: string;
  button: string;
  icon: ElementType;
  link: string;
  topContent?: ReactElement;
  activeContent?: ReactElement;
  callback?: () => void;
  isActive: boolean;
};

const Block = ({
  header,
  text,
  button,
  icon,
  link,
  callback,
  topContent,
  activeContent,
  isActive,
}: BlockProps) => {
  const Icon = icon;

  if (isActive) {
    return (
      <div className="mb-[64px] last:mb-0">
        <div className="flex items-center justify-between">
          <Heading>{header}</Heading>
        </div>
        {activeContent}
      </div>
    );
  } else {
    return (
      <div className="mb-[64px] last:mb-0">
        <Heading className="mb-3">{header}</Heading>
        {topContent}
        <Paragraph className="mt-4 mb-5">{text}</Paragraph>
        <div className="flex items-center">
          <Icon />
          <Link href={link} passHref>
            <InlineButton onClick={callback}>
              <Subparagraph className="ml-1 !text-now-purple">
                {button}
              </Subparagraph>
            </InlineButton>
          </Link>
        </div>
      </div>
    );
  }
};

export default function Home() {
  const { income, isLoading: isIncomeLoading } = useIncome();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { employments, isLoading: isEmploymentsLoading } = useEmployments();
  const { payouts, isLoading: isPayoutsLoading } = usePayouts();

  const isEarlypayFeature = useGlobalStore((state) => state.earlypay.isActive);

  if (
    isIncomeLoading ||
    isProfileLoading ||
    isAccountsLoading ||
    isEmploymentsLoading ||
    isPayoutsLoading
  ) {
    return null;
  }

  return (
    <div className="px-4 pt-6 pb-12">
      <div className="mb-10 flex items-center justify-between">
        <div className="w-32">
          <LogotypeIcon />
        </div>
        <Link href="/settings">
          <a>
            <Avatar src={profile.picture_url} />
          </a>
        </Link>
      </div>
      <Block
        header="Income"
        text="Understand how much you make and how much you can make by adding multiple income sources to PaycheckNow."
        button="Add income"
        icon={AddSmallIcon}
        link="/"
        isActive={true}
        activeContent={
          <div className="my-4">
            <IncomeChart
              isMinimal
              income={income}
              accounts={accounts}
              selectedMode={0}
            />
            <div className="mt-4">
              <div className="w-2/3">
                <Subheading>Income sources</Subheading>
              </div>
              {employments.map((employment, i) => {
                const account = accounts[i];

                const employer = formatSnakeCase(employment.employer);

                let amount;
                let period;
                let startDate;

                if (employment.base_pay.amount) {
                  amount = employment.base_pay.amount;
                  period = employment.base_pay.period;
                  startDate = employment.hire_datetime;
                } else {
                  const amountFromPayouts = payouts
                    .filter((payout) => payout.account === account.id)
                    .reduce((acc: number, val: any) => {
                      return acc + Number(val.gross_pay);
                    }, 0);

                  amount = amountFromPayouts;
                  period = "monthly";
                  startDate = account.availability.activities.available_from;
                }

                const startDateFormatted = formatISO(parseISO(startDate), {
                  representation: "date",
                });

                const linkItem = account.link_item;

                return (
                  <div key={employment.id} className="mt-4">
                    <div className="flex items-center">
                      <img
                        className="mr-2 h-6 w-6 rounded-full"
                        src={`https://res.cloudinary.com/argyle-media/image/upload/v1600705681/partner-logos/${linkItem}.png`}
                        alt={linkItem}
                      />
                      <Subheading>{formatSnakeCase(employer)}</Subheading>
                    </div>
                    <div className="mt-4 flex gap-x-12">
                      <DataPoint
                        label="Start date"
                        value={startDateFormatted}
                      />
                      <DataPoint
                        label="Average pay"
                        value={`${currency(amount, {
                          precision: 0,
                        }).format()} ${period}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <pre></pre>
          </div>
        }
      />
      <Block
        header="Early pay"
        text="Get your money every day after work."
        button="Set up"
        icon={SendSmallIcon}
        link="/early"
        isActive={isEarlypayFeature}
        activeContent={
          <>
            <Splitter className="mt-4 mb-2" />
            <EarlyNextPayoutViewView />
            <Splitter className="mt-2" />
          </>
        }
      />
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <WithBottomNavigation>{page}</WithBottomNavigation>;
};
