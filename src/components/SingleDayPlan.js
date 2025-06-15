"use client";
import SingleMealDropCell from "./SingleMealDropCell";

const MEALS = ["Breakfast", "Lunch", "Dinner"];

function getItemMacros(item) {
  if (item.type === "ingredient" && item.caloriesPerServing !== undefined) {
    return {
      kcal: item.caloriesPerServing,
      p: item.proteinPerServing,
      c: item.carbsPerServing,
      f: item.fatPerServing,
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

export default function SingleDayPlan({ meals, onRemoveItem, calorieGoal = 0, macroPercents }) {
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
      <table className="min-w-[400px] max-w-2xl w-full border text-xs md:text-base mb-4 mx-auto">
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
              />
            ))}
          </tr>
          <tr className="bg-gray-50 text-[13px]">
            {MEALS.map((meal) => (
              <td key={meal} className="border p-2 text-center">
                <div>
                  <span className="font-semibold">{macroSums[meal].kcal}</span> kcal
                </div>
                <div>
                  <span className="text-blue-700">{macroSums[meal].p}p</span> /{' '}
                  <span className="text-green-700">{macroSums[meal].c}c</span> /{' '}
                  <span className="text-orange-700">{macroSums[meal].f}f</span>
                </div>
              </td>
            ))}
          </tr>
          <tr className="bg-gray-100">
            <td colSpan={MEALS.length} className="border p-2 text-center text-sm">
              <div className="font-semibold mb-1">Daily Total</div>
              <div>
                <span className="font-mono">{dailyTotal.kcal}</span> kcal
                {diffIndicator(dailyTotal.kcal, targetMacros?.kcal)} {' / '}
                <span className="font-mono text-blue-700">{dailyTotal.p}p</span>
                {diffIndicator(dailyTotal.p, targetMacros?.p)} {' / '}
                <span className="font-mono text-green-700">{dailyTotal.c}c</span>
                {diffIndicator(dailyTotal.c, targetMacros?.c)} {' / '}
                <span className="font-mono text-orange-700">{dailyTotal.f}f</span>
                {diffIndicator(dailyTotal.f, targetMacros?.f)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
