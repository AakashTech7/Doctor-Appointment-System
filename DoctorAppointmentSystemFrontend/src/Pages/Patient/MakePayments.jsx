import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Hourglass, IndianRupee, Loader2, Shield, User } from "lucide-react";
import { api } from "../../api";
import { toast } from "react-toastify";
import { loadRazorpay, razorpayConfig } from "../../config/razorpay";

const MakePayments = () => {
  const [paymentAppointments, setPaymentAppointments] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const pendingPayments = useMemo(() => paymentAppointments.filter((item) => item.paymentStatus !== "Paid"), [paymentAppointments]);
  const completedPayments = useMemo(() => paymentAppointments.filter((item) => item.paymentStatus === "Paid"), [paymentAppointments]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await api.get("/appointments/payment-history");
      setPaymentAppointments(response.data || []);
    } catch (error) {
      console.error("Unable to load payment history:", error);
      toast.error("Unable to load payment history. Please try again.");
    }
  };

  const handlePayment = async (appointmentId) => {
    if (!razorpayLoaded) return toast.error("Payment gateway is loading. Please try again in a moment.");
    try {
      setLoadingStates((previous) => ({ ...previous, [appointmentId]: true }));
      const orderResponse = await api.post(`/payment/create-payment-order/${appointmentId}`);
      const razorpay = new window.Razorpay({
        ...razorpayConfig, amount: orderResponse.data.amount, currency: "INR", name: "CAREPOINT",
        description: "Appointment Payment", order_id: orderResponse.data.id,
        handler: async (response) => {
          try {
            const verification = await api.post(`/payment/verify-payment/${appointmentId}`, {
              razorpayPaymentId: response.razorpay_payment_id, razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            if (verification.data === true) { await fetchPaymentHistory(); toast.success("Payment completed successfully!"); }
            else toast.error("Payment verification failed. Please contact support.");
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(error.response?.data?.error || "Failed to verify payment.");
          } finally { setLoadingStates((previous) => ({ ...previous, [appointmentId]: false })); }
        },
        modal: { ondismiss: () => { setLoadingStates((previous) => ({ ...previous, [appointmentId]: false })); toast.info("Payment cancelled"); } },
      });
      razorpay.on("payment.failed", (response) => {
        setLoadingStates((previous) => ({ ...previous, [appointmentId]: false }));
        toast.error(`Payment failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(error.response?.data?.error || "Something went wrong while starting the payment.");
      setLoadingStates((previous) => ({ ...previous, [appointmentId]: false }));
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
    loadRazorpay().then((loaded) => setRazorpayLoaded(loaded));
  }, []);

  const PaymentTable = ({ appointments, completed = false }) => (
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left">
      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>
        <th className="px-5 py-3 font-semibold">Doctor</th><th className="px-4 py-3 font-semibold">Appointment</th><th className="px-4 py-3 font-semibold">Specialization</th><th className="px-4 py-3 font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Payment status</th>{!completed && <th className="px-4 py-3 text-center font-semibold">Action</th>}
      </tr></thead>
      <tbody className="divide-y divide-slate-100">{appointments.map((appointment) => <tr key={appointment.appointmentId} className="hover:bg-slate-50/70">
        <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-teal-50 text-teal-700"><User size={19} /></span><span className="font-semibold text-slate-800">Dr. {appointment.doctorName}</span></div></td>
        <td className="px-4 py-4"><div className="font-medium text-slate-800">{appointment.appointmentDate}</div><small className="text-slate-500">{appointment.appointmentTime}</small></td>
        <td className="px-4 py-4 text-slate-600">{appointment.specialization || "General consultation"}</td>
        <td className="px-4 py-4 font-bold text-slate-800">₹{Number(appointment.consultationFee || 0).toLocaleString("en-IN")}</td>
        <td className="px-4 py-4"><span className={completed ? "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700" : "inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800"}>{completed ? <CheckCircle2 size={13} /> : <Hourglass size={13} />}{completed ? "Paid" : "Pending"}</span></td>
        {!completed && <td className="px-4 py-4 text-center"><button className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60" onClick={() => handlePayment(appointment.appointmentId)} disabled={loadingStates[appointment.appointmentId] || !razorpayLoaded}>{loadingStates[appointment.appointmentId] ? <><Loader2 size={16} className="animate-spin" />Processing...</> : !razorpayLoaded ? <><Hourglass size={16} />Loading...</> : <><CreditCard size={16} />Pay now</>}</button></td>}
      </tr>)}</tbody>
    </table></div>
  );

  return <main className="min-h-screen bg-slate-50 px-4 py-8"><div className="mx-auto max-w-6xl">
    <header className="mb-7 rounded-3xl bg-gradient-to-r from-teal-800 to-teal-600 px-6 py-7 text-white shadow-sm sm:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="mb-1 text-sm font-semibold uppercase tracking-wider text-teal-100">Payment centre</p><h1 className="text-3xl font-extrabold">Your payments</h1><p className="mt-2 text-teal-50">Review outstanding consultation fees and your completed payment history.</p></div><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15"><CreditCard size={28} /></span></div></header>
    <section className="mb-7 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-amber-100 bg-amber-50 p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-amber-800">Pending requests</span><Hourglass size={20} className="text-amber-600" /></div><p className="mt-2 text-3xl font-extrabold text-amber-950">{pendingPayments.length}</p><p className="mt-1 text-sm text-amber-800">Ready for secure payment</p></div><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-emerald-800">Completed payments</span><CheckCircle2 size={20} className="text-emerald-600" /></div><p className="mt-2 text-3xl font-extrabold text-emerald-950">{completedPayments.length}</p><p className="mt-1 text-sm text-emerald-800">₹{completedPayments.reduce((total, payment) => total + Number(payment.consultationFee || 0), 0).toLocaleString("en-IN")} paid in total</p></div></section>
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-800">Pending payment requests</h2><p className="mt-1 text-sm text-slate-500">Pay completed consultations when you are ready.</p></div><IndianRupee className="text-amber-600" size={24} /></div>{pendingPayments.length ? <PaymentTable appointments={pendingPayments} /> : <div className="px-5 py-10 text-center text-slate-500"><CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={30} />No pending payment requests.</div>}</section>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-800">Completed payments</h2><p className="mt-1 text-sm text-slate-500">Your successfully paid consultation records.</p></div><CheckCircle2 className="text-emerald-600" size={24} /></div>{completedPayments.length ? <PaymentTable appointments={completedPayments} completed /> : <div className="px-5 py-10 text-center text-slate-500">Completed payments will appear here.</div>}</section>
    <p className="mt-6 text-center text-sm text-slate-500"><Shield size={14} className="mr-1 inline text-emerald-600" />Your payment is securely processed through Razorpay.</p>
  </div></main>;
};

export default MakePayments;
