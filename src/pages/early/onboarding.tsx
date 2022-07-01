import { AddBigIcon, LeftArrowIcon, LogotypeIcon } from "components/icons";
import {
  Heading,
  Paragraph,
  Subheading,
  Subparagraph,
} from "components/typography";
import { Button, InlineButton } from "components/button";
import { useGlobalStore } from "stores/global";
import { useRouter } from "next/router";
import Link from "next/link";
import { Avatar } from "components/avatar";
import { Loader } from "components/loader";
import { useProfile } from "hooks/useProfile";
import { formatCurrency, formatSnakeCase } from "utils";
import { useAccounts } from "hooks/useAccounts";
import { useState, useEffect, ReactElement } from "react";
import clsx from "clsx";
import { ArgyleLink } from "components/argyle-link";
import WithBottomNavigation from "layouts/with-bottom-navigation";
import { useEarlyPay } from "hooks/useEarlyPay";
import { useConfig } from "hooks/useConfig";
import { Criteria } from "components/criteria";

export default function EarlyPayOnboardingPage() {
  const router = useRouter();

  const activeAccounts = useGlobalStore(
    (state) => state.earlypay.activeAccounts
  );

  const { profile, isLoading: isProfileLoading } = useProfile();
  const {
    accounts,
    isLoading: isAccountsLoading,
    mutate: mutateAccounts,
  } = useAccounts();
  const {
    data: decision,
    isLoading: isEarlyPayLoading,
    mutate: mutateEarlyPay,
  } = useEarlyPay({
    activeAccounts,
  });
  const { config, isConfigLoading } = useConfig();

  const [linkLoading, setLinkLoading] = useState(false);
  const [linkInstance, setLinkInstance] = useState<any>();

  const handleLinkOpen = () => {
    if (!linkInstance) {
      return setLinkLoading(true);
    }

    linkInstance.open();
  };

  useEffect(() => {
    if (linkInstance && linkLoading === true) {
      setLinkLoading(false);
      linkInstance.open();
    }
  }, [linkLoading, linkInstance]);

  const handleLinkClose = () => {
    mutateAccounts();
    mutateEarlyPay();
  };

  function getSortedAccounts(): any[] {
    // display connected accounts first
    const isActive = (account) => Number(activeAccounts.includes(account.id));
    const sorted = [...(accounts ? accounts : [])].sort(
      (a, b) => isActive(b) - isActive(a)
    );

    return sorted;
  }

  if (
    isProfileLoading ||
    isAccountsLoading ||
    isEarlyPayLoading ||
    isConfigLoading
  ) {
    return <Loader />;
  }

  const sortedAccounts = getSortedAccounts();

  const initial = formatCurrency(decision.combined.initial);
  const daily = formatCurrency(decision.combined.daily);
  const allActive = activeAccounts.length === accounts.length;

  return (
    <>
      <ArgyleLink
        payDistributionUpdateFlow={false}
        onClose={() => handleLinkClose()}
        onLinkInit={(link) => {
          setLinkInstance(link);
        }}
      />
      <div className="px-4 pt-6 pb-12">
        <div className="mb-10 flex items-center justify-between">
          {activeAccounts.length > 0 ? (
            <Link href="root">
              <a>
                <button
                  className="block h-8 w-8 p-1 text-now-grey"
                  onClick={() => router.back()}
                >
                  <LeftArrowIcon />
                </button>
              </a>
            </Link>
          ) : (
            <div className="w-32">
              <LogotypeIcon />
            </div>
          )}
          <Link href="/settings">
            <a>
              <Avatar src={profile?.picture_url} />
            </a>
          </Link>
        </div>
        <Heading className="mb-3 w-3/4">
          {allActive && initial && daily
            ? `Add more employers to increase early pay`
            : decision.approved
            ? `Get up to ${initial} now and up to ${daily} every day`
            : `Get up to 70% of your income as soon as you earn it`}
        </Heading>
        <Paragraph className="mb-6">
          Don’t wait weeks or months for your paycheck. Direct your income to
          PaycheckNow and use your hard-earned cash right away.
        </Paragraph>
        <Criteria view="compact" />
        <Subheading className="mt-6 mb-4 w-3/4">
          <span>Connected employers:</span>
        </Subheading>
        {sortedAccounts.map((account) => {
          const linkItem = account.link_item;
          const isActive = activeAccounts.includes(account.id);

          return (
            <button
              disabled={isActive}
              key={account.id}
              className={clsx(
                "mt-1 flex w-full items-center p-1",
                isActive && "cursor-not-allowed"
              )}
            >
              <img
                className={clsx("mr-4 h-8 w-8 rounded-full")}
                src={`https://res.cloudinary.com/argyle-media/image/upload/v1600705681/partner-logos/${linkItem}.png`}
                alt={linkItem}
              />
              <div className={clsx("text-left", !isActive && "py-2.5")}>
                <Subheading>{formatSnakeCase(account.link_item)}</Subheading>
                {isActive && (
                  <Subparagraph className="!text-now-green">
                    Connected
                  </Subparagraph>
                )}
              </div>
            </button>
          );
        })}
        <div className={clsx("mt-3", linkLoading && "animate-pulse")}>
          <InlineButton
            onClick={handleLinkOpen}
            className="flex items-center !text-now-purple"
          >
            <span className="mr-3 p-1">
              <AddBigIcon />
            </span>
            Add another employer
          </InlineButton>
        </div>
        <div className={clsx("mt-12 flex")}>
          <Button
            as="button"
            onClick={() => {
              if (!decision.approved) {
                router.push("/early/rejected");
              } else {
                router.push("/early/confirm");
              }
            }}
            disabled={allActive}
          >
            Set up early pay
          </Button>
        </div>
      </div>
    </>
  );
}

EarlyPayOnboardingPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBottomNavigation>{page}</WithBottomNavigation>;
};
