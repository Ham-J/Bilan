import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Carte from "./pages/Carte";
import Reservation from "./pages/Reservation";
import Login from "./pages/Login";
import ReservationsManage from "./pages/ReservationsManage";
import UsersManage from "./pages/UsersManage";

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/carte" element={<Carte/>} />
          <Route path="/reservation" element={<Reservation/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/reservations" element={
            <ProtectedRoute roles={['employe','admin']}><ReservationsManage/></ProtectedRoute>
          }/>
          <Route path="/users" element={
            <ProtectedRoute roles={['admin']}><UsersManage/></ProtectedRoute>
          }/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
  );
}
