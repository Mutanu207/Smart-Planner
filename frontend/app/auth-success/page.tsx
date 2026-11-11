"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";
import { useNotification } from "../../context/NotificationProvider";

export default function AuthSuccessPage() {
  const { accessToken, authChecked } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();
  const handled = useRef(false); // Ref to ensure the effect runs only once

  useEffect(() => {
    if (!authChecked || handled.current) return; // Ensure the effect runs only once after authChecked is true
    // if auth is not checked and  handled current is still a false then return and do nothing
    handled.current = true;
    //if auth checked is true set handled current to true
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