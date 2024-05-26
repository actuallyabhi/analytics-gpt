import { PacmanLoader, ClimbingBoxLoader, ScaleLoader } from "react-spinners";
import React from "react";
import { getSession, setSession, removeSession } from "./localStorageAccess";
import Backdrop from "@mui/material/Backdrop";
import { makeStyles } from "@mui/styles";
// const data = require("./Quotes.json");

const data = [
    {
        "quote":"The best way to predict the future is to invent it.",
        "author":"Alan Kay"
    },
    {
        "quote":"Dreams come a size too big so that we can grow into them.",
        "author":"Josie Bisset"
    },
    {
        "quote":"You can never be overdressed or overeducated.",
        "author":"Oscar Wilde"
    },
   {
        "quote":"Education is what remains after one has forgotten what one has learned in school.",
        "author":"Albert Einstein"
    },
   {
        "quote":"Education is not preparation for life; education is life itself.",
        "author":"John Dewey"
    },
    {
        "quote":"Learning is a treasure that will follow its owner everywhere.",
        "author":"Chinese Proverb"
    }
]

const color = "rgba(102,70,213,1)";
const loader_list = [
	<PacmanLoader {...{ color }} />,
	<ClimbingBoxLoader {...{ color }} />,
	<ScaleLoader style={{ alignSelf: "center" }} {...{ color }} />,
];

export const SmallLoader = ({ height = "500px", width='95%' }) => {
	let selected_loader = Math.floor(Math.random() * loader_list.length);
	return (
		<div className="small-loader" style={{ height, width }}>
			<div className="small-loader-inner">
				{loader_list[selected_loader]}
				<span className="small-loader-text">Fetching Content...</span> 
			</div>
			
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		background: '#ffffff00',
	},
}));
export const DialogLoader = () => {
	const classes = useStyles();
	let selected_loader = Math.floor(Math.random() * loader_list.length);
	return (
		<Backdrop classes={{root: classes.backdrop}} open={true}>
			<div className="small-loader" style={{ height: "250px", width: "250px" }}>
				{loader_list[selected_loader]}
			</div>
		</Backdrop>
	);
};

const Loader = (props) => {
	const [loader, setLoader] = React.useState();
	const [quote, setQuote] = React.useState();
	const [cite, setCite] = React.useState();

	let selected_loader = Math.floor(Math.random() * loader_list.length);
	let selected_quote = Math.floor(Math.random() * data.length);

	const setLoaderContents = (loader, quote, cite) => {
		setLoader(loader);
		setQuote(quote);
		setCite(cite);
	};

	React.useEffect(() => {
		const quote = data[selected_quote].quote;
		const cite = data[selected_quote].author;
		// Every loader has name prop can be used to debug unwanted loader renders
		// console.log(props.name,"name")

		if (props.firstPage) {
			setSession("loader", JSON.stringify({ quote, cite, selected_loader }));
			setLoaderContents(selected_loader, quote, cite);
			return;
		}
		if (!props.firstPage && getSession("loader")) {
			const { quote, cite, selected_loader } = JSON.parse(getSession("loader"));
			setLoaderContents(selected_loader, quote, cite);
			removeSession("loader");
			return;
		}
		setLoaderContents(selected_loader, quote, cite);
	}, []);

	return (
		<div className="init-loader">
			<div>
				{loader_list[loader]}
				<span style={{ color: "black" }}>Fetching Knowledge...</span>
			</div>

			<div className="init-loader-text">
				<blockquote>{quote} </blockquote>
				<cite> - {cite} </cite>
			</div>
		</div>
	);
};

export default Loader;