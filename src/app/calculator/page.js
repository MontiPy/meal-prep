"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (1-3 days/week)", value: 1.375 },
  { label: "Moderately active (3-5 days/week)", value: 1.55 },
  { label: "Very active (6-7 days/week)", value: 1.725 },
  { label: "Extra active (hard exercise & physical job)", value: 1.9 },
];

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

function lbToKg(lb) {
  return lb / 2.20462;
}
function kgToLb(kg) {
  return kg * 2.20462;
}
function inToCm(inches) {
  return inches * 2.54;
}
function cmToIn(cm) {
  return cm / 2.54;
}

export default function CalculatorPage() {
  const [unit, setUnit] = useState("imperial");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState(1.375);
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [hasProfile, setHasProfile] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setUnit(data.unit || "imperial");
        setAge(data.age !== undefined ? String(data.age) : "");
        setGender(data.gender || "male");
        setWeight(data.weight !== undefined ? String(data.weight) : "");
        setHeight(data.height !== undefined ? String(data.height) : "");
        setActivity(
          data.activity !== undefined ? String(data.activity) : 1.375
        );
        setWeeklyChange(data.weeklyChange || 0);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
      setSaveStatus("");
    };
    fetchProfile();
  }, [user]);

  const getWeightKg = () =>
    unit === "imperial" ? lbToKg(Number(weight)) : Number(weight);
  const getHeightCm = () =>
    unit === "imperial" ? inToCm(Number(height)) : Number(height);

  const calcBMR = () => {
    if (!age || !height || !weight) return 0;
    const w = getWeightKg();
    const h = getHeightCm();
    if (gender === "male") {
      return Math.round(10 * w + 6.25 * h - 5 * Number(age) + 5);
    } else {
      return Math.round(10 * w + 6.25 * h - 5 * Number(age) - 161);
    }
  };

  const calcTDEE = () => Math.round(calcBMR() * Number(activity));

  const calcCalorieAdjustment = () => {
    if (unit === "imperial") {
      return (weeklyChange * 3500) / 7;
    } else {
      return (weeklyChange * 7700) / 7;
    }
  };

  const calcDailyGoal = () => {
    const tdee = calcTDEE();
    if (!tdee) return 0;
    return Math.round(tdee + calcCalorieAdjustment());
  };

  const sliderProps =
    unit === "imperial"
      ? { min: -3, max: 3, step: 0.1 }
      : { min: -1.36, max: 1.36, step: 0.05 };

  const handleUnitChange = (newUnit) => {
    if (unit === newUnit) return;
    setUnit(newUnit);
    setWeeklyChange(0);
    if (newUnit === "imperial") {
      setWeight(weight ? kgToLb(Number(weight)).toFixed(1) : "");
      setHeight(height ? cmToIn(Number(height)).toFixed(1) : "");
    } else {
      setWeight(weight ? lbToKg(Number(weight)).toFixed(1) : "");
      setHeight(height ? inToCm(Number(height)).toFixed(1) : "");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        unit,
        age: Number(age),
        gender,
        weight: Number(weight),
        height: Number(height),
        activity: Number(activity),
        weeklyChange,
        dailyGoal: calcDailyGoal(),
      },
      { merge: true }
    );
    setHasProfile(true);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const buttonText =
    saveStatus === "saved"
      ? "Goal Saved!"
      : hasProfile
      ? "Update Goal"
      : "Save Goal";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">BMR & TDEE Calculator</h1>
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={() => handleUnitChange("imperial")}
          className={`px-4 py-1 rounded-xl border ${
            unit === "imperial"
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-gray-200 text-white dark:bg-zinc-800"
          }`}
        >
          Imperial
        </button>
        <button
          type="button"
          onClick={() => handleUnitChange("metric")}
          className={`px-4 py-1 rounded-xl border ${
            unit === "metric"
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-gray-200 text-white dark:bg-zinc-800"
          }`}
        >
          Metric
        </button>
      </div>
      <form
        className="bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-4 w-full max-w-md"
        onSubmit={(e) => e.preventDefault()}
      >
        <label>
          Age
          <input
            type="number"
            className="w-full mt-1 px-2 py-1 rounded border"
            min="10"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="years"
            required
          />
        </label>
        <label>
          Gender
          <div className="flex gap-4 mt-1">
            {genders.map((g) => (
              <label key={g.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value={g.value}
                  checked={gender === g.value}
                  onChange={() => setGender(g.value)}
                />
                {g.label}
              </label>
            ))}
          </div>
        </label>
        <label>
          {unit === "imperial" ? "Height (inches)" : "Height (cm)"}
          <input
            type="number"
            className="w-full mt-1 px-2 py-1 rounded border"
            min={unit === "imperial" ? 36 : 90}
            max={unit === "imperial" ? 90 : 250}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "imperial" ? "inches" : "cm"}
            required
          />
        </label>
        <label>
          {unit === "imperial" ? "Weight (lbs)" : "Weight (kg)"}
          <input
            type="number"
            className="w-full mt-1 px-2 py-1 rounded border"
            min={unit === "imperial" ? 66 : 30}
            max={unit === "imperial" ? 500 : 250}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "imperial" ? "lbs" : "kg"}
            required
          />
        </label>
        <label>
          Activity Level
          <select
            className="w-full mt-1 px-2 py-1 rounded border"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            {activityLevels.map((a) => (
              <option value={a.value} key={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-semibold">
            Target Weekly Weight Change:{" "}
            <span className="text-blue-700 dark:text-blue-300 font-bold">
              {unit === "imperial"
                ? `${weeklyChange.toFixed(2)} lbs/week`
                : `${weeklyChange.toFixed(2)} kg/week`}
            </span>
          </label>
          <input
            type="range"
            {...sliderProps}
            value={weeklyChange}
            onChange={(e) => setWeeklyChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>{unit === "imperial" ? "-3 lbs/week" : "-1.36 kg/week"}</span>
            <span>0</span>
            <span>{unit === "imperial" ? "+3 lbs/week" : "+1.36 kg/week"}</span>
          </div>
          <div className="text-gray-500 text-xs">
            (Negative: lose weight, Positive: gain weight)
          </div>
        </div>
      </form>

      <div className="mt-6 bg-blue-100 dark:bg-zinc-800 text-blue-900 dark:text-blue-200 rounded-xl p-4 w-full max-w-md flex flex-col gap-2">
        <div>
          <span className="font-semibold">BMR: </span>
          {calcBMR() > 0 ? `${calcBMR()} kcal/day` : "—"}
        </div>
        <div>
          <span className="font-semibold">TDEE: </span>
          {calcTDEE() > 0 ? `${calcTDEE()} kcal/day` : "—"}
        </div>
        <div>
          <span className="font-semibold">Daily Calorie Goal: </span>
          {calcDailyGoal() > 0 ? (
            <>
              <span className="font-bold">{calcDailyGoal()} kcal/day</span>{" "}
              <span className="text-xs text-gray-500">
                (for your goal of{" "}
                {unit === "imperial"
                  ? `${weeklyChange.toFixed(2)} lbs`
                  : `${weeklyChange.toFixed(2)} kg`}{" "}
                per week)
              </span>
            </>
          ) : (
            "—"
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-8 px-4 py-2 bg-blue-700 text-white rounded-xl"
      >
        {buttonText}
      </button>

      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-xl"
      >
        ← Back to Dashboard
      </Link>
    </main>
  );
}
