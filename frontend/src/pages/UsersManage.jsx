import { useEffect, useRef, useState } from "react";
import api from "../api";

// ---- helpers ----
const emptyForm = { email: "", password: "", role: "employe" };

export default function UsersManage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  const modalRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/users");
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  
  const openModal = () => {
    const m = new window.bootstrap.Modal(modalRef.current);
    m.show();
  };
  const closeModal = () => {
    const m = window.bootstrap.Modal.getInstance(modalRef.current);
    m && m.hide();
  };

  
  const onCreate = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/users", createForm);
      setCreateForm(emptyForm);
      await load();
    } catch (err) {
      const m = err?.response?.data?.error || "Erreur création";
      setMsg( m);
    }
  };

  
  const startEdit = (u) => {
    setEditingId(u.id);
    setEditForm({ email: u.email, password: "", role: u.role });
    setMsg("");
    openModal();
  };

  const onEdit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      
      const payload = { email: editForm.email, role: editForm.role };
      if (editForm.password) payload.password = editForm.password;

      await api.patch(`/api/users/${editingId}`, payload);
      closeModal();
      await load();
    } catch (err) {
      const m = err?.response?.data?.error || "Erreur mise à jour";
      setMsg(m);
    }
  };

  
  const del = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await api.delete(`/api/users/${id}`);
    load();
  };

  return (
    <div className="container py-4">
      <h3>Utilisateurs</h3>

      
      <form className="row g-2 mt-2" onSubmit={onCreate}>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="email"
            value={createForm.email}
            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="mot de passe"
            value={createForm.password}
            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={createForm.role}
            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
          >
            <option value="employe">Employé</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" disabled={loading}>Créer</button>
        </div>
      </form>

      {msg && <div className="alert alert-info mt-3">{msg}</div>}

      
      <div className="table-responsive mt-4">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              
              <th>Email</th>
              <th style={{width: 120}}>Rôle</th>
              <th style={{width: 220}}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                
                <td>{u.email}</td>
                <td className="text-capitalize">{u.role}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(u)}>
                    Modifier
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => del(u.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && !loading && (
              <tr><td colSpan="4" className="text-center text-muted py-4">Aucun utilisateur</td></tr>
            )}
          </tbody>
        </table>
      </div>

      
      <div className="modal" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={onEdit}>
              <div className="modal-header">
                <div className="modal-title">Modifier l’utilisateur</div>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nouveau mot de passe (optionnel)</label>
                  <input
                    type="password"
                    className="form-control"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="Laisser vide pour ne pas changer"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Rôle</label>
                  <select
                    className="form-select"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    <option value="employe">Employé</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {msg && <div className="alert alert-danger mt-3 mb-0">{msg}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={closeModal}>Annuler</button>
                <button className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
