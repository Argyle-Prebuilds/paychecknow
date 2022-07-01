import { Heading, Paragraph, Strong, Subheading } from "components/typography";
import { useGlobalStore } from "stores/global";
import { Splitter } from "components/splitter";
import currency from "currency.js";
import clsx from "clsx";

export function EarlyNextPayoutViewView() {
  const upcoming = useGlobalStore((state) => state.earlypay.upcoming);
  const isPaused = useGlobalStore((state) => state.earlypay.isPaused);

  return (
    <>
      <Subheading>Upcoming payouts</Subheading>
      <div className="my-4 space-y-2">
        {upcoming.map((up) => {
          return (
            <div
              key={up.employer}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  className="mr-4 h-10 w-10 rounded-full"
                  src={up.logo}
                  alt={up.employer}
                />
                <div>
                  <Strong>{up.employer}</Strong>
                  <Paragraph>{isPaused ? "Paused" : "Tomorrow"}</Paragraph>
                </div>
              </div>
              <Splitter className="my-2" />
              <Heading
                className={clsx(
                  isPaused ? "!text-now-grey40" : "!text-now-green"
                )}
              >
                {currency(up.amount, { precision: 0 }).format()}
              </Heading>
            </div>
          );
        })}
      </div>
    </>
  );
}
