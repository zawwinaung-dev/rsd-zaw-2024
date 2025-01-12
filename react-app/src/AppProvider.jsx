import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClientProvider, QueryClient } from "react-query";
import AppRouter from "./AppRouter";
import { wsService } from "./services/websocket";

const AppContext = createContext();
const queryClient = new QueryClient();
const API = import.meta.env.VITE_API || "http://localhost:8080";

export function useApp() {
	return useContext(AppContext);
}

export default function AppProvider() {
	const [showForm, setShowForm] = useState(false);
	const [showDrawer, setShowDrawer] = useState(false);
	const [mode, setMode] = useState("dark");
	const [auth, setAuth] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Handle WebSocket notifications
    useEffect(() => {
        if (auth) {
            const token = localStorage.getItem("token");
            if (token) {
                wsService.connect(token);
                
                // Add notification listener
                const unsubscribe = wsService.addListener((notification) => {
                    setNotifications(prev => [notification, ...prev]);
                    // You can also use queryClient.invalidateQueries() here to refresh notifications list
                });

                return () => {
                    unsubscribe();
                    wsService.disconnect();
                };
            }
        } else {
            wsService.disconnect();
        }
    }, [auth]);

    // Verify user session on app load
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setAuth(null);
                return;
            }

            try {
                const res = await fetch(`${API}/verify`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Verification failed');
                }

                const user = await res.json();
                if (user && user.name) {
                    setAuth(user);
                } else {
                    throw new Error('Invalid user data');
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                setAuth(null);
                localStorage.removeItem("token");
            }
        };

        verifyUser();
    }, []); // Run once on app load

	const theme = useMemo(() => {
		return createTheme({
			palette: {
				mode,
			}
		});
	}, [mode]);

	return (
		<AppContext.Provider
			value={{
				showDrawer,
				setShowDrawer,
				showForm,
				setShowForm,
				mode,
				setMode,
				auth,
				setAuth,
                notifications,
                setNotifications,
			}}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<QueryClientProvider client={queryClient}>
					<AppRouter />
				</QueryClientProvider>
			</ThemeProvider>
		</AppContext.Provider>
	);
}