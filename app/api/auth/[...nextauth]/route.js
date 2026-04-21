import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { authOptions } from "@/lib/authOptions";

// We define authOptions in a separate file to reuse in middleware if needed
export { authOptions };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
