import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';

const findAvailableSlots = async (docId, date) => {
    const doctor = await doctorModel.findById(docId);
    const bookedSlots = await appointmentModel.find({ docId, slotDate: date, cancelled: false });

    const availableSlots = []; // Populate this with available slots based on doctor's schedule

    // Logic to determine available slots based on doctor's schedule and booked slots
    // Example: Assuming doctor works from 9 AM to 5 PM with 30-minute slots
    for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const slotTime = `${hour}:${minute < 10 ? '0' + minute : minute}`;
            const isBooked = bookedSlots.some(slot => slot.slotTime === slotTime && slot.slotDate === date);
            if (!isBooked) {
                availableSlots.push(slotTime);
            }
        }
    }

    return availableSlots;
};

export default findAvailableSlots;