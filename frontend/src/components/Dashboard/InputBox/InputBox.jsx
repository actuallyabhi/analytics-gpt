import React, { useEffect, useRef } from "react";
import styles from "./InputBox.module.css";
import { Get } from "../../../common/common";
import { getLocal, setLocal } from "../../../common/localStorageAccess";
import { Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { HashLoader } from "react-spinners";
import { makeStyles } from "@mui/styles";
import { Checkbox } from "@mui/material";
import { Box, Chip } from "@mui/material";
import { showToast } from "../../../common/Alert";
import { useHistory } from "react-router-dom";

const ITEM_PADDING_TOP = 8;
const ITEM_HEIGHT = 56
const MenuProps = {
 	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const useStyles = makeStyles((theme) => ({
	'@global': {
		  '.MuiBackdrop-root': {
			backdropFilter: 'blur(0px) !important',
	},
  }
}));

function getStyles(name, selectedTables, theme) {
	return {
		fontWeight:
			selectedTables?.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

const InputBox = ({ setQuery, loading, isFetching, setLoading, setOutput }) => {
	const classes = useStyles();
	const history = useHistory();
	const [message, setMessage] = React.useState("");
	const [tables, setTables] = React.useState([]);
	// const [tables, setTables] = React.useState(["chats","chats_config","context"]);
	const theme = useTheme();
	const [selectedTables, setSelectedTables] = React.useState([]);
	const textareaRef = useRef(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const response = await Get(1, `databases/${getLocal("database_id")}`);
				if (response.status === 200) {
					const tables = response.data.data
					if (tables.length === 0) {
						showToast("info","No Tables Found in the database!")
					}
					setTables(tables);
					if (getLocal('selected_tables') ) {
						setSelectedTables(getLocal('selected_tables').split(","))
						return
					}
					setSelectedTables([tables[0]])
					return;
				}
			} catch (error) {
				if(error?.response?.status === 401) {
					localStorage.clear();
					history.push("/login");
					return;
				}
				showToast("error", error?.response?.data);

			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleTextChange = (event) => {
		setMessage(event.target.value);
		adjustTextareaHeight();
	};

	const adjustTextareaHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "2rem";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	const handleSend = () => {
		if (message) {
			if (selectedTables == null) {
				showToast("info", "Please select a table first","table_id")
				return
			}
			setQuery(message);
			setMessage("");
			setOutput(null);
			textareaRef.current.style.height = "2rem";
		}
	};

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		// console.log(value)
		setSelectedTables(
			typeof value === 'string' ? value.split(',') : value,
		);
		setLocal('selected_tables', typeof value === 'string' ? value.split(',') : value)
	};

	return (		 
		<>
		<div className={styles.UnansweredContainer}>
			<div className={styles.answerTo}>
				<Typography variant="body2">Query Table:</Typography>

				<div className={styles.tableOptions}>
					<FormControl sx={{ m: 0, width: 300, background: "white" }}>
						<InputLabel id="demo-multiple-name-label">Tables</InputLabel>
						<Select
							labelId="demo-multiple-name-label"
							id="demo-multiple-name"
							multiple					
							value={selectedTables || tables[0]}
							onChange={handleChange}
							input={<OutlinedInput label="Tables" />}
							MenuProps={MenuProps}
							renderValue={(selected) => (
								<Box sx={{ display: 'flex',gap: 0.5 }}>
								  {selectedTables?.map((value,index) => {
									  if(index > 2) return;
									  	return <Chip key={value} label={value} />
								  }
								  )}
								</Box>
							)}
						>
							{tables?.map((table) => (
								<MenuItem
									key={table}
									value={table}
									style={getStyles(table, selectedTables, theme)}
								>
										<Checkbox 
											checked={selectedTables.includes(table)} 
											sx={{
												height:"10px !important"
											}}
											color="primary"
										/>
										{table}
								</MenuItem>
							))}
						</Select>
					</FormControl>

				</div>
			</div>
			<div className={styles.inputBoxContainer}>
				<textarea
					className={styles.inputBox}
					value={message}
					onChange={(e) => handleTextChange(e)}
					placeholder="write your query here..."
					ref={textareaRef}
					rows={1}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							if (message && !loading) {
								handleSend();
							}
						}
					}}
				></textarea>
				<button
					onClick={() => {
						if (message && !loading) {
							handleSend();
						}
					}}
					style={{
						color: message && !loading ? "var(--color1)" : "var(--color6)",
						cursor: message && !loading ? "pointer" : "not-allowed",
					}}
					className={styles.sendButton}
					
				>
					{isFetching || loading ? <HashLoader size={22}  /> : 'send'}
				</button>
			</div>
		</div>
	</>
	);
};

export default InputBox;
