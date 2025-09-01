import { useState } from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const { login } = useAuth();
  const navigate = useNavigate();
  const [err,setErr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const submit = async (e)=>{
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      navigate("/reservations", { replace: true }); 
    } catch (e) {
      const msg = e?.response?.data?.error || "Identifiants invalides";
      setErr(msg);
    }
  };

  return (
    <div className="container py-5" style={{maxWidth:420}}>
      <h3>Connexion</h3>
      <form onSubmit={submit} className="mt-3">
        <input className="form-control mb-2" placeholder="Votre email"
        value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="Mot de passe"
        value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="alert alert-danger">{err}</div>}
        <button className="btn btn-dark w-100">Valider</button>
      </form>
    </div>
  );
}
