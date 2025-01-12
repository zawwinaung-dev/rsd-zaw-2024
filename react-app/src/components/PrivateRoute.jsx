import { Navigate } from "react-router";
import { useApp } from "../AppProvider";

export default function PrivateRoute({ children }) {
    const { auth } = useApp();

    if (!auth) {
        return <Navigate to="/login" />;
    }

    return children;
}