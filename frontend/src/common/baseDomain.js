export let subDomain = window.location.host.split(".")[0];
const allowedSubDomains = [
	"localhost",
	"localhost:5173",
	"beyondexams",
	"www",
	"react-beyondexam-shone",
	"react-be-abhi",
];
export const subDomainCheck = () => allowedSubDomains.includes(subDomain);

const baseDomain = {
	// route: "https://analytics.beyondexams.org",
	route:"http://localhost:500",
	subRoute: "/api/v1"
};

export default baseDomain;
