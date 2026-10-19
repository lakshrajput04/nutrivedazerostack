import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientRegistration from './pages/PatientRegistration';
import DietPlanGenerator from './pages/DietPlanGenerator';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/register" element={<PatientRegistration />} />
          <Route path="/diet-plans" element={<DietPlanGenerator />} />

          {/* Older URLs kept working */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/patient-registration" element={<Navigate to="/patients/register" replace />} />
          <Route path="/diet-plan-generator" element={<DietPlanGenerator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
