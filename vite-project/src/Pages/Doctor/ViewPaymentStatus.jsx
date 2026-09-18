import React, { useContext, useEffect, useState } from "react";
import { api } from "../../api";
import { LoginContext } from "../../Context/LoginContext";
import { toast } from "react-toastify";
import { razorpayConfig, loadRazorpay } from "../../config/razorpay";
import { CheckCircle2, Clock3, CreditCard, IndianRupee, Search, UsersRound } from "lucide-react";
import "./DoctorClinicalRecords.css";

const ViewPaymentStatus = () => {
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [search, setSearch] = useState("");

  const { user } = useContext(LoginContext);

  const fetchAppointmentHistory = async () => {
    try {
      const response = await api.get("/appointments/appointment-history");

      console.log(response.data);

      setAppointmentHistory(response.data);
    } catch (error) {}
  };

  const handlePayment = async (appointment) => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading. Please try again in a moment.");
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, [appointment.appointmentId]: true }));

      console.log("Creating payment order for appointment:", appointment.appointmentId);

      try {
        const orderResponse = await api.post(`/payment/create-payment-order/${appointment.appointmentId}`);
        const orderData = orderResponse.data;
        console.log("Payment order created successfully:", orderData);
        initiatePayment(appointment, orderData);
      } catch (orderError) {
        console.error("Order creation failed:", orderError);
        toast.error(
          orderError.response?.data?.error ||
            "Could not create a payment order. Please try again.",
        );
        setLoadingStates(prev => ({ ...prev, [appointment.appointmentId]: false }));
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(`Payment failed: ${error.message}`);
      setLoadingStates(prev => ({ ...prev, [appointment.appointmentId]: false }));
    }
  };

  const initiatePayment = (appointment, orderData) => {
    const options = {
      ...razorpayConfig,
      amount: orderData.amount,
      order_id: orderData.id,
      description: `Payment for appointment with ${appointment.patientName}`,
      handler: function (response) {
        // Payment successful - verify with backend
        handlePaymentSuccess(response, appointment.appointmentId, response.razorpay_order_id);
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: "", // Add phone number if available
      },
      notes: {
        appointmentId: appointment.appointmentId,
        patientName: appointment.patientName,
      },
      modal: {
        ondismiss: function () {
          setLoadingStates(prev => ({ ...prev, [appointment.appointmentId]: false }));
          toast.info("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      setLoadingStates(prev => ({ ...prev, [appointment.appointmentId]: false }));
      toast.error("Payment failed: " + response.error.description);
    });
    rzp.open();
  };

  const handlePaymentSuccess = async (response, appointmentId, razorpayOrderId) => {
    try {
      // Verify payment with backend
      const verifyResponse = await api.post(`/payment/verify-payment/${appointmentId}`, {
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });

      if (verifyResponse.data) {
        toast.success("Payment successful!");
        fetchAppointmentHistory(); // Refresh the list
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      toast.error("Failed to verify payment");
      console.error("Payment verification error:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  useEffect(() => {
    fetchAppointmentHistory();

    // Load Razorpay script
    loadRazorpay().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error("Failed to load Razorpay script");
      }
    });
  }, []);

  const visibleAppointments = appointmentHistory.filter((appointment) =>
    appointment.patientName?.toLowerCase().includes(search.toLowerCase()),
  );
  const paidAppointments = appointmentHistory.filter((appointment) => appointment.paymentStatus === "Paid");
  const collectedAmount = paidAppointments.reduce((total, appointment) => total + Number(appointment.consultationFee || 0), 0);

  return (
    <main className="doctor-payment-page">
      <div className="doctor-payment-page__container">
      {/* Heading */}
      <header className="doctor-payment-header"><div><p>Practice finance</p><h1>Patient payment status</h1><span>Review completed consultation payments and outstanding balances.</span></div><div><CreditCard size={25} /></div></header>

      {/* Payment Table */}
      {appointmentHistory.length > 0 ? (
        <>
          <section className="doctor-payment-summary"><article><span><CheckCircle2 size={20} /></span><div><p>Paid consultations</p><strong>{paidAppointments.length}</strong><small>Payments completed</small></div></article><article><span className="doctor-payment-summary__pending"><Clock3 size={20} /></span><div><p>Outstanding payments</p><strong>{appointmentHistory.length - paidAppointments.length}</strong><small>Awaiting payment</small></div></article><article><span className="doctor-payment-summary__amount"><IndianRupee size={20} /></span><div><p>Collected amount</p><strong>₹{collectedAmount.toLocaleString("en-IN")}</strong><small>Successful transactions</small></div></article></section>
          <label className="doctor-payment-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient by name" /><span><UsersRound size={16} /> {visibleAppointments.length} patients</span></label>

          <>
            {/* Payment Table */}
            <div className="card border-0 shadow-sm rounded-4 doctor-payment-table" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ marginBottom: '0' }}>
                    <thead
                      style={{
                        backgroundColor: "#f1f5f9",
                      }}
                    >
                      <tr>
                        <th className="px-4 py-3" style={{ color: '#1e293b' }}>Patient</th>
                        <th style={{ color: '#1e293b' }}>Appointment Date</th>
                        <th style={{ color: '#1e293b' }}>Appointment Time</th>
                        <th style={{ color: '#1e293b' }}>Amount</th>
                        <th style={{ color: '#1e293b' }}>Payment Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleAppointments.map((a) => {
                        return (
                          <tr key={a.appointmentId}>
                            {/* Patient */}
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    backgroundColor: "#2563eb",
                                  }}
                                >
                                  <i
                                    className="bi bi-person-fill text-white"
                                    style={{
                                      fontSize: "20px",
                                    }}
                                  ></i>
                                </div>

                                <div>
                                  <h6 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                    {a.patientName}
                                  </h6>
                                  <small className="text-muted">
                                    Patient ID: {a.patientId}
                                  </small>
                                </div>
                              </div>
                            </td>

                            {/* Appointment Date */}
                            <td>{a.appointmentDate}</td>

                            {/* Appointment Time */}
                            <td>{a.appointmentTime}</td>

                            {/* Amount */}
                            <td className="fw-semibold" style={{ color: '#1e293b', fontSize: '1.1rem' }}>
                              ₹ {a.consultationFee}
                            </td>

                            {/* Payment Status */}
                            <td>
                              {a.paymentStatus === "Paid" ? (
                                <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#10b981', color: 'white' }}>
                                  <i className="bi bi-check-circle-fill me-1"></i>
                                  Paid
                                </span>
                              ) : (
                                <div className="d-flex align-items-center gap-2">
                                  <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#f59e0b', color: 'white' }}>
                                    <i className="bi bi-clock-fill me-1"></i>
                                    Pending
                                  </span>
                                  <button
                                    className="btn btn-sm rounded-pill px-3"
                                    style={{
                                      backgroundColor: '#2563eb',
                                      color: 'white',
                                      border: 'none',
                                      transition: 'transform 0.2s ease'
                                    }}
                                    onClick={() => handlePayment(a)}
                                    disabled={loadingStates[a.appointmentId] || !razorpayLoaded}
                                  >
                                    {loadingStates[a.appointmentId] ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                        Processing...
                                      </>
                                    ) : !razorpayLoaded ? (
                                      <>
                                        <i className="bi bi-hourglass-split me-1"></i>
                                        Loading...
                                      </>
                                    ) : (
                                      <>
                                        <i className="bi bi-credit-card me-1"></i>
                                        Pay Now
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        </>
      ) : (
        <div className="text-center text-muted py-5">
          No Pending Payments Found!!!
        </div>
      )}
      </div>
    </main>
  );
};

export default ViewPaymentStatus;
