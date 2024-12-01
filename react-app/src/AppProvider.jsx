import { createContext, useContext, useState, useMemo } from "react";
// import App from "./App";
import AppRouter from "./AppRouter";

import {
    createTheme,
    ThemeProvider,
    CssBaseline,
} from '@mui/material'

const AppContext = createContext();
export function useApp() {
    return useContext(AppContext);
}

export default function AppProvider() {
    const [ showForm, setShowForm ] = useState(false);
    const [ showDrawer, setShowDrawer ] = useState(false);
    const [ auth, setAuth ] = useState(false);
    const [ mode, setMode ] = useState("dark");

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode,
            },
        });
    }, [mode]);
    return (
        <AppContext.Provider value={{ showForm, setShowForm, mode, setMode, showDrawer, setShowDrawer,
            auth, setAuth
         }}>
            <ThemeProvider theme={theme}>
                <AppRouter />
                <CssBaseline />
            </ThemeProvider>
        </AppContext.Provider>
    )
}