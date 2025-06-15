"use client";
import { useState } from "react";
import HeaderBar from "../HeaderBar";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (1-3 days/week)", value: 1.375 },
  { label: "Moderately active (3-5 days/week)", value: 1.55 },
  { label: "Very active (6-7 days/week)", value: 1.725 },
  { label: "Extra active (hard exercise & physical job)", value: 1.9 },
];

export default function CalculatorPage() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("");
  const [unitSystem, setUnitSystem] = useState("imperial");
  const [tdee, setTDEE] = useState(null);
  const [weeklyChange, setWeeklyChange] = useState(0);

  function calcTDEE() {
    if (!gender || !age || !height || !weight || !activity) return;
    const a = Number(age);
    let w = Number(weight);
    let h = Number(height);
    if (unitSystem === "imperial") {
      w = w * 0.453592; // convert lbs to kg
      h = h * 2.54; // convert inches to cm
    }
    let bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
    setTDEE(Math.round(bmr * Number(activity)));
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--anime-bg)' }}>
      <HeaderBar />
      <main className="flex flex-col items-center justify-start px-2 min-h-[calc(100vh-70px)]">
        <div className="w-full max-w-lg anime-card mt-10 mb-16">
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-gray-900 font-heading">
            TDEE Calculator
          </h1>
          <p className="mb-7 text-base text-gray-800 leading-snug">
            Calculate your Total Daily Energy Expenditure (TDEE) to determine
            your daily calorie needs. This calculator uses the Mifflin-St Jeor
            equation, considered one of the most accurate methods for estimating
            TDEE.
          </p>
          {/* Form fields */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              calcTDEE();
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="anime-label">Gender</label>
              <select
                className="anime-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="anime-label">Units</label>
              <select
                className="anime-input"
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
              >
                <option value="imperial">Imperial</option>
                <option value="metric">Metric</option>
              </select>
            </div>
            <div>
              <label className="anime-label">Age (years)</label>
              <input
                type="number"
                className="anime-input"
                placeholder="Enter your age"
                value={age}
                min={10}
                max={120}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="anime-label">
                Height {unitSystem === "metric" ? "(cm)" : "(inches)"}
              </label>
              <input
                type="number"
                className="anime-input"
                placeholder="Enter your height"
                value={height}
                min={unitSystem === "metric" ? 90 : 35}
                max={unitSystem === "metric" ? 250 : 96}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="anime-label">
                Weight {unitSystem === "metric" ? "(kg)" : "(lbs)"}
              </label>
              <input
                type="number"
                className="anime-input"
                placeholder="Enter your weight"
                value={weight}
                min={unitSystem === "metric" ? 30 : 50}
                max={unitSystem === "metric" ? 250 : 600}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="anime-label">Activity Level</label>
              <select
                className="anime-input"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                required
              >
                <option value="">Select</option>
                {activityLevels.map((lvl) => (
                  <option value={lvl.value} key={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="anime-btn w-full mt-2">
              Calculate TDEE
            </button>
          </form>
          {/* Result */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-1 text-gray-900">Your TDEE</h2>
            <p className="text-base text-gray-800 leading-normal">
              {tdee ? (
                <>
                  Your estimated TDEE is <b>{tdee} calories per day</b>.
                  <br />
                  This is the number of calories you need to maintain your
                  current weight. To lose weight, aim for a calorie deficit, and
                  to gain weight, aim for a calorie surplus.
                </>
              ) : (
                <>
                  Enter your information and click "Calculate TDEE" to see your
                  result here.
                </>
              )}
            </p>
            {tdee && (
              <div className="mt-5">
                <label className="anime-label">
                  Weekly change (lbs): {weeklyChange}
                </label>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={0.5}
                  value={weeklyChange}
                  onChange={(e) => setWeeklyChange(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-3 text-base text-gray-800">
                  Daily calorie goal: <b>{Math.round(tdee + weeklyChange * 500)}</b>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
