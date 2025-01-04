import { createContext, useContext, useState, useMemo, useEffect } from "react";
// import App from "./App";
import AppRouter from "./AppRouter";
import { QueryClientProvider, QueryClient } from "react-query";

import {
    createTheme,
    ThemeProvider,
    CssBaseline,
} from '@mui/material'

const AppContext = createContext();
const queryClient = new QueryClient();

export function useApp() {
    return useContext(AppContext);
}

export default function AppProvider() {
    const [ showForm, setShowForm ] = useState(false);
    const [ showDrawer, setShowDrawer ] = useState(false);
    const [ auth, setAuth ] = useState(false);
    const [ mode, setMode ] = useState("dark");

    useEffect(() => {
      const token = localStorage.getItem("token");
      if(token) {
        fetch("http://localhost:8080/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(user => {
            setAuth(user);
          })
          .catch(() => {
            setAuth(false);
            localStorage.removeItem("token");
          })
      }
    }, []);

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode,
            },
        });
    }, [mode]);
    return (
      <AppContext.Provider
        value={{
          showForm,
          setShowForm,
          mode,
          setMode,
          showDrawer,
          setShowDrawer,
          auth,
          setAuth,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <AppRouter />
            <CssBaseline />
          </ThemeProvider>
        </QueryClientProvider>
      </AppContext.Provider>
    );
}