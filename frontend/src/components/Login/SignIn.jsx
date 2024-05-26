import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import { CircularProgress, Link as MuiLink } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import DbSelector from "../Database/DbSelector/DbSelector";
import MetaHelmet from "../../common/MetaHelmet";
import { Post } from "../../common/common";
import { setLocal } from "../../common/localStorageAccess";

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
		marginTop: theme.spacing(1),
	},
	submit: {
		// margin: theme.spacing(3, 0, 2),
		// margin: "20px 0px",
	},
}));

export default function SignIn({
	toggleAuth
}) {
	const classes = useStyles();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading,setLoading] = useState(false)
	const [isError, setIsError] = useState(false);
  const history = useHistory();

	async function handleLogin(event) {
		event.preventDefault();
		if (
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false ||
			password.length === 0
		) {
			setIsError(true);
			return;
		}
		setIsError(false);

		try {
			const formData = new FormData()
			formData.append("email",email)
			formData.append("password",password)
			setLoading(true)
			
			let res = await Post(0,"login_user",formData)
			setLoading(false)
			// console.log(res);
			if (res.status === 200 ){
				setLocal("access_token",res.data.access_token)
				setLocal("user_id",res.data.user_id)
				setLocal("user_name",email)
				toggleAuth()
				history.push("/database");
				// window.location.reload();
			} 
			
		} catch (error) {
			console.log(error?.response?.data?.login_status);
			setLoading(false)
			setIsError(true);
			
		}
	}

  if(localStorage.getItem("access_token")) {
    return <DbSelector />
  }


	return (
		<Container component="main" maxWidth="xs">
      	<MetaHelmet
				title='Login' />
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						variant="outlined"
						margin="normal"
						required
						style={{
							width: "100%",
						}}
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setIsError(false);
						}}
						error={
							isError &&
							/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ===
								false
						}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setIsError(false);
						}}
						error={isError}
					/>

					<label style={{ color: "red", display: "flex", fontSize:"1rem" }}>
						{isError &&
							(email.length === 0 || password.length === 0) &&
							"Please fill all the fields"}
						{isError &&
							email.length > 0 &&
							password.length > 0 &&
							"Please enter valid email and password"}
					</label>

					<Button
						onClick={handleLogin}
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						// className={classes.submit}
						style={{
							margin: "20px 0px",
						}}
					>
						{loading ? <CircularProgress 
								size={24}
								color="inherit"
							/> : "Sign In" 
						}
					</Button>
					<Grid container>
						{/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>  */}
						<Grid item>
							<MuiLink component={Link} to="/signup" variant="body2">
								{"Don't have an account? Sign Up"}
							</MuiLink>
						</Grid>
					</Grid>
				</form>
			</div>

		</Container>
	);
}