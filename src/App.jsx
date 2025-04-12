import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProjectGenerator from "./pages/ProjectGenerator";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Premium from "./pages/Premium";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/projectgenerator"
                    element={
                        <PrivateRoute>
                            <ProjectGenerator />
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<Login />} />

                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
