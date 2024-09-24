import { Appointment } from "./appointment";
import { User } from "./users";

export interface Reservation {
    reservationId: number;
    userId: number;
    appointmentId: number;
    reservationDate: Date;
    status: string;
    description: string;
    age: number;
    phoneNumber: string;
    user: User;
    appointment: Appointment;
  }
  