// e:\Interesting Work\Prescripto\backend/middlewares/missedAppointment.js
import appointmentModel from '../models/appointmentModel.js';

const detectMissedAppointments = async (req, res, next) => {
    const currentTime = new Date();
    const appointments = await appointmentModel.find({ 
        date: { $lte: currentTime.getTime() }, 
        cancelled: false, 
        isCompleted: false 
    });

    appointments.forEach(async (appointment) => {
        const appointmentTime = new Date(`${appointment.slotDate} ${appointment.slotTime}`);
        const gracePeriod = new Date(appointmentTime.getTime() + 15 * 60000); // 15 minutes grace period

        if (currentTime > gracePeriod) {
            await appointmentModel.findByIdAndUpdate(appointment._id, { missed: true });
            // Notify patient about missed appointment (implement notification logic here)
        }
    });

    next();
};

export default detectMissedAppointments;