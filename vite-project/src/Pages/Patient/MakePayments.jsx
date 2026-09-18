import React, { useEffect, useState } from "react";
import { CreditCard, Hourglass, Loader2, Shield, User } from "lucide-react";
import { api } from "../../api";
import { toast } from "react-toastify";
import { loadRazorpay, razorpayConfig } from "../../config/razorpay";

const MakePayments = () => {
  const [pendingPaymentAppointments, setPendingPaymentAppointments] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const fetchPendingPaymentAppointments = async () => {
    try {
      const response = await api.get("/appointments/pending-payments");
      console.log(response.data);
      setPendingPaymentAppointments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (appointmentId) => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading. Please try again in a moment.");
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: true }));

      const response = await api.post(`/payment/create-payment-order/${appointmentId}`);
      console.log(response.data);

      const options = {
        ...razorpayConfig,
        amount: response.data.amount,
        currency: "INR",
        name: "CAREPOINT",
        description: "Appointment Payment",
        order_id: response.data.id,
        handler: async function (response) {
          try {
            const verifyPayment = await api.post(`/payment/verify-payment/${appointmentId}`, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyPayment.data === true) {
              fetchPendingPaymentAppointments();
              toast.success("Payment done successfully!");
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(error.response?.data?.error || "Failed to verify payment.");
          } finally {
            setLoadingStates((prev) => ({ ...prev, [appointmentId]: false }));
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingStates((prev) => ({ ...prev, [appointmentId]: false }));
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        setLoadingStates((prev) => ({ ...prev, [appointmentId]: false }));
        toast.error("Payment failed: " + response.error.description);
      });
      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  useEffect(() => {
    fetchPendingPaymentAppointments();
    loadRazorpay().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) console.error("Failed to load Razorpay script");
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {pendingPaymentAppointments.length > 0 ? (
          <>
            <header className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900">Payments</h2>
              <p className="mt-1 text-slate-500">
                View your pending consultation payments and complete your payments securely
              </p>
            </header>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                <div>
                  <h5 className="font-bold text-slate-800">Pending Consultation Payments</h5>
                  <p className="text-sm text-slate-500">
                    Payments are generated after the doctor completes the appointment
                  </p>
                </div>
                <CreditCard className="text-teal-700" size={28} />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-sm text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Doctor</th>
                      <th className="px-4 py-3 font-semibold">Appointment</th>
                      <th className="px-4 py-3 font-semibold">Specialization</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-center font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingPaymentAppointments.map((pa) => (
                      <tr key={pa.appointmentId}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-teal-700 text-white">
                              <User size={20} />
                            </span>
                            <span className="font-semibold text-slate-800">Dr. {pa.doctorName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-800">{pa.appointmentDate}</div>
                          <small className="text-slate-500">{pa.appointmentTime}</small>
                        </td>
                        <td className="px-4 py-4 text-slate-500">{pa.specialization}</td>
                        <td className="px-4 py-4 text-lg font-bold text-slate-800">₹{pa.consultationFee}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            {pa.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                            onClick={() => handlePayment(pa.appointmentId)}
                            disabled={loadingStates[pa.appointmentId] || !razorpayLoaded}
                          >
                            {loadingStates[pa.appointmentId] ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Processing...
                              </>
                            ) : !razorpayLoaded ? (
                              <>
                                <Hourglass size={16} />
                                Loading...
                              </>
                            ) : (
                              <>
                                <CreditCard size={16} />
                                Pay Now
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              <Shield size={14} className="mr-1 inline text-green-600" />
              Your payment is securely processed through Razorpay.
            </p>
          </>
        ) : (
          <div className="py-20 text-center text-lg text-slate-500">No Pending payment found!!!</div>
        )}
      </div>
    </main>
  );
};

export default MakePayments;
