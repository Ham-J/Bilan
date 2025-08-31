import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
/*import ProtectedRoute from "./ProtectedRoute";*/
import Navbar from "./components/Navbar";
import Home from "./pages/Home";


export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
        
        </Routes>
        
      </BrowserRouter>
    </AuthProvider>
  );
}
