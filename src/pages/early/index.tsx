import { useEffect } from "react";
import { useGlobalStore } from "stores/global";
import { useRouter } from "next/router";

export default function EarlyPayPage() {
  const router = useRouter();
  const isEarlyPayActive = useGlobalStore((state) => state.earlypay.isActive);

  useEffect(() => {
    if (isEarlyPayActive) {
      router.replace("/early/root");
    } else {
      router.replace("/early/onboarding");
    }
  }, [isEarlyPayActive, router]);

  return null;
}
