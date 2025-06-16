"use client";
import SingleMealDropCell from "./SingleMealDropCell";

const MEALS = ["Breakfast", "Lunch", "Dinner"];

function getItemMacros(item) {
  if (item.type === "ingredient" && item.caloriesPerServing !== undefined) {
    const factor = item.grams
      ? item.grams / (item.servingSize || 1)
      : 1;
    return {
      kcal: (item.caloriesPerServing || 0) * factor,
      p: (item.proteinPerServing || 0) * factor,
      c: (item.carbsPerServing || 0) * factor,
      f: (item.fatPerServing || 0) * factor,
    };
  }
  if (item.type === "recipe" && item.macrosPerServing) {
    return item.macrosPerServing;
  }
  if (item.type === "recipe" && item.perServing) {
    return {
      kcal: item.perServing.calories,
      p: item.perServing.protein,
      c: item.perServing.carbs,
      f: item.perServing.fat,
    };
  }
  return { kcal: 0, p: 0, c: 0, f: 0 };
}

export default function SingleDayPlan({ meals, onRemoveItem, onUpdateItem, calorieGoal = 0, macroPercents }) {
  // meals: { Breakfast: [], Lunch: [], Dinner: [] }

  // Macro sum for each meal
  const macroSums = {};
  MEALS.forEach((meal) => {
    const sum = { kcal: 0, p: 0, c: 0, f: 0 };
    (meals[meal] || []).forEach((item) => {
      const macros = getItemMacros(item);
      sum.kcal += Number(macros.kcal) || 0;
      sum.p += Number(macros.p) || 0;
      sum.c += Number(macros.c) || 0;
      sum.f += Number(macros.f) || 0;
    });
    macroSums[meal] = sum;
  });

  const dailyTotal = MEALS.reduce(
    (acc, m) => {
      const sum = macroSums[m] || { kcal: 0, p: 0, c: 0, f: 0 };
      acc.kcal += sum.kcal;
      acc.p += sum.p;
      acc.c += sum.c;
      acc.f += sum.f;
      return acc;
    },
    { kcal: 0, p: 0, c: 0, f: 0 }
  );

  const targetMacros = calorieGoal
    ? {
        kcal: calorieGoal,
        p: Math.round((calorieGoal * (macroPercents?.protein || 0)) / 400),
        c: Math.round((calorieGoal * (macroPercents?.carbs || 0)) / 400),
        f: Math.round((calorieGoal * (macroPercents?.fat || 0)) / 900),
      }
    : null;

  const diffIndicator = (actual, target) => {
    if (!target) return null;
    if (actual > target) return <span className="text-red-600">↑</span>;
    if (actual < target) return <span className="text-blue-600">↓</span>;
    return null;
  };

  return (
    <div>
      <table className="min-w-[400px] max-w-2xl w-4/5 border text-xs md:text-base mb-4 mx-auto">
        <thead>
          <tr>
            {MEALS.map((meal) => (
              <th key={meal} className="border p-2">
                {meal}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {MEALS.map((meal) => (
              <SingleMealDropCell
                key={meal}
                meal={meal}
                items={meals[meal]}
                onRemoveItem={onRemoveItem}
                onUpdateItem={onUpdateItem}
              />
            ))}
          </tr>
          <tr className="bg-gray-50 text-[13px]">
            {MEALS.map((meal) => (
              <td key={meal} className="border p-2 text-center">
                <div>
                  <span className="font-semibold">{macroSums[meal].kcal.toFixed(0)}</span> kcal
                </div>
                <div>
                  <span className="text-blue-700">{macroSums[meal].p.toFixed(1)}p</span> /{' '}
                  <span className="text-green-700">{macroSums[meal].c.toFixed(1)}c</span> /{' '}
                  <span className="text-orange-700">{macroSums[meal].f.toFixed(1)}f</span>
                </div>
              </td>
            ))}
          </tr>
          <tr className="bg-gray-100">
            <td colSpan={MEALS.length} className="border p-2 text-center text-sm">
              <div className="font-semibold mb-1">Daily Total</div>
              <div>
                <span className="font-mono">{dailyTotal.kcal.toFixed(0)}</span> kcal
                {diffIndicator(dailyTotal.kcal, targetMacros?.kcal)} {' / '}
                <span className="font-mono text-blue-700">{dailyTotal.p.toFixed(1)}p</span>
                {diffIndicator(dailyTotal.p, targetMacros?.p)} {' / '}
                <span className="font-mono text-green-700">{dailyTotal.c.toFixed(1)}c</span>
                {diffIndicator(dailyTotal.c, targetMacros?.c)} {' / '}
                <span className="font-mono text-orange-700">{dailyTotal.f.toFixed(1)}f</span>
                {diffIndicator(dailyTotal.f, targetMacros?.f)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      {targetMacros && (
        <div className="text-center text-sm mb-4">
          <div>
            <span className="font-semibold">Target:</span>{' '}
            <span className="font-mono">{targetMacros.kcal}</span> kcal /{' '}
            <span className="text-blue-700">{targetMacros.p}p</span> /{' '}
            <span className="text-green-700">{targetMacros.c}c</span> /{' '}
            <span className="text-orange-700">{targetMacros.f}f</span>
          </div>
          <div>
            <span className="font-semibold">Actual:</span>{' '}
            <span className="font-mono">{dailyTotal.kcal.toFixed(0)}</span> kcal /{' '}
            <span className="text-blue-700">{dailyTotal.p.toFixed(1)}p</span> /{' '}
            <span className="text-green-700">{dailyTotal.c.toFixed(1)}c</span> /{' '}
            <span className="text-orange-700">{dailyTotal.f.toFixed(1)}f</span>
          </div>
        </div>
      )}
    </div>
  );
}
