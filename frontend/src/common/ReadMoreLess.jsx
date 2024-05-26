import { Box, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import "./ReadMoreLess.css";

const useStyles = makeStyles((theme) => ({
	root: {
		fontSize: 16,
		[theme.breakpoints.down("sm")]: {
			fontSize: '14px',
		},
		[theme.breakpoints.down("xs")]: {
			fontSize: '12px',
		},
		flexDirection: 'column',
	},
}));

const ReadMoreLess = ({ children,readMoreLength,className }) => {
	const [isReadMore, setIsReadMore] = useState(false);
	const READ_MORE_LENGTH = readMoreLength ?? 30;

	const classes = useStyles();

	return (
		<>
			{children.length > READ_MORE_LENGTH ? (
				<Box component='div' className={classes.root}>
					<span
						className={"read-more-less " + className}
						dangerouslySetInnerHTML={{
							__html: isReadMore ? children : (children.substr(0, READ_MORE_LENGTH)+'...'),
						}}
					></span>
					<button className="ReadMoreLess-button" onClick={() => setIsReadMore((prevState) => !prevState)}>
						{isReadMore ? "Show less" : "Show more"}
					</button>
				</Box>
			) : (
				<Box component='div' className={classes.root+' read-more-less '+ className} dangerouslySetInnerHTML={{ __html: children }}></Box>
			)}
		</>
	);
};

export default ReadMoreLess;
