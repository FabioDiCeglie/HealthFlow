'use server';

import { databases } from "@/lib/appwrite.config";
import { ID } from "node-appwrite";
import { parseStringify } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        // Create new appointment document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
        const newAppointment = await databases.createDocument(process.env.APPWRITE_DATABASE_ID as string, process.env.APPOINTMENT_COLLECTION_ID as string, ID.unique(), appointment)

        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    }
}