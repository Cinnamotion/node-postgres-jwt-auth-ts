import { Request, Response } from "express";
import { hashPassword } from "../services/password.services";
import prisma from "../models/user";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const createUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res
				.status(400)
				.json({ message: "You must provide both email and password fields" });
			return;
		}
		const hashedPassword = await hashPassword(password);
		const user = await prisma.create({
			data: {
				email,
				password: hashedPassword,
			},
		});
		res.status(201).json({ user, message: "User created succesfully" });
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			res.status(400).json({ message: "Email already exists" });
			return;
		}
		console.log(error);
		res.status(500).json({ message: "Error on user addition" });
	}
};

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await prisma.findMany();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

export const getUser = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);

	try {
		const user = await prisma.findUnique({
			where: {
				id,
			},
		});
		if (!user) {
			res.status(401).json({ message: "User not found" });
			return;
		}
		res.status(200).json(user);
		console.log("User found:", user);
	} catch (error) {
		res.status(500).send({ message: error });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	try {
		const { email, password } = req.body;
		let user = await prisma.findUnique({ where: { id } });
		if (!user) {
			res.status(401).json({ message: "User not found" });
			return;
		}
		let updatedUser = { ...user };

		if (email) {
			updatedUser.email = email;
		}

		if (password) {
			const hashedPassword = await hashPassword(password);
			updatedUser.password = hashedPassword;
		}

		user = await prisma.update({
			where: {
				id,
			},
			data: updatedUser,
		});
		res.status(200).json(user);
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

export const deleteUser = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	try {
		await prisma.delete({
			where: {
				id,
			},
		});
		res
			.status(200)
			.json({ message: `The user with ID ${id} has been deleted` });
	} catch (error) {
		res.status(400).json(error);
	}
};
