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
  const [tdee, setTDEE] = useState(null);

  function calcTDEE() {
    if (!gender || !age || !height || !weight || !activity) return;
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    let bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
    setTDEE(Math.round(bmr * Number(activity)));
  }

  return (
    <div className="min-h-screen bg-[#fff4e5]">
      <HeaderBar />
      <main className="flex flex-col items-center justify-start px-2 min-h-[calc(100vh-70px)]">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8 mt-10 mb-16">
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-gray-900">
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
              <label className="block text-base font-medium text-gray-900 mb-1">
                Gender
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 focus:border-blue-400 bg-white px-4 py-3 text-gray-900 text-base focus:outline-none"
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
              <label className="block text-base font-medium text-gray-900 mb-1">
                Age (years)
              </label>
              <input
                type="number"
                className="w-full rounded-xl border border-gray-200 focus:border-blue-400 bg-white px-4 py-3 text-gray-900 text-base focus:outline-none"
                placeholder="Enter your age"
                value={age}
                min={10}
                max={120}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-900 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                className="w-full rounded-xl border border-gray-200 focus:border-blue-400 bg-white px-4 py-3 text-gray-900 text-base focus:outline-none"
                placeholder="Enter your height"
                value={height}
                min={90}
                max={250}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-900 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                className="w-full rounded-xl border border-gray-200 focus:border-blue-400 bg-white px-4 py-3 text-gray-900 text-base focus:outline-none"
                placeholder="Enter your weight"
                value={weight}
                min={30}
                max={250}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-900 mb-1">
                Activity Level
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 focus:border-blue-400 bg-white px-4 py-3 text-gray-900 text-base focus:outline-none"
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
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition mt-2"
            >
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
          </div>
        </div>
      </main>
    </div>
  );
}
