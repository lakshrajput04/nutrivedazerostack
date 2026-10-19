import { Link } from 'react-router-dom';
import { Users, ClipboardCheck, ClipboardList, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { ButtonLink, Card, EmptyState, Notice, PageHeader, Spinner } from '../components/ui';
import PatientTable from '../components/PatientTable';
import usePatientsData from '../lib/usePatientsData';
import { formatDosha } from '../lib/format';

const RECENT_COUNT = 6;

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const ActionCard = ({ to, icon: Icon, title, description, primary }) => (
  <Link
    to={to}
    className={`group flex items-center gap-4 rounded-xl border p-5 shadow-card transition-colors ${
      primary ? 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700' : 'border-ink-200 bg-white hover:border-brand-300'
    }`}
  >
    <span className={`rounded-lg p-2.5 ${primary ? 'bg-white/15' : 'bg-brand-50 text-brand-600'}`}>
      <Icon className="h-5 w-5" />
    </span>
    <span className="min-w-0 flex-1">
      <span className={`block font-semibold ${primary ? 'text-white' : 'text-ink-900'}`}>{title}</span>
      <span className={`block text-sm ${primary ? 'text-brand-100' : 'text-ink-500'}`}>{description}</span>
    </span>
    <ArrowRight className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${primary ? 'text-white' : 'text-ink-400'}`} />
  </Link>
);

const StatTile = ({ icon: Icon, label, value, hint }) => (
  <Card className="p-3 sm:p-5">
    <div className="flex items-center gap-2 text-xs text-ink-500 sm:text-sm">
      <Icon className="hidden h-4 w-4 sm:block" />
      {label}
    </div>
    <div className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-ink-900 sm:mt-2 sm:text-3xl">{value}</div>
    {hint && <div className="mt-1 hidden text-xs text-ink-500 sm:block">{hint}</div>}
  </Card>
);

// Single-hue bar list: one bar per constitution, labelled with its count
const DoshaBreakdown = ({ patients }) => {
  const counts = patients.reduce((acc, p) => {
    const key = formatDosha(p.dosha);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map(([, n]) => n), 1);

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-ink-900">Patients by constitution</h2>
      <ul className="mt-4 space-y-2.5">
        {rows.map(([dosha, count]) => (
          <li key={dosha} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 text-sm" title={`${dosha}: ${count} patients`}>
            <span className="truncate text-ink-600">{dosha}</span>
            <span className="h-2 rounded-full bg-ink-100">
              <span className="block h-2 rounded-full bg-brand-500" style={{ width: `${(count / max) * 100}%` }} />
            </span>
            <span className="text-right tabular-nums text-ink-700">{count}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const Dashboard = () => {
  const { patients, plans, loading, error } = usePatientsData();
  const withPlan = patients.filter((p) => plans[p.id]).length;

  return (
    <>
      <PageHeader
        title={greeting()}
        description="Overview of your patients and their Ayurvedic diet plans."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ActionCard
          to="/diet-plans"
          icon={Sparkles}
          title="AI Diet Plan Generator"
          description="Generate a personalised 14-day Ayurvedic diet plan"
          primary
        />
        <ActionCard
          to="/patients/register"
          icon={UserPlus}
          title="Patient Registration"
          description="Register a new patient with their health profile and dosha"
        />
      </div>

      <Notice status={error && { type: 'error', text: `Couldn't load patients: ${error}` }} className="mb-6" />

      {loading ? (
        <Spinner label="Loading patients..." />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatTile icon={Users} label="Patients" value={patients.length} />
            <StatTile
              icon={ClipboardCheck}
              label="With a diet plan"
              value={withPlan}
              hint={patients.length ? `${Math.round((withPlan / patients.length) * 100)}% of patients` : undefined}
            />
            <StatTile icon={ClipboardList} label="Waiting for a plan" value={patients.length - withPlan} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="overflow-hidden lg:col-span-2">
              <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
                <h2 className="text-sm font-semibold text-ink-900">Recent patients</h2>
                <Link to="/patients" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {patients.length ? (
                <PatientTable patients={patients.slice(0, RECENT_COUNT)} plans={plans} compact />
              ) : (
                <EmptyState
                  icon={Users}
                  title="No patients yet"
                  description="Register your first patient to generate a personalised diet plan."
                  action={<ButtonLink to="/patients/register" icon={UserPlus}>New patient</ButtonLink>}
                />
              )}
            </Card>

            {patients.length > 0 && <DoshaBreakdown patients={patients} />}
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
