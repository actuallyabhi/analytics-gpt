import axios from "axios";
import baseDomain from "./baseDomain";

export const Get = async (auth, url, params = {}, cancelToken) => {
	return new Promise((resolve, reject) => {
		axios({
			url: `${baseDomain.route}${baseDomain.subRoute}/${url}`,
			method: "GET",
			...(auth
				? {
						headers: {
							Accept: "application/json;charset=UTF-8",
							Authorization: `Bearer ${localStorage.getItem(
								"access_token"
							)}`,
						},
				  }
				: {}),
			params: params,
			...(cancelToken ? { cancelToken } : {}),
		})
			.then((response) => {
				resolve(response);
			})
			.catch(async (e) => {
					console.error(e);
					reject(e);
			});
	});
};


export const Post = async (auth, url, data = {}, cancelToken) => {

	return new Promise((resolve, reject) => {
		axios({
			url: `${baseDomain.route}${baseDomain.subRoute}/${url}`,
			method: "POST",
			...(auth
				? {
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"access_token"
							)}`,
						},
				  }
				: {
						headers: {
							// "Content-Type": "application/json",
						},
				  }),
			data: data,
			...(cancelToken ? { cancelToken } : {}),
		})
			.then((response) => {
				resolve(response);
			})
			.catch(async (e) => {
					console.error(e);
					reject(e);
			});
	});
};

const formatter = new Intl.RelativeTimeFormat(undefined, {
	numeric: "auto",
});

const DIVISIONS = [
	{ amount: 60, name: "seconds" },
	{ amount: 60, name: "minutes" },
	{ amount: 24, name: "hours" },
	{ amount: 7, name: "days" },
	{ amount: 4.34524, name: "weeks" },
	{ amount: 12, name: "months" },
	{ amount: Number.POSITIVE_INFINITY, name: "years" },
];

export function formatTimeAgo(date) {
	let duration = (date - new Date()) / 1000;

	for (let i = 0; i < DIVISIONS.length; i++) {
		const division = DIVISIONS[i];
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}
}