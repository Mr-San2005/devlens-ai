import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model";

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return {
    user,
    token,
  };
};

export const login = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return {
    user,
    token,
  };
};