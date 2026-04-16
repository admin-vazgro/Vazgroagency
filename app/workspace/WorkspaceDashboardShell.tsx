"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingWizard from "@/components/OnboardingWizard";

interface Props {
  showWizard: boolean;
  profileName: string;
  children: React.ReactNode;
}

export default function WorkspaceDashboardShell({ showWizard, profileName, children }: Props) {
  const router = useRouter();
  const [wizardOpen, setWizardOpen] = useState(showWizard);

  // Keep in sync if prop changes (e.g. fast navigation)
  useEffect(() => {
    setWizardOpen(showWizard);
  }, [showWizard]);

  function handleDismiss() {
    setWizardOpen(false);
    // Remove ?welcome=1 from the URL without a full navigation
    router.replace("/workspace");
  }

  return (
    <>
      {children}
      {wizardOpen && (
        <OnboardingWizard profileName={profileName} onDismiss={handleDismiss} />
      )}
    </>
  );
}
