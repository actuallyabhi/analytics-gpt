import { createRoot } from "react-dom/client";
import Routes from "./components/routes.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import {
	ThemeProvider,
	createTheme,
	responsiveFontSizes,
} from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";

let theme = createTheme({
	typography: {
		fontFamily: `"Poppins", sans-serif`,
		h1: {
			fontWeight: 600,
			fontSize: "3rem",
			"@media (max-width:1920px)": {
				fontSize: "2.0243rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "1.6025rem",
			},
			"@media (max-width:960px)": {
				fontSize: "1.282rem",
			},
			"@media (max-width:600px)": {
				fontSize: "1.2rem",
			},
		},
		
		h2: {
			fontSize: "2.5rem",
			fontWeight: 500,
			"@media (max-width:1920px)": {
				fontSize: "2rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "1.5625rem",
			},
			"@media (max-width:960px)": {
				fontSize: "1.25rem",
			},
			"@media (max-width:600px)": {
				fontSize: "1.1rem",
			},
		},
		h3: {
			fontSize: "1.75rem",
			fontWeight: 500,
			"@media (max-width:1920px)": {
				fontSize: "1.5rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "1.1719rem",
			},
			"@media (max-width:960px)": {
				fontSize: "0.9375rem",
			},
			"@media (max-width:600px)": {
				fontSize: "0.9rem",
			},
		},
		h4: {
			fontWeight: 400,
			fontSize: "1.5rem",
			"@media (max-width:1920px)": {
				fontSize: "1.25rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "0.9766rem",
			},
			"@media (max-width:960px)": {
				fontSize: "0.7813rem",
			},
			"@media (max-width:600px)": {
				fontSize: "0.75rem",
			},
		},
		h5: {
			fontSize: "1.25rem",
			"@media (max-width:1920px)": {
				fontSize: "1.125rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "0.8789rem",
			},
			"@media (max-width:960px)": {
				fontSize: "0.7031rem",
			},
			"@media (max-width:600px)": {
				fontSize: "0.675rem",
			},
		},
		h6: {
			fontSize: "1.125rem",
			"@media (max-width:1920px)": {
				fontSize: "1rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "0.7813rem",
			},
			"@media (max-width:960px)": {
				fontSize: "0.625rem",
			},
			"@media (max-width:600px)": {
				fontSize: "0.6rem",
			},
		},
		subtitle1: {
			fontSize: "1.125rem",
			"@media (max-width:1920px)": {
				fontSize: "1rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "0.7813rem",
			},
			"@media (max-width:960px)": {
				fontSize: "0.675rem",
			},
			"@media (max-width:600px)": {
				fontSize: "0.6rem",
			},
		},
		subtitle2: {
			fontSize: "1rem",
			"@media (max-width:1920px)": {
				fontSize: "0.7813rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "0.625rem",
			},
			"@media (max-width:960px)": {
				fontSize: "0.6rem",
			},
			"@media (max-width:600px)": {
				fontSize: "0.5rem",
			},
		},
		body1: {
			fontSize: "1.25rem",
			"@media (max-width:1920px)": {
				fontSize: "1.125rem !important",
			},
			"@media (max-width:1280px)": {
				fontSize: "1rem",
			},
			"@media (max-width:960px)": {
				fontSize: "0.95rem",
			},
			"@media (max-width:600px)": {
				fontSize: "0.8789rem",
			},
		},
		body2: {
			fontSize: "1.125rem",
			"@media (max-width:1920px)": {
				fontSize: "1rem",
			},
			"@media (max-width:1280px)": {
				fontSize: "0.7813rem",
			},
			"@media (max-width:960px)": {
				fontSize: "0.625rem",
			},
			"@media (max-width:600px)": {
				fontSize: "0.6rem",
			},
		},
	},
	palette: {
		primary: {
			main: "#6646e7",
		},
	},
});

theme = responsiveFontSizes(theme);

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<ThemeProvider theme={theme}>
			<Routes />
			<ToastContainer />
		</ThemeProvider>
	</BrowserRouter>
);
