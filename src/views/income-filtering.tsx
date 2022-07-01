import { Tab } from "@headlessui/react";
import { BottomSheet } from "components/bottom-sheet";
import { InlineButton } from "components/button";
import { Paragraph } from "components/typography";
import { Splitter } from "components/splitter";
import clsx from "clsx";
import moment from "moment";

type IncomeFilteringProps = {
  isOpen: boolean;
  onClose: () => void;
};

type YearsProps = {
  orientation: "horizontal" | "vertical";
};

function Years({ orientation }: YearsProps) {
  // get n last years
  const years = Array.from({ length: 4 }).map((_, i) =>
    moment().subtract(i, "year").year()
  );

  return (
    <div
      className={clsx(
        "flex items-start",
        orientation === "vertical" ? "flex-col space-y-3" : "flex-row space-x-3"
      )}
    >
      {years.map((year) => (
        <InlineButton
          key={year}
          className={clsx(orientation === "vertical" && "!text-heading")}
        >
          {year}
        </InlineButton>
      ))}
    </div>
  );
}

function Months() {
  const months = [
    { id: 1, label: "January" },
    { id: 2, label: "February" },
    { id: 3, label: "March" },
    { id: 4, label: "April" },
    { id: 5, label: "May" },
    { id: 6, label: "June" },
    { id: 7, label: "July" },
    { id: 8, label: "August" },
    { id: 9, label: "September" },
    { id: 10, label: "October" },
    { id: 11, label: "November" },
    { id: 12, label: "December" },
  ];

  return (
    <div className="my-4 space-y-4">
      {months.map((month) => (
        <InlineButton
          key={month.id}
          className={clsx("text-paragraph text-now-grey")}
        >
          {month.label}
        </InlineButton>
      ))}
    </div>
  );
}
export function IncomeFiltering({ isOpen, onClose }: IncomeFilteringProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <Tab.Group>
        <Tab.List className="space-x-2">
          <Tab>
            {({ selected }) => (
              <Paragraph
                className={clsx(
                  "px-3",
                  selected && "rounded-full bg-gray-100 !text-now-darkest"
                )}
              >
                Year
              </Paragraph>
            )}
          </Tab>
          <Tab>
            {({ selected }) => (
              <Paragraph
                className={clsx(
                  "px-3",
                  selected && "rounded-full bg-gray-100 !text-now-darkest"
                )}
              >
                Month
              </Paragraph>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="py-6">
            <Years orientation="vertical" />
          </Tab.Panel>
          <Tab.Panel className="py-6">
            <Years orientation="horizontal" />
            <Splitter className="mt-4" />
            <Months />
            <Splitter />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <InlineButton onClick={onClose} className="!text-now-purple">
        Done
      </InlineButton>
    </BottomSheet>
  );
}
