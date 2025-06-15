"use client";


export default function MacroGoalControl({
  calorieGoal,
  // setCalorieGoal,
  macroPercents,
  setMacroPercents,
  // userCalorieTarget,
}) {
  // Handler for sliders
  const handleChange = (macro, value) => {
    value = Number(value);
    const other = macro === "protein" ? "fat" : "protein";
    setMacroPercents((prev) => {
      // clamp so carbs never drop below zero
      const clamped = Math.max(0, Math.min(100 - prev[other], value));
      return {
        ...prev,
        [macro]: clamped,
        carbs:
          100 - (macro === "protein" ? clamped : prev.protein) -
          (macro === "fat" ? clamped : prev.fat),
      };
    });
  };

  // When user info updates, update calorieGoal (if desired)
  // useEffect(() => {
  //   if (userCalorieTarget && !calorieGoal) setCalorieGoal(userCalorieTarget);
  // }, [userCalorieTarget, calorieGoal, setCalorieGoal]);

  return (
    <div className="mb-4 p-4 bg-white rounded shadow max-w-2xl mx-auto flex flex-col gap-3">
      <div className="flex items-end gap-2 mb-2">
        <label className="text-sm font-semibold">Daily Calorie Target:</label>
        <span className="ml-2 font-mono">{calorieGoal ?? "—"}</span>
        <span className="text-gray-600 ml-1 text-sm">kcal</span>
        {/* {setCalorieGoal && (
          <input
            type="number"
            className="border p-1 rounded w-20 ml-4"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(Number(e.target.value))}
            min={0}
            step={1}
          />
        )} */}
      </div>
      <div className="flex gap-6 items-center">
        <div className="flex flex-col gap-4 items-end text-right min-w-[58px]">
          <div>
            <span className="font-semibold text-blue-700">Protein</span>
            <span className="ml-2">{macroPercents.protein}%</span>
          </div>
          <div>
            <span className="font-semibold text-green-700">Carbs</span>
            <span className="ml-2">{macroPercents.carbs}%</span>
          </div>
          <div>
            <span className="font-semibold text-orange-700">Fat</span>
            <span className="ml-2">{macroPercents.fat}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1 min-w-[120px]">
          {/* Protein slider */}
          <input
            type="range"
            min={0}
            max={100 - macroPercents.fat}
            value={macroPercents.protein}
            onChange={(e) => handleChange("protein", e.target.value)}
            className="w-full accent-blue-700"
          />
          {/* Carbs slider (disabled, auto-calculated) */}
          <input
            type="range"
            min={0}
            max={100}
            value={macroPercents.carbs}
            disabled
            className="w-full accent-green-700 opacity-60"
          />
          {/* Fat slider */}
          <input
            type="range"
            min={0}
            max={100 - macroPercents.protein}
            value={macroPercents.fat}
            onChange={(e) => handleChange("fat", e.target.value)}
            className="w-full accent-orange-700"
          />
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">
        Protein and Fat sliders control Carbs so total always equals 100%.
      </div>
    </div>
  );
}
