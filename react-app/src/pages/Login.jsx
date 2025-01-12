import { Box, Typography, OutlinedInput, Button, Alert } from "@mui/material";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

async function postLogin(data) {
	const res = await fetch("http://localhost:8080/login", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.msg || "Login failed");
	}

	return res.json();
}

export default function Login() {
	const { setAuth } = useApp();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const login = useMutation(postLogin, {
		onSuccess: ({ user, token }) => {
			// First store the token
			localStorage.setItem("token", token);
			// Then set the auth state
			setAuth(user);
			// Finally navigate
			navigate("/");
		},
		onError: (error) => {
			console.error("Login failed:", error);
		}
	});

	const submitLogin = data => {
		login.mutate(data);
	};

	return (
		<Box>
			<Typography variant="h3">Login</Typography>

			{login.isError && (
				<Alert
					severity="warning"
					sx={{ mt: 2 }}>
					Invalid username or password
				</Alert>
			)}

			<form onSubmit={handleSubmit(submitLogin)}>
				<OutlinedInput
					{...register("username", { required: true })}
					fullWidth
					placeholder="username"
					sx={{ mt: 2 }}
				/>
				{errors.username && (
					<Typography color="error">username is required</Typography>
				)}

				<OutlinedInput
					{...register("password", { required: true })}
					fullWidth
					type="password"
					placeholder="password"
					sx={{ mt: 2 }}
				/>
				{errors.password && (
					<Typography color="error">password is required</Typography>
				)}

				<Button
					sx={{ mt: 2 }}
					type="submit"
					fullWidth
					variant="contained">
					Login
				</Button>
			</form>
		</Box>
	);
}