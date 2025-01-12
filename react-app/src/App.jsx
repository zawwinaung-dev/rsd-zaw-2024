import { useState } from "react";
import Header from "./components/Header";
import AppDrawer from "./components/AppDrawer";
import { Container } from "@mui/material";
import { Outlet } from "react-router";

export default function App() {
    return (
        <div>
            <Header />
            <AppDrawer />
            <Container sx={{ mt: 4 }} maxWidth="md">
                <Outlet />
            </Container>
        </div>
    );
}