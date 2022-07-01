declare global {
  interface Window {
    Argyle: any;
  }
}

import { useEffect, useState } from "react";
import Script from "next/script";
import { useGlobalStore } from "stores/global";
import { useEphemeralStore } from "stores/ephemeral";
import { useUnitInit } from "hooks/useUnitInit";
import {
  CredentialsHints,
  SamplePasswordButton,
} from "views/credentials-hints";
import { useSWRConfig } from "swr";

type ArgyleLinkProps = {
  payDistributionUpdateFlow: boolean;
  onClose: () => void;
  onLinkInit: (link: any) => void;
  linkItemId?: string;
};

export function ArgyleLink({
  payDistributionUpdateFlow,
  onClose,
  onLinkInit,
  linkItemId,
}: ArgyleLinkProps) {
  const addAccountId = useGlobalStore((state) => state.addAccountId);
  const addLinkItemId = useGlobalStore((state) => state.addLinkItemId);
  const setUser = useGlobalStore((state) => state.setUser);
  const userToken = useGlobalStore((state) => state.userToken);
  const isLinkLoaded = useEphemeralStore((state) => state.isLinkScriptLoaded);
  const confirmLinkIsLoaded = useEphemeralStore(
    (state) => state.confirmLinkIsLoaded
  );

  const { mutate } = useSWRConfig();

  const [showHints, setShowHints] = useState(false);
  const [showHintsButton, setShowHintsButton] = useState(false);

  const { isLoading: isUnitLoading, unit } = useUnitInit();

  const handleUIEvent = (event: any) => {
    switch (event.name) {
      case "search - opened":
      case "success - opened":
      case "pd success - opened":
        setShowHintsButton(false);
        break;

      case "login - opened":
      case "mfa - opened":
        setShowHintsButton(true);
        break;

      case "link closed":
        setShowHintsButton(false);
        setShowHints(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (isLinkLoaded && !isUnitLoading) {
      const linkItems = payDistributionUpdateFlow ? [linkItemId] : [];

      const link = window.Argyle.create({
        customizationId: process.env.NEXT_PUBLIC_ARGYLE_CUSTOMIZATION_ID,
        pluginKey: process.env.NEXT_PUBLIC_ARGYLE_LINK_KEY,
        apiHost: process.env.NEXT_PUBLIC_ARGYLE_BASE_URL,
        userToken: userToken || "",
        payDistributionConfig: unit?.encryptedConfig,
        payDistributionUpdateFlow: payDistributionUpdateFlow,
        payDistributionAutoTrigger: true,
        linkItems: linkItems,
        onUserCreated: async ({
          userId,
          userToken,
        }: {
          userId: string;
          userToken: string;
        }) => {
          setUser(userId, userToken);
        },
        onAccountConnected: async ({
          userId,
          accountId,
          linkItemId,
        }: {
          userId: string;
          accountId: string;
          linkItemId: string;
        }) => {
          addAccountId(accountId);
          addLinkItemId(linkItemId);
          mutate(`/paychecknow/api/accounts/${userId}`);
        },
        onPayDistributionSuccess: ({ userId }) => {
          mutate(`/paychecknow/api/accounts/${userId}`);
        },
        onUIEvent: handleUIEvent,
        onClose,
      });

      onLinkInit(link);
    }
  }, [
    userToken,
    isLinkLoaded,
    isUnitLoading,
    payDistributionUpdateFlow,
    linkItemId,
  ]);

  return (
    <>
      <CredentialsHints isOpen={showHints} />
      <SamplePasswordButton
        showHintsButton={showHintsButton}
        showHints={showHints}
        onClick={() => setShowHints(!showHints)}
      />
      <Script
        src="https://plugin.argyle.com/argyle.web.v3.js"
        onLoad={() => confirmLinkIsLoaded()}
      />
    </>
  );
}
