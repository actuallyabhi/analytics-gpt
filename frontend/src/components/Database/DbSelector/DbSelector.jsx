import React from "react";
import { useEffect } from "react";
import { Get } from "../../../common/common";
import { useHistory } from "react-router-dom";
import styles from "./DbSelector.module.css"
import { Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from '@mui/icons-material/Add';
import { setLocal } from "../../../common/localStorageAccess";
import { showToast } from "../../../common/Alert";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		width: "100%",
		flexDirection: "column",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		padding: "36px",
		gap: "40px",
	},
	content: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	space: {

	}
}));
const DbSelector = () => {
	const classes = useStyles();
	const [loading, setLoading] = React.useState(true);
	const [databases, setDatabases] = React.useState([]);
	const history = useHistory();

	useEffect(() => {
		(async () => {
			try {
				const response = await Get(1, `user_databases`);
				if (response.status === 200) {
					setDatabases(response?.data?.databases);
					setLocal('databases', JSON.stringify(response?.data?.databases))
					setLoading(false);
					return;
				}

			} catch (error) {
				console.log(error);
				showToast("error", error?.response?.data);
			}
			setLoading(false);
		})();
	}, []);

	const handleDBSelecttion = (db_id) => {
		setLocal("database_id", db_id);
		history.push("/");
	}

	return (
		<div className={classes.container}>
			<Typography
				variant="h2"
				style={{
					textAlign: "center",
					marginTop: "16px"
				}}
			>
				Database Selection
			</Typography>
			<div className={classes.content}>
				{loading ? (
					<CircularProgress />
				) : (
					databases?.length === 0 && (
						<div
							className={styles.main}
						>
							<Typography
								variant="body1"
								style={{
									textAlign: "center",
								}}
							>
								You have not added any database yet.
							</Typography>

							<AddDb />
						</div>
					)
				)}
				{databases?.map((db, index) => {
					return (
						<Button
							className={classes.org}
							variant="outlined"

							color="primary"
							onClick={() => handleDBSelecttion(db.db_id)}
						>
							{db.database_name}
						</Button>
					)
				})}
				<div className={classes.space}></div>
				{!loading && databases.length > 0 && <AddDb />}
			</div>
		</div>
	);
};

const AddDb = () => {
	const history = useHistory();
	return (
		<div className={styles.btnConatiner}>

			<Button
				variant="contained"
				color="primary"
				startIcon={
					<AddIcon />
				}
				onClick={() => history.push("/add_database")}
			>
				Add a new Database
			</Button>
		</div>
	)
}

export default DbSelector;
