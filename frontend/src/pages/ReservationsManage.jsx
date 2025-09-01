import { useEffect, useRef, useState } from "react";
import api from "../api";

const serviceForHour = (hhmm) => {
  if (hhmm >= "12:00" && hhmm < "14:00") return "midi";
  if (hhmm >= "19:00" && hhmm < "21:00") return "soir";
  return null;
};
const limitsForService = (service) =>
  service === "midi" ? { min: "12:00", max: "14:00" } : { min: "19:00", max: "21:00" };

const emptyForm = {
  nom: "", prenom: "", email: "",
  jour: "", heure: "12:00:00",
  nb_personnes: 1, service: "midi",
};

export default function ReservationsManage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");
  const modalRef = useRef(null);

  const load = async () => {
    const { data } = await api.get("/api/reservations");
    setRows(data.data);
    setTotal(data.total);
  };
  useEffect(() => { load(); }, []);

  const openModal = () => {
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };
  const closeModal = () => {
    const modal = window.bootstrap.Modal.getInstance(modalRef.current);
    modal && modal.hide();
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMsg("");
    openModal();
  };
  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({
      nom: r.nom, prenom: r.prenom, email: r.email,
      jour: r.jour, heure: r.heure,
      nb_personnes: r.nb_personnes, service: r.service
    });
    setMsg("");
    openModal();
  };

  const onHeureChange = (e) => {
    const val = e.target.value;
    const hhmm = val.slice(0, 5);
    const s = serviceForHour(hhmm);
    setForm((f) => ({ ...f, heure: val, service: s ?? f.service }));
  };
  const onServiceChange = (e) => {
    const s = e.target.value;
    const { min, max } = limitsForService(s);
    const cur = form.heure.slice(0, 5);
    const nextHeure = cur >= min && cur < max ? form.heure : `${min}:00`;
    setForm((f) => ({ ...f, service: s, heure: nextHeure }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      if (editingId) {
        await api.patch(`/api/reservations/${editingId}`, form);
      } else {
        await api.post("/api/reservations", form);
      }
      closeModal();
      await load();
    } catch (err) {
      const m = err?.response?.data?.error || "Erreur";
      setMsg(m);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cette réservation ?")) return;
    await api.delete(`/api/reservations/${id}`);
    load();
  };

  const limits = limitsForService(form.service);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h3 className="mb-3 mb-md-0">Réservations ({total})</h3>
        <button className="btn btn-success" onClick={startCreate}>+ Ajouter</button>
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Nom</th><th>Email</th><th>Jour</th><th>Heure</th>
              <th>Nb</th><th>Service</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.nom} {r.prenom}</td>
                <td>{r.email}</td>
                <td>{r.jour}</td>
                <td>{r.heure}</td>
                <td>{r.nb_personnes}</td>
                <td className="text-capitalize">{r.service}</td>
                <td className="d-flex flex-wrap gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(r)}>Modifier</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan="7" className="text-center text-muted">Aucune réservation</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="modal" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={submit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? "Modifier la réservation" : "Ajouter une réservation"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {["nom", "prenom", "email"].map((k) => (
                    <div className="col-12 col-md-4" key={k}>
                      <label className="form-label text-capitalize">{k}</label>
                      <input className="form-control" name={k} value={form[k]}
                             onChange={(e) => setForm({ ...form, [k]: e.target.value })} required />
                    </div>
                  ))}
                  <div className="col-12 col-md-4">
                    <label className="form-label">Jour</label>
                    <input type="date" className="form-control" name="jour" value={form.jour}
                           onChange={(e) => setForm({ ...form, jour: e.target.value })} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Heure</label>
                    <input type="time" className="form-control" name="heure" value={form.heure}
                           min={limits.min} max={limits.max}
                           onChange={onHeureChange} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Couverts</label>
                    <input type="number" className="form-control" name="nb_personnes"
                           min="1" max="40" value={form.nb_personnes}
                           onChange={(e) => setForm({ ...form, nb_personnes: e.target.value })} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Service</label>
                    <select className="form-select" name="service" value={form.service}
                            onChange={onServiceChange} required>
                      <option value="midi">Midi (12h-14h)</option>
                      <option value="soir">Soir (19h-21h)</option>
                    </select>
                  </div>
                </div>
                {msg && <div className="alert alert-danger mt-3">{msg}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={closeModal}>Annuler</button>
                <button className="btn btn-primary">{editingId ? "Enregistrer" : "Créer"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
