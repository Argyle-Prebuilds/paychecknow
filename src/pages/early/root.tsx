import { Title, Heading, Paragraph } from "components/typography";
import { InlineButton } from "components/button";
import { Table, transactionsToSections } from "components/table";
import { useGlobalStore } from "stores/global";
import { PauseIcon, PlayIcon, SettingsIcon } from "components/icons";
import { EarlyNextPayoutViewView } from "views/early-next-payout";
import Link from "next/link";
import { Avatar } from "components/avatar";
import { useProfile } from "hooks/useProfile";
import WithBottomNavigation from "layouts/with-bottom-navigation";
import { ReactElement } from "react";
import { useRouter } from "next/router";

type ToggleButtonProps = {
  label: string;
  checked: boolean;
  icon: React.ElementType;
  onClick: () => void;
};

const ToggleButton = ({ label, checked, icon, onClick }: ToggleButtonProps) => {
  const Icon = icon;

  return (
    <InlineButton onClick={onClick} className="mb-2 flex items-center">
      <div className="flex h-3 w-3 items-center justify-center">
        <Icon />
      </div>
      <Paragraph
        className={`ml-3 ${
          checked ? "!text-now-purple" : "!text-now-darkorange"
        }`}
      >
        {label}
      </Paragraph>
    </InlineButton>
  );
};

export default function EarlyPayRootPage() {
  const router = useRouter();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const isPaused = useGlobalStore((state) => state.earlypay.isPaused);
  const transactions = useGlobalStore((state) => state.earlypay.transactions);
  const setIsPaused = useGlobalStore((state) => state.setIsPaused);

  const sections = transactionsToSections(transactions);

  if (isProfileLoading) {
    return null;
  }

  return (
    <div className="px-4 pt-4 pb-12">
      <div className="mb-10 flex items-center justify-between">
        <Title>Early Pay</Title>
        <Link href="/settings">
          <a>
            <Avatar src={profile?.picture_url} />
          </a>
        </Link>
      </div>
      <EarlyNextPayoutViewView />
      <ToggleButton
        label={
          isPaused
            ? "Resume automatic early payments"
            : "Pause automatic early payments"
        }
        checked={isPaused}
        icon={isPaused ? PlayIcon : PauseIcon}
        onClick={() => setIsPaused(!isPaused)}
      />
      <ToggleButton
        label="Set up early pay for another employer"
        checked={false}
        icon={SettingsIcon}
        onClick={() => router.push("/early/onboarding")}
      />
      <Heading className="mt-8 mb-3">History</Heading>
      <Table sections={sections} />
    </div>
  );
}

EarlyPayRootPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBottomNavigation>{page}</WithBottomNavigation>;
};
