import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProjectGenerator from "./pages/ProjectGenerator";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Premium from "./pages/Premium";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                    path="/projectgenerator"
                    element={
                        <PrivateRoute>
                            <ProjectGenerator />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/premium"
                    element={
                        <PrivateRoute>
                            <Premium />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
