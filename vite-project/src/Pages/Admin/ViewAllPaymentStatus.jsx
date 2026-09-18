import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleDollarSign, Clock3, CreditCard, Search, Stethoscope, UsersRound } from "lucide-react";
import { api } from "../../api";
import "./AdminOperations.css";
import "./AdminPayments.css";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const ViewAllPaymentStatus = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => { api.get("/appointments/completed-status").then(({ data }) => setPayments(data || [])).catch(() => setPayments([])); }, []);
  const visiblePayments = useMemo(() => payments.filter((payment) => `${payment.patientName || ""} ${payment.doctorName || ""}`.toLowerCase().includes(search.toLowerCase()) && (!status || payment.paymentStatus === status)), [payments, search, status]);
  const paidPayments = payments.filter((payment) => payment.paymentStatus === "Paid");
  const paidAmount = paidPayments.reduce((total, payment) => total + Number(payment.consultationFee || 0), 0);
  return <main className="admin-operations"><div className="admin-operations__container">
    <header className="admin-page-heading"><div><p>Financial overview</p><h1>All payments</h1><span>View all payments made by patients for their doctor appointments.</span></div><div className="admin-heading-icon admin-heading-icon--purple"><CreditCard size={25} /></div></header>
    <section className="admin-payment-summary"><article><span className="admin-summary-icon admin-summary-icon--green"><CheckCircle2 size={20} /></span><div><p>Paid payments</p><strong>{paidPayments.length}</strong><small>Successfully completed</small></div></article><article><span className="admin-summary-icon admin-summary-icon--amber"><Clock3 size={20} /></span><div><p>Pending payments</p><strong>{payments.length - paidPayments.length}</strong><small>Awaiting payment</small></div></article><article><span className="admin-summary-icon admin-summary-icon--purple"><CircleDollarSign size={20} /></span><div><p>Collected amount</p><strong>₹{paidAmount.toLocaleString("en-IN")}</strong><small>From completed payments</small></div></article></section>
    <section className="admin-toolbar admin-toolbar--filters"><label className="admin-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient or doctor" /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All payment statuses</option><option value="Paid">Paid</option><option value="Pending">Pending</option></select></section>
    <section className="admin-table-card"><div className="admin-table-card__header"><div><h2>Payment transactions</h2><p>{visiblePayments.length} of {payments.length} records shown</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Patient</th><th>Doctor</th><th>Appointment</th><th>Amount</th><th>Payment status</th></tr></thead><tbody>{visiblePayments.map((payment) => <tr key={payment.appointmentId}><td><div className="admin-person admin-person--compact"><span><UsersRound size={17} /></span><div><strong>{payment.patientName}</strong><small>ID · {payment.patientId}</small></div></div></td><td><div className="admin-person admin-person--compact"><span><Stethoscope size={17} /></span><div><strong>Dr. {payment.doctorName}</strong><small>{payment.specialization || "Specialist"}</small></div></div></td><td><strong>{formatDate(payment.appointmentDate)}</strong><small>{payment.appointmentTime || "Time not set"}</small></td><td><strong className="admin-amount">₹{Number(payment.consultationFee || 0).toLocaleString("en-IN")}</strong></td><td><span className={payment.paymentStatus === "Paid" ? "admin-status admin-status--completed" : "admin-status admin-status--pending"}>{payment.paymentStatus || "Pending"}</span></td></tr>)}</tbody></table></div>{!visiblePayments.length && <div className="admin-empty"><CreditCard size={32} /><h3>No payment records found</h3><p>Try changing the search or payment-status filter.</p></div>}</section>
  </div></main>;
};
export default ViewAllPaymentStatus;
