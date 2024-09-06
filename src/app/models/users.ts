export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'pacijent' | 'doktor' | 'admin';
}