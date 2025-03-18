import type {NextAuthOptions} from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"



export const options : NextAuthOptions = {
  pages: {
    signOut: "/", // Redirect to the homepage after sign out
  },
  providers: [
    GitHubProvider({
      clientId: String(process.env.AUTH_GITHUB_ID),
      clientSecret: String(process.env.AUTH_GITHUB_SECRET),
    }),

    /**GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),*/

  ],
}
