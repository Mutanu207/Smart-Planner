"use client";
//we use "use clinet" to be able to use react state and the rest
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function ProtectedRoute({
  children, //children are the actual pages
}: {
  children: ReactNode; // any value that react is capable of rensering on the screen
}) {
  const { accessToken, authChecked } = useAuth();
  const router = useRouter(); // to be able to navigate between pages

  useEffect(() => {
    if (authChecked && !accessToken) { //auth is checked but no access token back to login, if acess is there we render the page 
      router.replace("/login");
    }
  }, [authChecked, accessToken, router]);

  if (!authChecked) {
    return <p>Checking your session...</p>;
  }

  if (!accessToken) {
    return <p>Redirecting to login...</p>;
  }

  return children;
}
