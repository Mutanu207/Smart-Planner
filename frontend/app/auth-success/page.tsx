"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";
import { useNotification } from "../../context/NotificationProvider";

export default function AuthSuccessPage() {
  const { accessToken, authChecked } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (!authChecked || handled.current) return;

    handled.current = true;

    if (accessToken) {
      notify("Google sign-in successful.", "success");
      router.replace("/dashboard");
    } else {
      notify("Google sign-in failed. Please try again.", "error");
      router.replace("/login");
    }
  }, [authChecked, accessToken, notify, router]);

  return <p>Completing sign-in...</p>;
}