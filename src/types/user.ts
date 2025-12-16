export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlock:boolean
  
}


export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

export interface BookingCalendarProps {
  availableDates: string[];
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  slots: Slot[];
}
