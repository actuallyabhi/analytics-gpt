export let subDomain = window.location.host.split(".")[0];
const allowedSubDomains = [
	"localhost",
	"localhost:5173",
	"www",
];
export const subDomainCheck = () => allowedSubDomains.includes(subDomain);

const baseDomain = {
	route:"http://localhost:5000",
	subRoute: "/api/v1"
};

export default baseDomain;
