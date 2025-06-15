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

export default function SingleDayPlan({ meals, onRemoveItem }) {
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

  return (
    <div>
      <table className="min-w-[400px] max-w-2xl w-full border text-xs md:text-base mb-4">
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
        </tbody>
      </table>
      {/* Macros summary row */}
      <div className="flex gap-2 justify-around mt-4 w-full max-w-2xl mx-auto">
        {MEALS.map((meal) => (
          <div
            key={meal}
            className="flex flex-col items-center bg-gray-50 p-2 rounded shadow text-[13px] min-w-[110px]"
          >
            <div className="font-semibold mb-1">{meal}</div>
            <div>
              <span className="font-bold">{macroSums[meal].kcal}</span> kcal
            </div>
            <div>
              <span className="text-blue-700">{macroSums[meal].p}p</span> /{" "}
              <span className="text-green-700">{macroSums[meal].c}c</span> /{" "}
              <span className="text-orange-700">{macroSums[meal].f}f</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
