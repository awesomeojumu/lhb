import { SnackbarProvider, useSnackbar } from "notistack";
import { createContext, useContext } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <ToastWrapper>{children}</ToastWrapper>
    </SnackbarProvider>
  );
}

function ToastWrapper({ children }) {
  const { enqueueSnackbar } = useSnackbar();
  const showToast = (msg, variant = "default") => enqueueSnackbar(msg, { variant });

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}
