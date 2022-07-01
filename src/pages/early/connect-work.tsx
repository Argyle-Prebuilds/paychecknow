import { ReactElement, useState } from "react";
import { DecorativeIconWrapper } from "components/decorative-icon-wrapper";
import { PlusIcon } from "components/icons";
import { Heading, Paragraph, Footnote } from "components/typography";
import { Button } from "components/button";
import { ArgyleLink } from "components/argyle-link";
import { useRouter } from "next/router";
import WithBackButton from "layouts/with-back-button";
import { useAccounts } from "hooks/useAccounts";

export default function EarlyPayConnectPage() {
  const router = useRouter();
  const [linkInstance, setLinkInstance] = useState<any>();
  const applyRoute = "early/confirm";

  const { isPdConfigured, mutate: mutateAccounts } = useAccounts();

  const handleSetup = () => {
    if (!isPdConfigured) {
      linkInstance.open();
    } else {
      router.push(applyRoute);
    }
  };

  return (
    <>
      <ArgyleLink
        payDistributionUpdateFlow={true}
        onClose={async () => {
          const { isPdConfigured } = await mutateAccounts();

          if (isPdConfigured) {
            router.push(applyRoute);
          }
        }}
        onLinkInit={(link) => setLinkInstance(link)}
      />
      <div className="px-4 pt-4">
        <DecorativeIconWrapper>
          <PlusIcon />
        </DecorativeIconWrapper>
        <Heading className="mb-3">Start by connecting your work</Heading>
        <Paragraph className="mb-3">
          Make your employment history and experience work for you. When
          PaycheckNow sees what you earned before, it’s easy for us to pay you
          early.
        </Paragraph>
        <div className="mt-4 mb-6 flex">
          <Button as="button" onClick={handleSetup} disabled={!linkInstance}>
            Connect your work
          </Button>
        </div>
        <Footnote>
          On the next screen, you will be able to search for your employer, work
          platform or, if you know it, the payroll company that your employer
          uses to pay you.
        </Footnote>
      </div>
    </>
  );
}

EarlyPayConnectPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBackButton>{page}</WithBackButton>;
};
