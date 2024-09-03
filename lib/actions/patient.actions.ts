'use server';

import { databases, storage, users } from "@/lib/appwrite.config";
import { parseStringify } from "../utils";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";



export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user)
  } catch (error) {
    console.error('An error occurred while getting user information:', error);
  }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(identificationDocument?.get('blofFile') as Blob, identificationDocument.get('fileName') as string)
      file = await storage.createFile(process.env.NEXT_PUBLIC_BUCKET_ID as string, ID.unique(), inputFile)
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(process.env.APPWRITE_DATABASE_ID as string, process.env.PATIENT_COLLECTION_ID as string, ID.unique(), {
      identificationDocumentId: file?.$id || null,
      identificationDocumentUrl: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`,
      ...patient
    })

    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID as string,
      process.env.PATIENT_COLLECTION_ID as string,
      [
        Query.equal('userId', userId)
      ]
    )
    return parseStringify(patients.documents[0])
  } catch (error) {
    console.error('An error occurred while getting user information:', error);
  }
}