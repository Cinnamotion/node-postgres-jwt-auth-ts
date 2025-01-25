import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../controllers/userController";

interface DecodedToken {
	id: number;
	email: string;
	iat: number;
	exp: number;
}

interface AuthenticatedRequest extends Request {
	user?: DecodedToken; // Add a user property to the Request object
}
const router = express.Router();

// JWT middleware to check if logged in

const authenticateToken = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Access denied. No token provided." });
		return;
	}
	try {
		const jwt_secret = process.env.JWT_SECRET!;
		jwt.verify(token, jwt_secret, (err, decoded) => {
			if (err) {
				console.error("Authetication error:", err);
				res.status(403).json({ message: "Forbidden" });
				return;
			}
			req.user = decoded as DecodedToken;
			next();
		});
	} catch (error) {
		console.error("Unexpected error during token verification:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// router.get(
// 	"/",
// 	authenticateToken,
// 	(req: AuthenticatedRequest, res: Response) => {
// 		const { id, email } = req.user!;
// 		console.log("getAll", id, email);
// 		res.json({ id, email

// 		});
// 	}
// );

router.get("/", getUsers);

router.post("/", authenticateToken, () => {
	console.log("post");
});
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
