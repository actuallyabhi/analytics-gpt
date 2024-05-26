import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";

// Adds an Click Image EventListener to page
const ViewImageDialog = () => {
	const [imgSrc, setImgSrc] = useState("");
	const [isOpenImgDialog, setIsOpenImgDialog] = useState(false);

	useEffect(() => {
		function clickListener(e) {
			if (e.target.tagName === "IMG") {
				if (e.target.alt === "Download" || e.target.alt === "incomplete") return;
				setImgSrc(e.target.src);
				setIsOpenImgDialog(true);
			}
		}
		window.addEventListener("click", clickListener);

		return () => {
			window.removeEventListener("click", clickListener);
		};
	}, []);
	return (
		<Dialog
			maxWidth="lg"
			open={isOpenImgDialog}
			onClose={() => {
				setIsOpenImgDialog(false);
				setImgSrc("");
			}}
			aria-labelledby="max-width-dialog-title"
		>
			<DialogContent>
				<img src={imgSrc} alt="" style={{width: "100%"}} />
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						setIsOpenImgDialog(false);
						setImgSrc("");
					}}
					color="primary"
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ViewImageDialog;
