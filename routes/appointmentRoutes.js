// e:\Interesting Work\Prescripto\backend/routes/appointmentRoutes.js
import express from 'express';
import appointmentModel from '../models/appointmentModel.js';
import findAvailableSlots from '../controllers/appointmentController.js';
import sendNotification from '../utils/notification.js';

const router = express.Router();

router.post('/reschedule/:id', async (req, res) => {
    const { newDate, newTime } = req.body;
    const appointmentId = req.params.id;

    try {
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment || appointment.missed === false) {
            return res.status(400).json({ message: 'Appointment not found or not missed' });
        }

        const availableSlots = await findAvailableSlots(appointment.docId, newDate);
        if (!availableSlots.includes(newTime)) {
            return res.status(400).json({ message: 'Selected time is not available' });
        }

        appointment.rescheduled = true;
        appointment.rescheduleDate = newDate;
        appointment.rescheduleTime = newTime;
        await appointment.save();

        // Notify patient about the new appointment
        await sendNotification(appointment.userData.email, 'Appointment Rescheduled', `Your appointment has been rescheduled to ${newDate} at ${newTime}.`);

        res.status(200).json({ message: 'Appointment rescheduled successfully' });
    } catch (error) {
        console.error('Error rescheduling appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;