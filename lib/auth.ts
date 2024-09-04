import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { User } from "@prisma/client";
import authConfig from "@/auth.config";
import { db } from "./db";
import { cache } from "react";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async session({ session, token }) {
      if (token.sub  && token.email && token.image) {
        session.user.id = token.sub || session.user.id;
        session.user.name = token.name
        session.user.email = token.email
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) { 
        token.id = user.id
      }
      if (token.sub) {
        const user = await getUserById(token.sub);
        token.name = user?.name
        token.image = user?.image
        token.email = user?.email
      }
      return token;
    },
  },
  theme: {
    colorScheme: "dark",
    logo: "/icon.png"
  },
};

export async function currentUser(): Promise<User | null> {
  const user = await currentProfile();
  return user;
}

export async function getUserByEmail(email:string) {
  try {
    const user = await db.user.findUnique({where:{email}
    }) 
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}

/**
 * Fetches a user by their ID, with caching for improved performance.
 * 
 * @param id - The unique identifier of the user.
 * @returns The user object if found, null otherwise.
 */
export const getUserById = async (id: string) => {
  "use server"
  
  try {
    const user = await db.user.findUnique({
      where: { id }
    })

    return user
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null
  }
}


export async function currentProfile():Promise<User>{
	"use server"
  try {
    const session = await auth();

    if (!session?.user?.email) {
			throw new Error("No session found");
    }
		
		const {email} = session?.user

		const currentUser = cache(async () => {
			const user = await getUserByEmail(email);
			return user;
		});

		const user =await currentUser()

    if (!user) {
			throw new Error("User not found");
    }
		
		return user
  } catch (error: any) {
		console.log(error.message)
		throw error
  }
} 
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);