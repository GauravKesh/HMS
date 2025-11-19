export default function AppointmentModal({ data, onClose }: any) {
  if (!data) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-2">Appointment Details</h3>
        <p><strong>Patient:</strong> {data.patient_id}</p>
        <p><strong>Doctor:</strong> {data.doctor_id || "Not assigned"}</p>
        <p><strong>Date:</strong> {data.appointment_date}</p>
        <p><strong>Time:</strong> {data.appointment_time}</p>

        <div className="mt-4">
          <button onClick={onClose} className="w-full py-2 rounded-lg bg-blue-600 text-white">Close</button>
        </div>
      </div>
    </div>
  );
}
