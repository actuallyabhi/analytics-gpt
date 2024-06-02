import { Suspense, lazy, useState, useEffect } from "react";
import { Switch, Route, Redirect, Link, useHistory } from "react-router-dom";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from "@mui/icons-material/Logout";
import NewLoader, { SmallLoader } from "../common/NewLoader.jsx";
import "../assets/css/common/default.scss";
import {
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { clearLocal } from "../common/localStorageAccess.js";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import StorageIcon from '@mui/icons-material/Storage';
import { makeStyles } from "@mui/styles";
import { getLocal } from "../common/localStorageAccess.js";
const DbSelector = lazy(() => import("./Database/DbSelector/DbSelector.jsx"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard.jsx"));
const SignIn = lazy(() => import("./Login/SignIn.jsx"));
const SignUp = lazy(() => import("./Login/SignUp.jsx"));
const AddDb = lazy(() => import("./Database/DbSelector/AddDb/AddDb.jsx"));
const UserNavbar = lazy(() => import("./Navbar/navBar"));

const useStyles = makeStyles((theme) => ({
	authDetails: {
		padding: "0.6em 0.6em",
		borderBottom: "0.1em solid #6646E7",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	user: {
		fontSize: "0.88em",
		fontWeight: "400",
		color: "#6646E7",
	},
	userInfo: {
		fontSize: "70%",
		fontWeight: "400",
		color: "#000",

	},
}));
function LoginNavigation() {
	const classes = useStyles();
	const [isOpened, setIsOpened] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("user_id") && localStorage.getItem("access_token"))
	const history = useHistory();

	useEffect(() => {
		if (getLocal("user_id") == null && getLocal("access_token") == null) {
			history.push("/login");
			return;
		} else {
			setIsAuthenticated(true)
		}
		if (getLocal("database_id") == null) {
			history.push("/database");
			return;
		}
	}, [])


	const toggleLeftNav = () => {
		setIsOpened(prev => !prev);
	};

	return (
		<Suspense fallback={<NewLoader firstPage={true} name="routes" />}>
			<Switch>
				<Route path="/">
					<UserNavbar toggleLeftNav={toggleLeftNav} />
					<Drawer anchor={"left"} open={isOpened} >
						<List>
							<ListItem>
								<div className={classes.authDetails}>
									{getLocal("user_id") ? (<><p className={classes.userInfo}									>
										Logged in as
									</p>
										<p
											className={classes.user}
										>
											{getLocal("user_name")?.split("@")[0].substring(0, 15)}
										</p>
									</>) : (
										<p className={classes.user}>
											Not Logged in
										</p>
									)}

								</div>
							</ListItem>
							{[
								{ title: "Databases", Icon: StorageIcon, path: "/database" },
								{ title: "Add Database", Icon: BackupTableIcon, path: "/add_database" },
								{
									title: "Logout", Icon: LogoutIcon, path: "/login", action: () => {
										clearLocal()
									}
								},
							].map(({ title, Icon, path, action }, index) => (
								<ListItem
									component={Link}
									key={index}
									onClick={() => {
										setIsOpened(false);
										history.push(path)
										action && action()
									}}
								>
									<ListItemIcon>
										<Icon />
									</ListItemIcon>
									<ListItemText primary={title} />
								</ListItem>
							))}
						</List>
					</Drawer>
					<Suspense fallback={<SmallLoader name="routes" />}>

						<Switch>
							<Route exact path="/login" render={() => <SignIn  toggleAuth={() => setIsAuthenticated(true)} />} />
							<Route exact path="/signup" component={SignUp} />
							{isAuthenticated && (
								<Switch>
									<Route exact path="/" component={Dashboard} />
									<Route exact path="/database" component={DbSelector} />
									<Route exact path="/add_database" component={AddDb} />
								</Switch>
							)}

							<Route exact path="/signin">
								<Redirect to="/login" />
							</Route>
						</Switch>
					</Suspense>
				</Route>
			</Switch>
		</Suspense>
	);
}

export default LoginNavigation;
