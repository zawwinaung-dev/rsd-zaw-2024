import {
    Box, Typography, OutlinedInput, Button
} from "@mui/material"
import { data, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"

async function postUser(data) {
    const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        throw new Error("Network response was not ok.");
    }

    return res.json();
}

export default function Register() {
    const navigate = useNavigate();

    const create = useMutation(postUser, {
        onSuccess: () => {
            navigate("/login");
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitRegister = data => {
        create.mutate(data);
    }
    
    return (
        <Box>
            <Typography variant="h3">Register</Typography>
            <form onSubmit={handleSubmit(submitRegister)}>
            <OutlinedInput
                    {...register("name", { required: true })}
                    fullWidth
                    sx={{ mt: 2}}
                    placeholder="name"
                />
                { errors.name && (
                    <Typography color="error">name is required</Typography>
                )}
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
                    {...register("bio")}
                    fullWidth
                    sx={{ mt: 2}}
                    placeholder="bio"
                />
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
                    Register
                </Button>
            </form>
        </Box>
    )
}