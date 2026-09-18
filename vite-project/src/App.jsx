import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Common/Layout";
import Login from "./Pages/Auth/Login";
import Registration from "./Pages/Auth/Registration";
import AuthLayout from "./Layouts/AuthLayout";
import PatientProfile from "./Pages/Patient/PatientProfile";
import { ToastContainer } from "react-toastify";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
import Home from "./Components/Home";
import PatientDashboard from "./Pages/Patient/PatientDashboard";
import DoctorDashboard from "./Pages/Doctor/DoctorDashboard";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import DoctorList from "./Pages/Doctor/DoctorList";
import BookAppointment from "./Pages/Patient/BookAppointment";
import MyAllAppointments from "./Pages/Patient/MyAllAppointments";
import DoctorAllAppointments from "./Pages/Doctor/DoctorAllAppointments";
import { LoginProvider } from "./Context/LoginContext";
import UpdateDoctor from "./Pages/Doctor/UpdateDoctor";
import ManageSlots from "./Pages/Doctor/ManageSlots";
import TodaySchedule from "./Pages/Doctor/TodaySchedule";
import AppointmentHistory from "./Pages/Doctor/AppointmentHistory";
import RejectedAppointment from "./Pages/Doctor/RejectedAppointments";
import UpdatePatientProfile from "./Pages/Patient/UpdatePatientProfile";
import WriteMedicalReport from "./Pages/Doctor/WriteMedicalReport";
import DistinctPatientCards from "./Pages/Doctor/DistinctPatientCards";
import ViewMedicalRecord from "./Pages/Patient/ViewMedicalRecord";
import Approval from "./Pages/Admin/ManageDoctors";
import PatientMedicalHistory from "./Pages/Doctor/PatientMedicalHistory";
import ManageDoctors from "./Pages/Admin/ManageDoctors";
import ManagePatients from "./Pages/Admin/ManagePatients";
import MonitorAppointments from "./Pages/Admin/MonitorAppointments";
import MakePayments from "./Pages/Patient/MakePayments";
import ViewPaymentStatus from "./Pages/Doctor/ViewPaymentStatus";
import ViewAllPaymentStatus from "./Pages/Admin/ViewAllPaymentStatus";
import PatientLayout from "./Components/UI/PatientLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/patient-profile/:userId",
        element: <PatientProfile />,
      },
      {
        path: "/doctor-profile/:userId",
        element: <DoctorProfile />,
      },
      {
        path: "/doctor-dashboard",
        element: <DoctorDashboard />,
      },
      {
        path: "/admin-dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/patient/doctors",
        element: <DoctorList />,
      },
      {
        path: "/patient/book-appointment/:docId",
        element: <BookAppointment />,
      },
      {
        path: "/doctor/my-appointments",
        element: <DoctorAllAppointments />,
      },
      {
        path: "/doctor/update-profile",
        element: <UpdateDoctor />,
      },
      {
        path: "/doctor/manage-slots",
        element: <ManageSlots />,
      },
      {
        path: "/doctor/today's-schedule",
        element: <TodaySchedule />,
      },
      {
        path: "/appointment-history",
        element: <AppointmentHistory />,
      },
      {
        path: "/rejected-appointment",
        element: <RejectedAppointment />,
      },
      {
        path: "/write-medical-report/:appointmentId",
        element: <WriteMedicalReport />,
      },
      {
        path: "/doctor/medical-records-of-distinct-patinet",
        element: <DistinctPatientCards />,
      },
      {
        path: "/admin/manage-doctors",
        element: <ManageDoctors />,
      },
      {
        path: "/all-medical-records/:patientId",
        element: <PatientMedicalHistory />,
      },
      {
        path: "/admin/manage-patients",
        element: <ManagePatients />,
      },
      {
        path: "/admin/monitor-appointments",
        element: <MonitorAppointments />,
      },
      {
        path: "/doctor/patient-payment-status",
        element: <ViewPaymentStatus />,
      },
      {
        path: "/admin/all-payment-status",
        element: <ViewAllPaymentStatus />,
      },
    ],
  },
  {
    element: <PatientLayout />,
    children: [
      {
        path: "/patient-dashboard",
        element: <PatientDashboard />,
      },
      {
        path: "/patient/my-appointments",
        element: <MyAllAppointments />,
      },
      {
        path: "/patient/update-profile",
        element: <UpdatePatientProfile />,
      },
      {
        path: "/view-medical-report",
        element: <ViewMedicalRecord />,
      },
      {
        path: "/patient/make-payment/:patientId",
        element: <MakePayments />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <LoginProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
      </LoginProvider>
    </>
  );
}

export default App;
