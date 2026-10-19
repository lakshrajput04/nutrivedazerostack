import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, UserPlus, Users, ClipboardCheck, ChevronRight } from 'lucide-react';
import { ButtonLink, Card, DoshaBadge, EmptyState, Notice, PageHeader, Spinner } from '../components/ui';
import { planLink } from '../components/PatientTable';
import usePatientsData from '../lib/usePatientsData';
import { capitalize, formatBmi, formatDate } from '../lib/format';

const STEPS = [
  ['Choose a patient', 'Pick someone below, or register a new patient first.'],
  ['Generate', 'AI builds a 14-day plan from their dosha, health profile and food preferences.'],
  ['Review and share', 'Edit any meal, save it, and download the plan as a PDF.'],
];

const PatientCard = ({ patient, plan }) => (
  <Link
    to={planLink(patient)}
    className="group flex flex-col rounded-xl border border-ink-200 bg-white p-4 shadow-card transition-colors hover:border-brand-300"
  >
    <div className="flex items-start justify-between gap-2">
      <span className="font-medium text-ink-900">{patient.name}</span>
      <DoshaBadge dosha={patient.dosha} />
    </div>
    <p className="mt-1 text-xs text-ink-500">
      {patient.age} · {capitalize(patient.gender)} · BMI {formatBmi(patient.bmi)}
    </p>
    {patient.condition?.filter((c) => c && c !== 'None').length > 0 && (
      <p className="mt-1 truncate text-xs text-ink-500">{patient.condition.filter((c) => c && c !== 'None').join(', ')}</p>
    )}
    <span
      className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        plan
          ? 'bg-ink-100 text-ink-700 group-hover:bg-ink-200'
          : 'bg-brand-600 text-white group-hover:bg-brand-700'
      }`}
    >
      {plan ? (
        <>View plan <span className="font-normal opacity-70">· {formatDate(plan.generatedAt)}</span></>
      ) : (
        <><Sparkles className="h-4 w-4" /> Generate diet plan</>
      )}
    </span>
  </Link>
);

// /diet-plans without a patient: the AI Diet Plan Generator's patient picker
const GeneratorHome = () => {
  const { patients, plans, loading, error } = usePatientsData();
  const [query, setQuery] = useState('');

  const [waiting, ready] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = patients.filter((p) => !q || p.name.toLowerCase().includes(q));
    return [matches.filter((p) => !plans[p.id]), matches.filter((p) => plans[p.id])];
  }, [patients, plans, query]);

  return (
    <>
      <PageHeader
        title="AI Diet Plan Generator"
        description="Create personalised 14-day Ayurvedic diet plans with AI."
        actions={<ButtonLink to="/patients/register" variant="secondary" icon={UserPlus}>Register a patient</ButtonLink>}
      />

      <ol className="mb-8 hidden gap-3 sm:grid sm:grid-cols-3">
        {STEPS.map(([title, text], index) => (
          <li key={title} className="flex gap-3 rounded-xl border border-ink-200 bg-white p-4">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
              {index + 1}
            </span>
            <div>
              <div className="text-sm font-medium text-ink-900">{title}</div>
              <div className="mt-0.5 text-xs text-ink-500">{text}</div>
            </div>
          </li>
        ))}
      </ol>

      <Notice status={error && { type: 'error', text: `Couldn't load patients: ${error}` }} className="mb-6" />

      {loading ? (
        <Spinner label="Loading patients..." />
      ) : patients.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No patients found"
            description="Start by registering your first patient."
            action={<ButtonLink to="/patients/register" icon={UserPlus}>Register new patient</ButtonLink>}
          />
        </Card>
      ) : (
        <>
          <div className="relative mb-6 sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a patient"
              aria-label="Find a patient"
              className="input pl-9"
            />
          </div>

          {[
            ['Waiting for a plan', Sparkles, waiting],
            ['Plan ready', ClipboardCheck, ready],
          ].map(([title, Icon, list]) => list.length > 0 && (
            <section key={title} className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Icon className="h-4 w-4 text-brand-600" />
                {title}
                <span className="font-normal text-ink-500">{list.length}</span>
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} plan={plans[patient.id]} />
                ))}
              </div>
            </section>
          ))}

          {waiting.length + ready.length === 0 && (
            <p className="flex items-center gap-1 text-sm text-ink-500">
              No patients match "{query}". <Link to="/patients/register" className="inline-flex items-center font-medium text-brand-700">Register a new patient <ChevronRight className="h-4 w-4" /></Link>
            </p>
          )}
        </>
      )}
    </>
  );
};

export default GeneratorHome;
