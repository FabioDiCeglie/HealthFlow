'use server';

import { users } from "@/lib/appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async ({ email, phone, name }: CreateUserParams) => {
  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, phone, name }),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 409) {
      return { message: 'This user already exist!' }
    } else {
      console.error('Failed to create user:', await response.json());
    }
  } catch (error) {
    console.error('An error occurred while creating a new user:', error);
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

  } catch (error) {
    console.log(error);
  }
}