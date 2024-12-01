import {
    Box, Typography, OutlinedInput, Button
} from "@mui/material"
import { useApp } from "../AppProvider"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"

export default function Login() {
    const { setAuth } = useApp();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitLogin = () => {
        setAuth(true);
        navigate("/");
    }
    
    return (
        <Box>
            <Typography variant="h3">Login</Typography>
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