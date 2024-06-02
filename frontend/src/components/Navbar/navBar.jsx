import Backdrop from "@mui/material/Backdrop";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { makeStyles } from "@mui/styles";
import {  useState } from "react";
import "../../assets/css/Navbar/dashboardNavBar.css";
import { clearLocal, getLocal, setLocal } from "../../common/localStorageAccess";
import MenuIcon from "@mui/icons-material/Menu";
import Loader, { DialogLoader } from "../../common/NewLoader";
import LogoutIcon from '@mui/icons-material/Logout';
import StorageIcon from '@mui/icons-material/Storage';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import classNames from "classnames";
import {  IconButton, MenuItem, Select } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import { useHistory, withRouter, Link } from "react-router-dom";


const useStyles2 = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
	},

}));

const useStyles = makeStyles((theme) => ({
	navBtn: {
		[theme.breakpoints.down("md")]: {
			display: "none !important",
		},
		"&:hover": {
			backgroundColor: "transparent !important",
		},
	},
	logo: {
		userSelect: "none",
		cursor: "pointer"
	},
	navBar: {
		backgroundColor: "#fff",
		borderRadius: "0.5em",
		boxShadow: "0 0 0.5em 0.1em #00000040",
		width: "100%",
		maxWidth: "200px"
	},
	navWindow: {
		display: "flex",
		flexDirection: "column",
	},
	navItem:{
		padding: "0.4em 0.4em",
		margin: "0.3em 0.2em",
		listStyleType: "none",
		cursor: "pointer",
		"&:hover": {
			// backgroundColor: "#6646E7",
			backgroundColor: "rgba(102, 70, 231, 0.2)",
			borderRadius: "0.5em",
			"& svg": {
				color : "#6646E7"
			},
		}
	},

	navLink: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
		gap: "0.5em",
		fontSize: "0.88em",
		fontWeight: "400",
	},
	authDetails: {
		padding: "0.6em 0.6em",
		borderBottom: "0.1em solid #6646E7",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	
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
	dbSelect: {
		fontSize: "0.95rem !important",
	},
	nav: {
		display: "flex",
		alignItems: 'center',
		justifyContent: 'center',
		gap: '5px'
	}

}
));

const UserNavbar = (props) => {
	const [isDesktopBarOpened, setIsDesktopBarOpened] = useState(false);
	const [open, setOpen] = useState(false);
	const [selectedDb,setSelectedDb] = useState(getLocal('database_id') ?? null)
	const history = useHistory();
	let databases = (() => {
		let db = getLocal('databases') 
		if (db?.length === 0 || db === null) return []
		return JSON.parse(db)
	})()

	const classes = useStyles();
	const handleClose = () => {
		setOpen(false);
	};

	const handleLogout = () => {
		clearLocal();
		history.push("/login");
	};

	const showDesktopProfile = () => {
		setIsDesktopBarOpened(true);
	};

	const hideDesktopProfile = () => {
		setIsDesktopBarOpened(false);
	};

	return (
		<>
			<LoadingLogout handleClose={handleClose} open={open} />

			<div className={`navbar`}>
				<div className={classes.nav}>
				{window.innerWidth < 768 ? (
					<IconButton className="respNav" onClick={props.toggleLeftNav}>

						<MenuIcon />
					</IconButton>
				) : null}
				<div className="nav-logo">
					<span
						className={classes.logo}
						onClick={() => history.push("/")}
					>Analytics GPT
					</span>
				</div>
				</div>

				<div className={"Nav-div"}>
					{getLocal("user_id") && selectedDb && (
						<FormControl sx={{ minWidth: 120, maxHeight: 80 }} size="small">
							<Select 
							sx={{ boxShadow: "none",
							".MuiOutlinedInput-notchedOutline": { border: 0 },
							"&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
							  {
								border: 0,
							  },
							"&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
							  {
								border: 0,
							  },
						   }}
							  classes={{
								select: classes.dbSelect,
							  }}	
							  onChange={(e) => {	
								setSelectedDb(e.target.value)
								setLocal('database_id',e.target.value)
								history.push('/')
								window.location.reload()
							  }	}					
							  value={selectedDb}
							  defaultValue={selectedDb}
							>
							  {databases?.map((db,index) => <MenuItem key={index} value={db?.id}>{db?.database_name}</MenuItem>)}
							</Select>
						  </FormControl>
					)} 
					<ClickAwayListener
						onClickAway={() => {
							if (isDesktopBarOpened) hideDesktopProfile();
						}}
					>
						<div
							className="Nav"
							onMouseLeave={hideDesktopProfile}
							onClick={showDesktopProfile}
							onMouseEnter={showDesktopProfile}
						>
							{getLocal("access_token") &&
								<div
								className={`profileNavBtn ${isDesktopBarOpened ? "profileNavBtnBack" : ""
									}`}
							>
								<div
									className="profile-nav-grid"
								// style={{
								// 	border: "0.1em solid #6646E7",
								// }}
								>
									<div
										className="navbar-profile-image"
										style={{

											backgroundImage: `url(https://cdn0.iconfinder.com/data/icons/social-media-network-4/48/male_avatar-512.png)`,
										}}
									>
									</div>
								</div>
							</div>}
							<div
								className={classNames("DesktopProfileViewer", {
									displayNone: !isDesktopBarOpened,
								}, classes.navBar)}
							>
								<div className={classes.navWindow}>
									<div className={classes.authDetails}>
									{getLocal("user_id") ? (<><p	className={classes.userInfo}									>
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
									<ul className={classes.navList}>
										<li className={classes.navItem}>
											<Link
												to="/database"
												className={classes.navLink}
											>
												<StorageIcon />
												 Databases 
											</Link>
										</li>
										<li className={classes.navItem}>
											<Link
												to="/add_database"
												className={classes.navLink}
											>
												<BackupTableIcon />
												 Add Database
											</Link>
										</li>

										<li className={classes.navItem}>
											<div
												onClick={handleLogout}
												className={classes.navLink}
											>
												<LogoutIcon />
												 Logout
											</div>
										</li>
									</ul>
								</div>
								{/* <div className="DesktopProfileBtn" onClick={handleLogin}>
									<div className="nav-normal-icon">
										<div className="profile-desktop-navbar-image">
											{/* <img src={LogoutIcon} alt="" /> */}
											{/* <StorageIcon /> */}
										{/* </div>
									</div>
									<div className="nav-normal-item">
										databases
									</div>
								</div> */}

							
							</div>
						</div>
					</ClickAwayListener>
				</div>
			</div>
		</>
	);
}
export default withRouter(UserNavbar);

function LoadingLogout({ handleClose, open }) {
	const classes = useStyles2();

	return open ? (
		<Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
			<Loader name="navbar" />
		</Backdrop>
	) : null;
}
