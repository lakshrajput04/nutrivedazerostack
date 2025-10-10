import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientForm from './pages/PatientForm';
import DietPlanGenerator from './pages/DietPlanGenerator';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient-registration" element={<PatientForm />} />
          <Route path="/patients/register" element={<PatientForm />} />
          <Route path="/diet-plan-generator" element={<DietPlanGenerator />} />
          <Route path="/diet-plans" element={<DietPlanGenerator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
