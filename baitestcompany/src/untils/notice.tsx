import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert, Snackbar } from "@mui/material"; 

type AlertType = "success" | "error" | "warning" | "info";

interface AlertContextProps {
  showAlert: (msg: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextProps>({
  showAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState<AlertType>("success");
  const [visible, setVisible] = useState(false);

  const showAlert = (msg: string, type: AlertType = "success") => {
    setAlertMsg(msg);
    setAlertType(type);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={visible}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={alertType} sx={{ width: "100%" }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
