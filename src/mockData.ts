import { Doctor, QueueItem, Appointment } from './types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Pediatrics',
    rating: 4.9,
    reviewsCount: 142,
    experience: 12,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    hospital: 'QueueCare General Hospital',
    availability: {
      'Monday': {
        time: '09:00 AM - 01:00 PM',
        slots: [
          { time: '09:00 AM', status: 'booked' },
          { time: '09:30 AM', status: 'free' },
          { time: '10:00 AM', status: 'full' },
          { time: '10:30 AM', status: 'free' },
          { time: '11:00 AM', status: 'booked' },
          { time: '11:30 AM', status: 'free' },
          { time: '12:00 PM', status: 'free' },
          { time: '12:30 PM', status: 'free' }
        ]
      },
      'Tuesday': {
        time: '02:00 PM - 06:00 PM',
        slots: [
          { time: '02:00 PM', status: 'free' },
          { time: '02:30 PM', status: 'free' },
          { time: '03:00 PM', status: 'booked' },
          { time: '03:30 PM', status: 'free' },
          { time: '04:00 PM', status: 'full' },
          { time: '04:30 PM', status: 'free' },
          { time: '05:00 PM', status: 'free' },
          { time: '05:30 PM', status: 'booked' }
        ]
      },
      'Wednesday': {
        time: '09:00 AM - 01:00 PM',
        slots: [
          { time: '09:00 AM', status: 'free' },
          { time: '09:30 AM', status: 'booked' },
          { time: '10:00 AM', status: 'free' },
          { time: '10:30 AM', status: 'free' },
          { time: '11:00 AM', status: 'free' },
          { time: '11:30 AM', status: 'full' },
          { time: '12:00 PM', status: 'free' },
          { time: '12:30 PM', status: 'free' }
        ]
      },
      'Thursday': {
        time: '02:00 PM - 06:00 PM',
        slots: [
          { time: '02:00 PM', status: 'booked' },
          { time: '02:30 PM', status: 'booked' },
          { time: '03:00 PM', status: 'free' },
          { time: '03:30 PM', status: 'free' },
          { time: '04:00 PM', status: 'free' },
          { time: '04:30 PM', status: 'free' },
          { time: '05:00 PM', status: 'booked' },
          { time: '05:30 PM', status: 'free' }
        ]
      },
      'Friday': {
        time: '09:00 AM - 01:00 PM',
        slots: [
          { time: '09:00 AM', status: 'free' },
          { time: '09:30 AM', status: 'free' },
          { time: '10:00 AM', status: 'free' },
          { time: '10:30 AM', status: 'booked' },
          { time: '11:00 AM', status: 'free' },
          { time: '11:30 AM', status: 'free' },
          { time: '12:00 PM', status: 'full' },
          { time: '12:30 PM', status: 'free' }
        ]
      }
    }
  },
  {
    id: 'doc-2',
    name: 'Dr. James Carter',
    specialty: 'Cardiology',
    rating: 4.8,
    reviewsCount: 98,
    experience: 18,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    hospital: 'Heart & Vascular Center',
    availability: {
      'Monday': {
        time: '01:00 PM - 05:00 PM',
        slots: [
          { time: '01:00 PM', status: 'booked' },
          { time: '01:30 PM', status: 'full' },
          { time: '02:00 PM', status: 'free' },
          { time: '02:30 PM', status: 'free' },
          { time: '03:00 PM', status: 'booked' },
          { time: '03:30 PM', status: 'free' },
          { time: '04:00 PM', status: 'free' },
          { time: '04:30 PM', status: 'booked' }
        ]
      },
      'Tuesday': {
        time: '09:00 AM - 01:00 PM',
        slots: [
          { time: '09:00 AM', status: 'free' },
          { time: '09:30 AM', status: 'free' },
          { time: '10:00 AM', status: 'booked' },
          { time: '10:30 AM', status: 'free' },
          { time: '11:00 AM', status: 'free' },
          { time: '11:30 AM', status: 'booked' },
          { time: '12:00 PM', status: 'full' },
          { time: '12:30 PM', status: 'free' }
        ]
      },
      'Wednesday': {
        time: '01:00 PM - 05:00 PM',
        slots: [
          { time: '01:00 PM', status: 'free' },
          { time: '01:30 PM', status: 'free' },
          { time: '02:00 PM', status: 'booked' },
          { time: '02:30 PM', status: 'booked' },
          { time: '03:00 PM', status: 'free' },
          { time: '03:30 PM', status: 'free' },
          { time: '04:00 PM', status: 'free' },
          { time: '04:30 PM', status: 'free' }
        ]
      },
      'Thursday': {
        time: '09:00 AM - 01:00 PM',
        slots: [
          { time: '09:00 AM', status: 'full' },
          { time: '09:30 AM', status: 'free' },
          { time: '10:00 AM', status: 'booked' },
          { time: '10:30 AM', status: 'free' },
          { time: '11:00 AM', status: 'free' },
          { time: '11:30 AM', status: 'free' },
          { time: '12:00 PM', status: 'booked' },
          { time: '12:30 PM', status: 'free' }
        ]
      }
    }
  },
  {
    id: 'doc-3',
    name: 'Dr. Emily Vance',
    specialty: 'Dermatology',
    rating: 4.7,
    reviewsCount: 115,
    experience: 8,
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300',
    hospital: 'Skincare Experts Clinic',
    availability: {
      'Tuesday': {
        time: '10:00 AM - 02:00 PM',
        slots: [
          { time: '10:00 AM', status: 'free' },
          { time: '10:30 AM', status: 'full' },
          { time: '11:00 AM', status: 'booked' },
          { time: '11:30 AM', status: 'free' },
          { time: '12:00 PM', status: 'free' },
          { time: '12:30 PM', status: 'free' },
          { time: '01:00 PM', status: 'booked' },
          { time: '01:30 PM', status: 'free' }
        ]
      },
      'Wednesday': {
        time: '02:00 PM - 06:00 PM',
        slots: [
          { time: '02:00 PM', status: 'booked' },
          { time: '02:30 PM', status: 'free' },
          { time: '03:00 PM', status: 'free' },
          { time: '03:30 PM', status: 'booked' },
          { time: '04:00 PM', status: 'full' },
          { time: '04:30 PM', status: 'free' },
          { time: '05:00 PM', status: 'free' },
          { time: '05:30 PM', status: 'free' }
        ]
      },
      'Thursday': {
        time: '10:00 AM - 02:00 PM',
        slots: [
          { time: '10:00 AM', status: 'free' },
          { time: '10:30 AM', status: 'free' },
          { time: '11:00 AM', status: 'free' },
          { time: '11:30 AM', status: 'booked' },
          { time: '12:00 PM', status: 'free' },
          { time: '12:30 PM', status: 'free' },
          { time: '01:00 PM', status: 'full' },
          { time: '01:30 PM', status: 'free' }
        ]
      }
    }
  },
  {
    id: 'doc-4',
    name: 'Dr. Robert Chen',
    specialty: 'General Medicine',
    rating: 4.9,
    reviewsCount: 210,
    experience: 22,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    hospital: 'QueueCare General Hospital',
    availability: {
      'Monday': {
        time: '08:00 AM - 12:00 PM',
        slots: [
          { time: '08:00 AM', status: 'booked' },
          { time: '08:30 AM', status: 'free' },
          { time: '09:00 AM', status: 'full' },
          { time: '09:30 AM', status: 'free' },
          { time: '10:00 AM', status: 'free' },
          { time: '10:30 AM', status: 'free' },
          { time: '11:00 AM', status: 'booked' },
          { time: '11:30 AM', status: 'free' }
        ]
      },
      'Wednesday': {
        time: '08:00 AM - 12:00 PM',
        slots: [
          { time: '08:00 AM', status: 'free' },
          { time: '08:30 AM', status: 'booked' },
          { time: '09:00 AM', status: 'free' },
          { time: '09:30 AM', status: 'free' },
          { time: '10:00 AM', status: 'booked' },
          { time: '10:30 AM', status: 'free' },
          { time: '11:00 AM', status: 'free' },
          { time: '11:30 AM', status: 'free' }
        ]
      },
      'Friday': {
        time: '02:00 PM - 06:00 PM',
        slots: [
          { time: '02:00 PM', status: 'booked' },
          { time: '02:30 PM', status: 'free' },
          { time: '03:00 PM', status: 'booked' },
          { time: '03:30 PM', status: 'free' },
          { time: '04:00 PM', status: 'free' },
          { time: '04:30 PM', status: 'full' },
          { time: '05:00 PM', status: 'free' },
          { time: '05:30 PM', status: 'free' }
        ]
      }
    }
  },
  {
    id: 'doc-5',
    name: 'Dr. Michael Chang',
    specialty: 'Orthopedics',
    rating: 4.6,
    reviewsCount: 84,
    experience: 14,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
    hospital: 'Joint & Spine Specialty Clinic',
    availability: {
      'Monday': {
        time: '03:00 PM - 07:00 PM',
        slots: [
          { time: '03:00 PM', status: 'free' },
          { time: '03:30 PM', status: 'booked' },
          { time: '04:00 PM', status: 'free' },
          { time: '04:30 PM', status: 'free' },
          { time: '05:00 PM', status: 'full' },
          { time: '05:30 PM', status: 'free' },
          { time: '06:00 PM', status: 'booked' },
          { time: '06:30 PM', status: 'free' }
        ]
      },
      'Thursday': {
        time: '09:00 AM - 01:00 PM',
        slots: [
          { time: '09:00 AM', status: 'free' },
          { time: '09:30 AM', status: 'free' },
          { time: '10:00 AM', status: 'booked' },
          { time: '10:30 AM', status: 'free' },
          { time: '11:00 AM', status: 'booked' },
          { time: '11:30 AM', status: 'free' },
          { time: '12:00 PM', status: 'free' },
          { time: '12:30 PM', status: 'free' }
        ]
      }
    }
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    doctorId: 'doc-4',
    doctorName: 'Dr. Robert Chen',
    doctorSpecialty: 'General Medicine',
    doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    date: 'Today',
    time: '10:30 AM',
    status: 'Confirmed',
    queuePos: 3,
    estimatedWaitMinutes: 24
  },
  {
    id: 'appt-2',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Pediatrics',
    doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    date: '2026-06-20',
    time: '09:30 AM',
    status: 'Confirmed'
  },
  {
    id: 'appt-3',
    doctorId: 'doc-3',
    doctorName: 'Dr. Emily Vance',
    doctorSpecialty: 'Dermatology',
    doctorImage: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300',
    date: '2026-06-15',
    time: '02:30 PM',
    status: 'Completed'
  }
];

export const INITIAL_QUEUE: QueueItem[] = [
  {
    id: 'q-1',
    patientName: 'Emma Watson',
    patientAge: 27,
    timeSlot: '09:00 AM',
    symptoms: 'Mild respiratory irritation',
    status: 'Done',
    position: 0,
    doctorId: 'doc-4',
    hospital: 'QueueCare General Hospital'
  },
  {
    id: 'q-2',
    patientName: 'John Doe',
    patientAge: 35,
    timeSlot: '09:30 AM',
    symptoms: 'Severe headache and nausea',
    status: 'In-Progress',
    position: 0,
    doctorId: 'doc-4',
    hospital: 'QueueCare General Hospital'
  },
  {
    id: 'q-3',
    patientName: 'Swapnali Mandave (You)',
    patientAge: 22,
    timeSlot: '10:30 AM',
    symptoms: 'Annual check-up & throat irritation',
    status: 'Waiting',
    position: 3,
    doctorId: 'doc-4',
    hospital: 'QueueCare General Hospital'
  },
  {
    id: 'q-4',
    patientName: 'Arthur Pendragon',
    patientAge: 45,
    timeSlot: '11:00 AM',
    symptoms: 'Check-up on blood pressure therapy',
    status: 'Waiting',
    position: 4,
    doctorId: 'doc-2',
    hospital: 'Heart & Vascular Center'
  },
  {
    id: 'q-5',
    patientName: 'Diana Prince',
    patientAge: 30,
    timeSlot: '11:30 AM',
    symptoms: 'Sore shoulder and joint stiffness',
    status: 'Waiting',
    position: 5,
    doctorId: 'doc-2',
    hospital: 'Heart & Vascular Center'
  }
];

export const APP_FEATURES = [
  {
    title: 'Live Queue Tracking',
    description: 'Monitor your real-time slot and placement in queue directly from your phone. Zero guessing.',
    icon: 'Radio'
  },
  {
    title: 'AI Wait-Time Prediction',
    description: 'Get dynamic alerts calculated by medical routing algorithms adjusting for actual doctor speed.',
    icon: 'BrainCircuit'
  },
  {
    title: 'Easy Digital Booking',
    description: 'Browse doctors, search subspecialties, and confirm secure bookings in just three clicks.',
    icon: 'CalendarCheck2'
  },
  {
    title: 'SMS & Email Alerts',
    description: 'Receive reminders 15 minutes before your slot and live text signals when the doctor is ready.',
    icon: 'MessageSquareText'
  },
  {
    title: 'Interactive Schedules',
    description: 'Dynamic green/orange visual schedules for transparent clinical slot planning.',
    icon: 'CalendarDays'
  },
  {
    title: 'Patient Medical History',
    description: 'A beautifully formatted unified timeline storing past vitals, appointments, and summaries.',
    icon: 'UserRoundCheck'
  }
];

export const TESTIMONIALS = [
  {
    quote: "QueueCare single-handedly transformed my visits to Dr. Sarah. I used to sit in a stuffed waiting room for over an hour. Today I walked in exactly 3 minutes before my turn and went straight into the cabinet!",
    author: "Marcella Vance",
    role: "Mother of 2",
    rating: 5
  },
  {
    quote: "As a cardiologist, patient flow management is vital. With corporate-backed AI queues, we reduced no-shows by 40% and improved our clinical staff throughput by almost double over past seasons.",
    author: "Dr. James Carter",
    role: "MD, Chief Cardiologist",
    rating: 5
  },
  {
    quote: "Perfect system. The live progress ring keeps me updated so I can have coffee nearby instead of breathing dry waiting-room air.",
    author: "Tyler Sterling",
    role: "Corporate Executive",
    rating: 4.8
  }
];
