export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  experience: number;
  image: string;
  hospital: string;
  availability: {
    [day: string]: {
      time: string;
      slots: { time: string; status: 'free' | 'booked' | 'full' }[];
    };
  };
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  queuePos?: number;
  estimatedWaitMinutes?: number;
}

export interface QueueItem {
  id: string;
  patientName: string;
  patientAge: number;
  timeSlot: string;
  symptoms: string;
  status: 'Waiting' | 'In-Progress' | 'Done';
  position: number;
  hospital?: string;
  doctorId?: string;
}

export type UserRole = 'patient' | 'doctor' | 'coordinator';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}
