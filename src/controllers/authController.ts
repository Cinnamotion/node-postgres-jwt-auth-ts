import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { comparePasswords, hashPassword } from "../services/password.services";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	if (!email || !password) {
		res
			.status(400)
			.json({ message: "You must provide both email and password fields" });
		return;
	}
	try {
		const hashedPassword = await hashPassword(password);
		console.log("Hashed pass:", hashedPassword);

		const user = await prisma.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		const token = generateToken(user);
		res.status(201).json({ token });
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			res.status(400).json({ message: "Email already exists" });
			return;
		}
		console.log(error);
		res.status(500).json({ message: "Error on the register" });
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;
	try {
		const user = await prisma.findUnique({
			where: {
				email,
			},
		});
		const passwordsMatch = await comparePasswords(password, user!.password);
		if (!passwordsMatch) {
			res.status(401).json({ message: "Invalid credentials" });
			return;
		}
		const token = generateToken(user!);
		console.log("Passwords match?", passwordsMatch);
		console.log("Generated token?", token);

		res.status(201).json({ token });
	} catch (error) {}
};
