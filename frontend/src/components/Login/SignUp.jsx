import { useHistory } from "react-router-dom";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import MuiLink from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { Post } from "../../common/common";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<MuiLink color="inherit" href="https://www.beyondchats.com">
				BeyondAnalytics
			</MuiLink>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		// margin: theme.spacing(3, 0, 2),
		margin: "20px 0px",
	},
}));

export default function SignUp() {
	const classes = useStyles();
	const [isError, setIsError] = useState(false);
	const [errorText, setErrorText] = useState("");
	const [firstName, setFirstName] = useState("");
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const history = useHistory();

	async function handleSubmit(event) {
		event.preventDefault();
		// if (
		// 	firstName.length === 0 ||
		// 	/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false ||
		// 	password.length < 6 ||
		// 	mobile.length < 10 ||  /^\d+$/.test(mobile) === false
		// ) {
		// 	setIsError(true);
		// 	return;
		// }
		switch (true) {
			case firstName.length === 0:
				setIsError(true);
				setErrorText("Name is required");
				return;
			case /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
				email
			) === false:
				setIsError(true);
				setErrorText(email.length === 0 ? "Email is required" : "Invalid email");
				return;
			case password.length < 6:
				setIsError(true);
				setErrorText("Password must be atleast 6 characters");
				return;
			case mobile.length < 10 || /^\d+$/.test(mobile) === false:
				setIsError(true);
				setErrorText(mobile.length === 0 ? "Mobile is required" : "Invalid mobile");
				return;
			default:
				break;
		}
		
		setIsError(false);
		setErrorText("");

		try {
			const formData = new FormData();
			formData.append("name", firstName);
			formData.append("email", email);
			formData.append("password", password);
			formData.append("mobile", mobile);
			let res = await Post(0, "create_user", formData);
			// console.log(res);
			if (res.status === 200) {
				history.push("/login");
			// history.push("/");
			}
			
		} catch (error) {
			console.error(error);
			setIsError(true);
			setErrorText(error.response.data);

		}
	}

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								autoComplete="name"
								name="Name"
								variant="outlined"
								required
								fullWidth
								id="name"
								label="Name"
								autoFocus
								value={firstName}
								error={isError && firstName.length === 0}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								value={email}
								error={
									isError &&
									/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
										email
									) === false
								}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								type="tel"
								fullWidth
								id="mobile"
								label="Mobile Number"
								name="mobile"
								autoComplete="mobile"
								value={mobile}
								error={isError && (mobile.length < 10 || /^\d+$/.test(mobile) === false)}
								onChange={(e) => setMobile(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								value={password}
								error={isError && password.length < 6 }
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							{isError && (
								<Typography
									variant="body2"
									color="error"
								>

									{errorText}
								</Typography>
							)}
					</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={handleSubmit}
						style={{
							margin: "20px 0px",
						}}
					>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-start">
						<Grid item>
							<MuiLink component={Link} to="/login" variant="body2">
								Already have an account? Sign in
							</MuiLink>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
}
