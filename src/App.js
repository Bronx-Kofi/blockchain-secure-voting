
// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import AuthForm from "./components/AuthForm";
import VoteForm from "./components/VoteForm";
import EnterOtp from "./components/EnterOtp";
import AdminDashboard from "./components/AdminDashboard";
import WelcomePage from "./components/WelcomePage";

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route path="/auth" element={<AuthForm />} />

        <Route path="/confirm" element={<EnterOtp />} />

        <Route path="/vote" element={<VoteForm />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
