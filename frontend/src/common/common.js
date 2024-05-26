import axios from "axios";
import baseDomain from "./baseDomain";
// export const checkAuth = async () => {
// 	try {
// 		return await Get(1, "check_auth");
		
// 	} catch (error) {
// 		// console.error(error);

// 		const email = localStorage.getItem("be_chat_user_email");
// 		const refresh_token = localStorage.getItem("be_chat_user_refresh_token");
// 		const host_url = localStorage.getItem("host_url");
// 		if (!refresh_token) {
// 			localStorage.clear();
// 			throw new Error("User not found");
// 		}
// 		const data = new FormData();
// 		data.append("email", email);
// 		data.append("refresh_token", refresh_token);
// 		data.append("host_url", host_url);
// 		try {
// 			const response = await Post(0, "refreshAccessToken", data);
// 			localStorage.setItem(
// 				"be_chat_user_access_token",
// 				response.data.data.be_chat_user_access_token
// 			);
// 			localStorage.setItem(
// 				"be_chat_user_refresh_token",
// 				response.data.data.refresh_token
// 			);
// 			localStorage.setItem("be_user_chat_id", response.data.data.chat.id);
// 		} catch (error) {
// 			console.error(error);
// 			localStorage.clear();
//       throw new Error("User not found");
// 		}
// 	}
// };

export const detectIsMobile = () => {
	const toMatch = [
		/Android/i,
		/webOS/i,
		/iPhone/i,
		/iPad/i,
		/iPod/i,
		/BlackBerry/i,
		/Windows Phone/i,
	];
	return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
};
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
				// if (
				// 	e?.response?.data?.message === "Unauthenticated." &&
				// 	url !== "check_auth" &&
				// 	url !== "refreshAccessToken"
				// ) {
				// 	let res = await checkAuth();
				// 	if (res) {
				// 		return Get(auth, url, params, cancelToken);
				// 	}
				// } else {
					// For Debugging
					// if(e.message==='Axios request canceled.'){
					//   e.message += ' ' + url;
					// }
					// if (e?.response?.data?.message)
					// 	swal("Error", e.response.data.message, "error");
					console.error(e);

					reject(e);
				// }
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
							// "Content-Type": "application/json;charset=UTF-8",
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
				// if (e?.response?.data?.message === "Unauthenticated.") {
				// 	let res = await checkAuth();
				// 	if (res) {
				// 		return Post(auth, url, data);
				// 	}
				// } else {
					// if (url !== "save_error_log") {
					// 	// if (e?.response?.data?.message)
					// 	// 	swal("Error", e.response.data.message, "error");
					// }
					console.error(e);
					reject(e);
				// }
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