import {
    Box, Typography, OutlinedInput, Button, Alert,
} from "@mui/material"
import { useApp } from "../AppProvider"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"

async function postLogin(data) {
    const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        throw new Error("Network response was not ok");
    }

    return res.json(); 
}

export default function Login() {
    const { setAuth } = useApp();
    const navigate = useNavigate();

    const login = useMutation(postLogin, {
        onSuccess: data => {
            setAuth(data.user);
            localStorage.setItem("token", data.token);
            navigate("/");
        },
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitLogin = data => {
        // setAuth(true);
        // navigate("/");
        login.mutate(data);
    }
    
    return (
        <Box>
            <Typography variant="h3">Login</Typography>

            { login.isError && 
                <Alert severity="warning" sx={{ mt: 2}}>
                    Invalid username or password
                </Alert>
            }

            <form onSubmit={handleSubmit(submitLogin)}>
                <OutlinedInput
                    {...register("username", { required: true })}
                    fullWidth
                    sx={{ mt: 2}}
                    placeholder="username"
                />
                { errors.username && (
                    <Typography color="error">username is required</Typography>
                )}
                <OutlinedInput
                    {...register("password", { required: true })}
                    fullWidth
                    sx={{ mt: 2}}
                    placeholder="password"
                />
                { errors.password && (
                    <Typography color="error">password is required</Typography>
                )}
                <Button 
                    fullWidth
                    type="submit"
                    sx={{ mt: 2}}
                    variant="contained">
                    Login
                </Button>
            </form>
        </Box>
    )
}