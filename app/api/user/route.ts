import { NextResponse } from 'next/server';
import * as sdk from 'node-appwrite';
import { ID, Query } from "node-appwrite"

export async function POST(req: any) {
    if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
        throw new Error('You need to set appwrite environment variables');
    }

    const body = await req.json(); 
    const { email, phone, name } = body;

    if (!email || !phone || !name) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = new sdk.Client();

    client
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const users = new sdk.Users(client);

    try {
        // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
        const newUser = await users.create(
            ID.unique(),
            email,
            phone,
            undefined,
            name
        );

        return NextResponse.json(newUser, { status: 200 })
    } catch (error: any) {
        // Check existing user
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal("email", [email]),
            ]);
            return NextResponse.json(existingUser.users[0], { status: 409 });
        }
        console.error("An error occurred while creating a new user:", error);
    }
}
