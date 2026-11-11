"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Alert, Snackbar } from "@mui/material";

type NotificationSeverity = "success" | "error" | "info" | "warning"; //  the severity levels for the notification

type NotificationContextType = {
  notify: (message: string, severity?: NotificationSeverity) => void; // the function to trigger a notification, this is its type definition  
};

const NotificationContext =
  createContext<NotificationContextType | undefined>(undefined);// creating a context for notifications, initially undefined

export function NotificationProvider({
  children,
}: {
  children: ReactNode; // the children components that will have access to the notification context, the children prop is of type ReactNode, which can be any valid React child (elements, strings, numbers, etc.)
}) {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<NotificationSeverity>("info");
  const [open, setOpen] = useState(false);

  const notify = (
    newMessage: string,
    newSeverity: NotificationSeverity = "info",
  ) => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={severity}
          onClose={() => setOpen(false)}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationProvider",
    );
  }

  return context;
}
