import { app } from "./app";

const port = process.env.PORT;

const server = app.listen(port, () => {
	const address = server.address();

	// Check if address is an object (not a string)
	if (typeof address === "object" && address !== null) {
		const host = address.address === "::" ? "localhost" : address.address; // Handle IPv6
		const port = address.port; // Get the port from the address object
		console.log(`Server running on http://${host}:${port}`);
	} else {
		console.log(`Server running on ${address}`); // Fallback for string addresses (e.g., pipes)
	}
});
