import { parseStringify } from "../utils";

export const createUser = async ({ email, phone, name }: CreateUserParams) => {
  try {
    const response = await fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, phone, name }),
    });

    if (response.ok) {
      const data = await response.json();
      return parseStringify(data)
    } else {
      console.error('Failed to create user:', await response.json());
    }
  } catch (error) {
    console.error('An error occurred while creating a new user:', error);
  }
};