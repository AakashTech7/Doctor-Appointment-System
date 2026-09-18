import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarClock, Clock3, Pencil, Plus, Trash2, X } from "lucide-react";
import { api } from "../../api";
import { toast } from "react-toastify";
import "./DoctorOperations.css";

const ManageSlots = () => {
  const { register, handleSubmit, reset } = useForm();
  const { register: updateRegister, handleSubmit: submitUpdate, reset: resetUpdate } = useForm();
  const [slots, setSlots] = useState([]); const [editingSlot, setEditingSlot] = useState(null);
  const loadSlots = async () => { try { const { data } = await api.get("/slots/my-slots"); setSlots(data || []); } catch { setSlots([]); } };
  useEffect(() => { loadSlots(); }, []);
  const addSlot = async (data) => { try { await api.post("/slots", data); toast.success("Slot added successfully"); reset(); loadSlots(); } catch { toast.error("Cannot add a duplicate slot"); } };
  const deleteSlot = async (id) => { try { await api.delete(`/slots/${id}`); toast.success("Slot deleted"); loadSlots(); } catch { toast.error("Booked slots cannot be deleted"); } };
  const updateSlot = async (data) => { try { await api.put(`/slots/${editingSlot.slotId}`, data); toast.success("Slot updated successfully"); setEditingSlot(null); loadSlots(); } catch { toast.error("Booked slots cannot be updated"); } };
  const editSlot = (slot) => { setEditingSlot(slot); resetUpdate({ slotDate: slot.slotDate, startTime: slot.startTime, endTime: slot.endTime }); };
  return <main className="doctor-operations"><div className="doctor-operations__container">
    <header className="doctor-ops-heading"><div><p>Availability</p><h1>Manage appointment slots</h1><span>Create and manage the times patients can book with you.</span></div><div className="doctor-ops-heading__icon"><CalendarClock size={25} /></div></header>
    <section className="doctor-slot-form"><div className="doctor-panel-heading"><div><h2>Create a new slot</h2><p>Add a time window to your appointment calendar.</p></div><Plus size={20} /></div><form onSubmit={handleSubmit(addSlot)}><label>Date<input type="date" {...register("slotDate", { required: true })} /></label><label>Start time<input type="time" {...register("startTime", { required: true })} /></label><label>End time<input type="time" {...register("endTime", { required: true })} /></label><button><Plus size={17} /> Add slot</button></form></section>
    <section className="doctor-ops-panel"><div className="doctor-panel-heading"><div><h2>My availability</h2><p>{slots.length} appointment {slots.length === 1 ? "slot" : "slots"} in your calendar.</p></div></div>{slots.length ? <div className="doctor-slots-grid">{slots.map((slot) => <article key={slot.slotId} className="doctor-slot-card"><span className="doctor-slot-card__date">{slot.slotDate}</span><div><Clock3 size={17} /><strong>{slot.startTime} – {slot.endTime}</strong></div><span className={`doctor-slot-status doctor-slot-status--${String(slot.slotsStatus || "available").toLowerCase()}`}>{slot.slotsStatus}</span><footer><button onClick={() => editSlot(slot)} aria-label="Edit slot"><Pencil size={16} /></button><button className="doctor-delete-button" onClick={() => deleteSlot(slot.slotId)} aria-label="Delete slot"><Trash2 size={16} /></button></footer></article>)}</div> : <div className="doctor-ops-empty"><CalendarClock size={34} /><h3>No appointment slots yet</h3><p>Create a slot above to start accepting patient appointments.</p></div>}</section>
  </div>{editingSlot && <div className="doctor-ops-modal-backdrop" onMouseDown={() => setEditingSlot(null)}><form className="doctor-ops-modal" onSubmit={submitUpdate(updateSlot)} onMouseDown={(event) => event.stopPropagation()}><header><div><p>Edit availability</p><h2>Update appointment slot</h2></div><button type="button" onClick={() => setEditingSlot(null)}><X size={20} /></button></header><div><label>Date<input type="date" {...updateRegister("slotDate", { required: true })} /></label><label>Start time<input type="time" {...updateRegister("startTime", { required: true })} /></label><label>End time<input type="time" {...updateRegister("endTime", { required: true })} /></label></div><footer><button type="button" onClick={() => setEditingSlot(null)}>Cancel</button><button type="submit">Save changes</button></footer></form></div>}</main>;
};
export default ManageSlots;
