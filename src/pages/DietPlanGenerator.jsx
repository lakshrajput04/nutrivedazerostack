import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Pencil, Plus, Save, Sparkles, X, Clock, Leaf, ListChecks } from 'lucide-react';
import { Button, Card, DoshaBadge, EmptyState, Notice, Spinner } from '../components/ui';
import { apiRequest } from '../lib/api';
import { API_BASE } from '../config/api';
import { capitalize, formatBmi, formatDate } from '../lib/format';

const MEALS = [
  ['breakfast', 'Breakfast'],
  ['morning_snack', 'Morning snack'],
  ['lunch', 'Lunch'],
  ['evening_snack', 'Evening snack'],
  ['dinner', 'Dinner'],
];

// Generated items look like "🍽️ Dish name" followed by "• ingredient" lines.
// Split off the marker for display and put it back when the text is edited.
const DISH_MARKER = '🍽️ ';
const INGREDIENT_MARKER = '• ';
const parseItem = (raw) => {
  const text = String(raw);
  if (text.startsWith('🍽️')) return { kind: 'dish', text: text.replace('🍽️', '').trim() };
  if (text.startsWith('•')) return { kind: 'ingredient', text: text.replace('•', '').trim() };
  return { kind: 'plain', text: text.trim() };
};
const formatItem = (kind, text) =>
  kind === 'dish' ? `${DISH_MARKER}${text}` : kind === 'ingredient' ? `${INGREDIENT_MARKER}${text}` : text;

const MealCard = ({ label, meal, editing, onChangeItem, onRemoveItem, onAddItem }) => {
  const items = meal.items.map(parseItem);
  return (
    <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-[9rem_1fr_auto] sm:gap-6">
      <div>
        <h4 className="text-sm font-semibold text-ink-900">{label}</h4>
        {meal.timing && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
            <Clock className="h-3 w-3" />
            {meal.timing}
          </p>
        )}
      </div>

      <div className="min-w-0">
        {editing ? (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className="input py-1.5"
                  value={item.text}
                  aria-label={`${label} item ${index + 1}`}
                  onChange={(e) => onChangeItem(index, formatItem(item.kind, e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${item.text}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="ghost" size="sm" icon={Plus} onClick={onAddItem}>Add item</Button>
          </div>
        ) : (
          <ul className="space-y-1 text-sm">
            {items.map((item, index) => (
              <li
                key={index}
                className={item.kind === 'ingredient' ? 'pl-3 text-ink-500' : 'font-medium text-ink-800'}
              >
                {item.kind === 'ingredient' && <span className="mr-1.5 text-ink-300">-</span>}
                {item.text}
              </li>
            ))}
          </ul>
        )}
        {meal.ayurvedic_notes && !editing && (
          <p className="mt-2 flex items-start gap-1.5 text-xs text-brand-700">
            <Leaf className="mt-0.5 h-3 w-3 flex-shrink-0" />
            {meal.ayurvedic_notes}
          </p>
        )}
      </div>

      {meal.calories ? (
        <div className="text-sm tabular-nums text-ink-500 sm:text-right">{meal.calories} kcal</div>
      ) : <div />}
    </div>
  );
};

const BulletCard = ({ icon: Icon, title, items }) => (
  <Card className="p-5">
    <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
      <Icon className="h-4 w-4 text-brand-600" />
      {title}
    </h3>
    <ul className="mt-3 space-y-2 text-sm text-ink-600">
      {items.map((text, index) => (
        <li key={index} className="flex gap-2">
          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-brand-400" />
          {text}
        </li>
      ))}
    </ul>
  </Card>
);

const DietPlanGenerator = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('name');

  const [patient, setPatient] = useState(null);
  const [chart, setChart] = useState(null); // { dietPlan, generatedAt, status }
  const [savedChart, setSavedChart] = useState(null); // restored when an edit is cancelled
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);
  const [dayIndex, setDayIndex] = useState(0);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    Promise.all([
      apiRequest(`/patients/${patientId}`).then((r) => r.data).catch(() => null),
      apiRequest(`/ai-diet/patient/${patientId}`).then((r) => (r.success ? r.data : null)).catch(() => null),
    ]).then(([patientData, chartData]) => {
      setPatient(patientData);
      setChart(chartData);
      setLoading(false);
    });
  }, [patientId]);

  if (!patientId) return <Navigate to="/patients" replace />;

  const plan = chart?.dietPlan;
  const days = plan?.days || [];
  const day = days[dayIndex];
  const name = patient?.name || patientName || 'Patient';

  const generatePlan = async () => {
    setGenerating(true);
    setStatus({ type: 'loading', text: 'Creating a personalised 14-day plan. This usually takes about a minute.' });
    try {
      const result = await apiRequest(`/ai-diet/generate/${patientId}`, { method: 'POST', body: { createdBy: 'Dr. Practitioner' } });
      setChart(result.data.dietChart);
      setDayIndex(0);
      setStatus({ type: 'success', text: 'Diet plan created. Review it and make any changes before sharing.' });
    } catch (error) {
      setStatus({ type: 'error', text: `Couldn't generate the plan: ${error.message}` });
    } finally {
      setGenerating(false);
    }
  };

  const startEditing = () => {
    setSavedChart(chart);
    setEditing(true);
    setStatus(null);
  };

  const cancelEditing = () => {
    setChart(savedChart);
    setEditing(false);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await apiRequest(`/ai-diet/save/${patientId}`, { method: 'PUT', body: { dietPlan: plan, status: 'approved' } });
      setEditing(false);
      setStatus({ type: 'success', text: 'Changes saved.' });
    } catch (error) {
      setStatus({ type: 'error', text: `Couldn't save: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    setStatus(null);
    try {
      const response = await fetch(`${API_BASE}/pdf/generate/${patientId}`, { method: 'POST' });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Failed to generate PDF');
      }
      // The API returns the PDF itself in the response body
      const blob = await response.blob();
      const fileName = response.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1]
        || `diet_plan_${patientId}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setStatus({ type: 'error', text: `Couldn't create the PDF: ${error.message}` });
    } finally {
      setDownloading(false);
    }
  };

  // Immutable update of one meal's item list on the selected day
  const updateItems = (mealKey, change) => {
    setChart((prev) => {
      const nextDays = prev.dietPlan.days.map((d, i) => {
        if (i !== dayIndex) return d;
        const meal = d.meals[mealKey];
        return { ...d, meals: { ...d.meals, [mealKey]: { ...meal, items: change(meal.items) } } };
      });
      return { ...prev, dietPlan: { ...prev.dietPlan, days: nextDays } };
    });
  };

  return (
    <>
      <Link to="/patients" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4" /> Patients
      </Link>

      {/* Patient header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{name}</h1>
            {patient?.dosha && <DoshaBadge dosha={patient.dosha} />}
          </div>
          {patient && (
            <p className="mt-1 text-sm text-ink-500">
              {patient.age} years · {capitalize(patient.gender)} · BMI {formatBmi(patient.bmi)}
              {patient.dietary_habits && ` · ${capitalize(patient.dietary_habits)}`}
            </p>
          )}
        </div>

        {plan && (
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <>
                <Button variant="secondary" onClick={cancelEditing} disabled={saving}>Cancel</Button>
                <Button icon={Save} onClick={saveChanges} loading={saving}>Save changes</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" icon={Pencil} onClick={startEditing}>Edit plan</Button>
                <Button icon={Download} onClick={downloadPDF} loading={downloading}>
                  {downloading ? 'Preparing PDF...' : 'Download PDF'}
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <Notice status={status} className="mb-6" />

      {loading ? (
        <Card><Spinner label="Loading diet plan..." /></Card>
      ) : !plan ? (
        <Card>
          <EmptyState
            icon={Sparkles}
            title="No diet plan yet"
            description={`Create a personalised 14-day Ayurvedic plan for ${name}, based on their constitution, health profile and food preferences.`}
            action={
              <Button icon={Sparkles} onClick={generatePlan} loading={generating}>
                {generating ? 'Generating...' : 'Generate diet plan'}
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="overflow-hidden lg:col-span-2">
            {/* Day selector */}
            <div className="border-b border-ink-200 px-5 pt-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-ink-900">{days.length}-day meal plan</h2>
                {chart.generatedAt && <span className="text-xs text-ink-500">Created {formatDate(chart.generatedAt)}</span>}
              </div>
              <div className="-mx-1 mt-3 flex gap-1 overflow-x-auto pb-3" role="tablist" aria-label="Plan day">
                {days.map((d, index) => (
                  <button
                    key={d.day ?? index}
                    type="button"
                    role="tab"
                    aria-selected={index === dayIndex}
                    onClick={() => setDayIndex(index)}
                    className={`min-w-[2.75rem] flex-shrink-0 rounded-md px-2 py-1.5 text-center text-sm font-medium tabular-nums transition-colors ${
                      index === dayIndex ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-ink-100'
                    }`}
                  >
                    <span className="block text-[10px] font-normal uppercase tracking-wide opacity-70">Day</span>
                    {d.day ?? index + 1}
                  </button>
                ))}
              </div>
            </div>

            {day && (
              <div className="px-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-100 py-4">
                  <h3 className="text-base font-semibold text-ink-900">Day {day.day ?? dayIndex + 1}</h3>
                  <span className="text-sm text-ink-500">
                    {day.total_calories && <span className="tabular-nums">{day.total_calories} kcal</span>}
                    {day.dosha_balance && <span> · {day.dosha_balance}</span>}
                  </span>
                </div>
                <div className="divide-y divide-ink-100">
                  {MEALS.filter(([key]) => day.meals?.[key]?.items).map(([key, label]) => (
                    <MealCard
                      key={key}
                      label={label}
                      meal={day.meals[key]}
                      editing={editing}
                      onChangeItem={(i, value) => updateItems(key, (items) => items.map((it, j) => (j === i ? value : it)))}
                      onRemoveItem={(i) => updateItems(key, (items) => items.filter((_, j) => j !== i))}
                      onAddItem={() => updateItems(key, (items) => [...items, `${INGREDIENT_MARKER}New item`])}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            {plan.general_guidelines?.length > 0 && (
              <BulletCard icon={ListChecks} title="General guidelines" items={plan.general_guidelines} />
            )}
            {plan.ayurvedic_tips?.length > 0 && (
              <BulletCard icon={Leaf} title="Ayurvedic tips" items={plan.ayurvedic_tips} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DietPlanGenerator;
