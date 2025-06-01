import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

let deferredPrompt: any = null;

const InstallAppButton: React.FC = () => {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();

  const installMutation = useMutation({
    mutationFn: async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      deferredPrompt = null;
      return choiceResult.outcome;
    },
    onSuccess: (outcome) => {
      console.log(
        `User ${outcome === "accepted" ? "accepted" : "dismissed"} the install prompt.`,
      );
    },
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => {
        setShow(false);
        installMutation.mutate();
      }}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 20px",
        zIndex: 9999,
        background: "#317EFB",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Install App
    </button>
  );
};

export default InstallAppButton;
