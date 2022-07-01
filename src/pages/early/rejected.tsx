import type { ReactElement } from "react";
import WithBackButton from "layouts/with-back-button";
import { DecorativeIconWrapper } from "components/decorative-icon-wrapper";
import { EarlyPayIcon } from "components/icons";
import { Heading, Paragraph } from "components/typography";
import { Button } from "components/button";
import { useRouter } from "next/router";
import { Criteria } from "components/criteria";

export default function EarlyPayRejectPage() {
  const router = useRouter();

  return (
    <div className="px-4 pt-4">
      <DecorativeIconWrapper>
        <EarlyPayIcon />
      </DecorativeIconWrapper>
      <Heading className="mb-3">Come back soon</Heading>
      <Paragraph>
        Unfortunately you do not meet one of the following criteria to be
        eligible for early pay:
      </Paragraph>
      <div className="mt-2 space-y-1">
        <Criteria />
      </div>
      <div className="mt-4 flex">
        <div className="flex">
          <Button onClick={() => router.back()}>Back</Button>
        </div>
      </div>
    </div>
  );
}

EarlyPayRejectPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBackButton>{page}</WithBackButton>;
};
