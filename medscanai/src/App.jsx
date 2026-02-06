import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import CreateAdmin from "./pages/Admin/CreateAdmin";
import AdminPanel from "./pages/Admin/AdminPanel";
import AddDoctor from "./pages/Admin/AddDoctor";
import Doctors from "./pages/Admin/Doctors";
import CompleteProfile from "./pages/Patient/CompleteProfile";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import MedicalProfile from "./pages/Patient/MedicalProfile";
import Appointments from "./pages/Patient/Appointments";
import BookAppointment from "./pages/Patient/BookAppointment";
import AIAssistant from "./pages/Patient/AIAssistant";
import UpdateProfile from "./pages/Patient/UpdateProfile";
import BookAppointmentAdmin from "./pages/Admin/BookAppointmentAdmin";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/create-admin" element={<CreateAdmin />} />
        <Route path="/admin/add-doctor" element={<AddDoctor />} />
        <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/admin/book-appointment"
          element={<BookAppointmentAdmin />}
        />
        <Route path="/patient/complete-profile" element={<CompleteProfile />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/medical-profile" element={<MedicalProfile />} />
        <Route path="/patient/appointments" element={<Appointments />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/ai" element={<AIAssistant />} />
        <Route path="/patient/update-profile" element={<UpdateProfile />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/ai" element={<AIAssistant />} />
      </Routes>
    </main>
  );
}

export default App;
