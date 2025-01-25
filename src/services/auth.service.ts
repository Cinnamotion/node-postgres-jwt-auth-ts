import jwt from "jsonwebtoken";
import { User } from "../models/user.interface";

const jwt_secret = process.env.JWT_SECRET;

export const generateToken = (user: User): string => {
	return jwt.sign({ id: user.id, email: user.email }, jwt_secret as string, {
		expiresIn: "1h",
	});
};
