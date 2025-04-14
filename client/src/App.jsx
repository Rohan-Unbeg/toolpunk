import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProjectGenerator from "./pages/ProjectGenerator";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Premium from "./pages/Premium";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { AuthProvider } from "./context/AuthContext";
import {
    PrivacyPolicy,
    RefundPolicy,
    ShippingPolicy,
    TermsAndConditions,
} from "./pages/PolicyPage";
import Contact from "./pages/Contact";
import VerifyPending from "./pages/VerifyPending";
import VerifyEmail from "./pages/VerifyEmail";
import CheckEmail from "./pages/CheckEmail";

function App() {
    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/verify-pending" element={<VerifyPending />} />
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
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/refunds" element={<RefundPolicy />} />
                <Route path="/shipping" element={<ShippingPolicy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/check-email" element={<CheckEmail />} />
            </Routes>
            <Footer />
        </AuthProvider>
    );
}

export default App;
