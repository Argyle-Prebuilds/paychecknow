import type { ReactElement } from "react";
import WithBackButton from "layouts/with-back-button";
import { DecorativeIconWrapper } from "components/decorative-icon-wrapper";
import { CheckIcon } from "components/icons";
import { Heading, Paragraph, Strong } from "components/typography";
import { Button } from "components/button";
import Link from "next/link";
import { formatCurrency } from "utils";
import { useRouter } from "next/router";

export default function EarlyPaySuccessPage() {
  const router = useRouter();
  const { amount } = router.query;

  return (
    <div className="px-4 pt-4">
      <DecorativeIconWrapper>
        <CheckIcon />
      </DecorativeIconWrapper>
      <Heading className="mb-3">Success</Heading>
      <Paragraph>
        PaycheckNow will deposit <Strong>{formatCurrency(amount)}</Strong> to
        your account.
      </Paragraph>
      <div className="mt-4 flex">
        <Link href="/early" passHref>
          <Button as="a">Done</Button>
        </Link>
      </div>
    </div>
  );
}

EarlyPaySuccessPage.getLayout = function getLayout(page: ReactElement) {
  return <WithBackButton>{page}</WithBackButton>;
};
