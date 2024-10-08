'use server';

import { databases, messaging } from "@/lib/appwrite.config";
import { ID, Query } from "node-appwrite";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

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

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID as string,
            process.env.APPOINTMENT_COLLECTION_ID as string,
            [Query.orderDesc("$createdAt")]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };

        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case "scheduled":
                        acc.scheduledCount++;
                        break;
                    case "pending":
                        acc.pendingCount++;
                        break;
                    case "cancelled":
                        acc.cancelledCount++;
                        break;
                }
                return acc;
            },
            initialCounts
        );

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        };

        return parseStringify(data);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the recent appointments:",
            error
        );
    }
};

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID as string,
            process.env.APPOINTMENT_COLLECTION_ID as string,
            appointmentId,
            appointment
        )

        if (!updatedAppointment) {
            throw new Error('Appointment not found!')
        }

        const smsMessage = `Hi, it's HealthFlow. ${type === 'schedule' ? `Your appointment has been schdeuled for ${formatDateTime(appointment.schedule).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform you that your appointment has been cancelled, for the following reason: ${appointment.cancellationReason}`} `

        await sendSemsNotification(userId, smsMessage)

        revalidatePath('/admin')
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.log('An error occurred while updating an appointment:', error);
    }
}

export const sendSemsNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        );

        return parseStringify(message)
    } catch (error) {
        console.error('An error occurred while sending a message:', error)
    }

    return '';
}