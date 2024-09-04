import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks:['none'],
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      },
      // async authorize(cred) {
      //   const { code } = cred;
      //   const params = new URLSearchParams();
      //   params.append("code", code);
      //   params.append("client_id", process.env.GOOGLE_CLIENT_ID!);
      //   params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
      //   params.append("redirect_uri", "postmessage");
      //   params.append("grant_type", "authorization_code");
      //   const res = await fetch("https://oauth2.googleapis.com/token", {
      //     method: "POST",
      //     body: params
      // }
      //   );
      //   const data = await res.json();
      //   return {
      //     idToken: data.id_token,
      //     accessToken: data.access_token
      //   };
      // }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path:'/',
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: '/auth',
  },
  secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;