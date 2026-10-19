// Reads the values the diet-plan prompts need from a stored patient record.
// Patient.create nests activity, sleep, stress and work type under `lifestyle`;
// older records may still have them at the top level, so fall back to those.

const humanize = (value) => String(value).replace(/_/g, ' ');

function getPatientProfile(patient) {
  const lifestyle = patient.lifestyle || {};
  const waterIntake = parseFloat(patient.waterIntake);

  return {
    activityLevel: lifestyle.activityLevel || patient.activityLevel || 'moderate',
    sleepPattern: lifestyle.sleepPattern || patient.sleepPattern || 'regular',
    stressLevel: lifestyle.stressLevel || patient.stressLevel || 'moderate',
    workType: lifestyle.workType || patient.workType || patient.occupation || 'desk',
    dietType: patient.dietary_habits || 'vegetarian',
    cuisinePreference: patient.cuisinePreference || 'indian',
    region: patient.region || 'General',
    weightGoal: patient.weight_goal || 'weight_maintenance',
    waterIntake: Number.isFinite(waterIntake) && waterIntake > 0 ? `${waterIntake} liters/day` : 'not recorded',
    clinicalNotes: patient.clinical_notes || patient.additionalNotes || '',
    allergies: Array.isArray(patient.allergies) ? patient.allergies.filter(Boolean) : [],
    conditions: Array.isArray(patient.condition)
      ? patient.condition.filter((c) => c && c.toLowerCase() !== 'none')
      : [],
    healthGoals: Array.isArray(patient.goals?.healthGoals) ? patient.goals.healthGoals : [],
  };
}

module.exports = { getPatientProfile, humanize };
