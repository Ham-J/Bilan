import { useState } from "react";
import api from "../api";
import table from "../assets/img/table.jpg"

const serviceForHour = (hhmm) => {
  if (hhmm >= "12:00" && hhmm < "14:00") return "midi";
  if (hhmm >= "19:00" && hhmm < "21:00") return "soir";
  return null;
};
const limitsForService = (service) =>
  service === "midi" ? { min: "12:00", max: "14:00" } : { min: "19:00", max: "21:00" };

const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function Reservation() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    jour: "",
    heure: "12:00:00",
    nb_personnes: 1,
    service: "midi",
  });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      await api.post("/api/reservations", form);
      setMsg("Réservation enregistrée");
      setForm({
        nom: "",
        prenom: "",
        email: "",
        jour: "",
        heure: "12:00:00",
        nb_personnes: 1,
        service: "midi",
      });
    } catch (err) {
      setMsg( (err?.response?.data?.error || "Erreur"));
    }
  };

  const limits = limitsForService(form.service);

  return (
    <section>
      <h1>Réserver votre table</h1>
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6 mb-4 mb-lg-0">
            <img
              src={table}
              className="img-fluid"
              alt="Illustration réservation"
            />
          </div>

          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={submit}>
            
              <div className="mb-3">
                <input
                  className="form-control form-control-lg"
                  name="nom"
                  value={form.nom}
                  onChange={onChange}
                  placeholder="Nom"
                  required
                /> 
              </div>
              <div className="mb-3">
                <input
                  className="form-control form-control-lg"
                  name="prenom"
                  value={form.prenom}
                  onChange={onChange}
                  placeholder="Prénom"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  id="emailInput"
                  className="form-control form-control-lg"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Votre mail"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="date"
                  className="form-control form-control-lg"
                  name="jour"
                  value={form.jour}
                  onChange={onChange}
                  min={tomorrowISO()}
                  required
                />
               
              </div>
              <div className="mb-3">
               
                <input
                  type="time"
                  className="form-control form-control-lg"
                  name="heure"
                  value={form.heure}
                  min={limits.min}
                  max={limits.max}
                  onChange={onHeureChange}
                  required
                />
              </div>
               <div className="mb-3">
                <select
                  className="form-select form-select-lg"
                  name="service"
                  value={form.service}
                  onChange={onServiceChange}
                  required
                >
                  <option value="midi">Midi (12h–14h)</option>
                  <option value="soir">Soir (19h–21h)</option>
                </select>
               
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control form-control-lg"
                  name="nb_personnes"
                  value={form.nb_personnes}
                  min="1"
                  max="40"
                  onChange={onChange}
                    equired
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100">
                Valider 
              </button>
              {msg && <div className="alert alert-info mt-3 mb-0">{msg}</div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
