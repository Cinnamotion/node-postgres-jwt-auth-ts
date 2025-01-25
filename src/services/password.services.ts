import bcrypt from "bcrypt";

const salt_rounds: number = 10;

// Create hashed password
export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, salt_rounds);
};

// Read hashed password and compare with the one on DB
export const comparePasswords = async (
	password: string,
	hash: string
): Promise<boolean> => {
	return await bcrypt.compare(password, hash);
};
