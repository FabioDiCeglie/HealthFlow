# 🏥 Patient Appointment System

This project is a patient appointment system built using **Next.js**, **Appwrite**, and **Twilio**. It enables patients to register, book appointments with doctors, and provides an admin dashboard where admins can manage appointments (schedule or cancel). SMS notifications are sent to users when appointments are scheduled or canceled using **Twilio API**.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Architecture Overview](#architecture-overview)
4. [Setup & Installation](#setup--installation)
5. [Environment Variables](#environment-variables)
6. [SMS Notifications](#sms-notifications)

## Features

- **Patient Registration**: Users can register as patients and manage their profiles.
- **Book Appointments**: Patients can schedule appointments with different doctors.
- **Admin Dashboard**: Admins have access to a dashboard to view, schedule, or cancel appointments.
- **SMS Notifications**: Appointment-related SMS notifications are sent to patients using Twilio API.
  
## Technologies Used

- **Frontend**: Next.js (React Framework)
- **Backend**: Next.js API Routes with Server Actions
- **Database**: Appwrite (Self-hosted backend server for managing authentication, databases, etc.)
- **SMS API**: Twilio API for sending SMS notifications
- **Authentication**: Simple admin authentication is implemented via an environment variable-based check for admin access

## Architecture Overview

### Patient Flow
1. **Registration**: Patients register using the **Next.js** frontend, with backend logic handled via **Appwrite**.
2. **Login**: Users log in through Appwrite's authentication.
3. **Appointment Booking**: After login, patients can view available doctors and book appointments. Booked appointments are stored in the Appwrite database.
4. **Appointment Notifications**: Upon scheduling or cancellation, SMS notifications are sent to the patient via **Twilio API**.

### Admin Flow
1. **Dashboard Access**: Admins access the dashboard by providing a predefined OTP via an environment variable check.
2. **Appointment Management**: Admins can view, schedule, or cancel appointments. These actions are stored in the Appwrite database, and SMS notifications are triggered.

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- Appwrite instance setup
- Twilio Account (for SMS notifications)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/FabioDiCeglie/HealthFlow.git
   cd HealthFlow
   ```

2. Install dependencies using Yarn:
   ```bash
   yarn install
   ```

3. Configure the environment variables (see next section).

4. Start the development server:
   ```bash
   yarn dev
   ```

5. Ensure Appwrite is running (self-hosted or on Appwrite Cloud) and that you've created a database and set up Twilio.

## Environment Variables

Create a `.env.local` file in the root of the project and configure the following environment variables: refer to the `.env.local.example` file for proper setup.

## SMS Notifications

**Twilio API** is used to send SMS notifications to patients in the following scenarios:
1. When an appointment is scheduled.
2. When an appointment is canceled.

Notifications are triggered automatically after the admin performs an action on the dashboard.
