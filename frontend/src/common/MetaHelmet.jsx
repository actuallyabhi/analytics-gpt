import React from "react";
import { Helmet } from "react-helmet";

const MetaHelmet = ({ title, description, image }) => {
	return (
		<Helmet>
			<title>{String(title)}</title>
			<meta name="description" content={String(description)} />
			<meta property="og:title" content={String(title)} />
			<meta property="og:description" content={String(description)} />
			<meta name="twitter:title" content={String(title)} />
			<meta name="twitter:description" content={String(description)} />
		</Helmet>
	);
};
export default MetaHelmet;
