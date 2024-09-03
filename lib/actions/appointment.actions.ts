'use server';

import { databases } from "@/lib/appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        // Create new appointment document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
        const newAppointment = await databases.createDocument(process.env.APPWRITE_DATABASE_ID as string, process.env.APPOINTMENT_COLLECTION_ID as string, ID.unique(), appointment)

        return parseStringify(newAppointment);
    } catch (error) {
        console.log('An error occurred while creating a new appointment:', error);
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID as string,
            process.env.APPOINTMENT_COLLECTION_ID as string,
            appointmentId
        )
        return parseStringify(appointment)
    } catch (error) {
        console.error('An error occurred while getting appointment information:', error);
    }
}