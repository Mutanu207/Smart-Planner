"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Alert, Snackbar } from "@mui/material";

type NotificationSeverity = "success" | "error" | "info" | "warning";

type NotificationContextType = {
  notify: (message: string, severity?: NotificationSeverity) => void;
};

const NotificationContext =
  createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
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
