export interface Appointment{
    appointmentId : number;
    ordinationID: number;
    date: Date;
    startTime: string;
    endTime: string;
    available: boolean;
}       