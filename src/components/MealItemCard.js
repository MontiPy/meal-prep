"use client";
function getIngredientNutrition(item) {
  return item.caloriesPerServing !== undefined
    ? {
        kcal: item.caloriesPerServing,
        p: item.proteinPerServing,
        c: item.carbsPerServing,
        f: item.fatPerServing,
      }
    : null;
}
function getRecipeNutrition(item) {
  return item.macrosPerServing
    ? item.macrosPerServing
    : item.perServing
    ? {
        kcal: item.perServing.calories,
        p: item.perServing.protein,
        c: item.perServing.carbs,
        f: item.perServing.fat,
      }
    : null;
}

export default function MealItemCard({ item, onRemove }) {
  const nutrition =
    item.type === "ingredient"
      ? getIngredientNutrition(item)
      : getRecipeNutrition(item);

  return (
    <div
      className={`
        bg-gray-100 
        inline-flex flex-col items-start text-xs
        px-2 py-1
        rounded
        shadow-sm
        whitespace-nowrap
      `}
      style={{
        minHeight: "28px",
        fontWeight: item.type === "recipe" ? "500" : "400",
        maxWidth: "220px",
      }}
    >
      <div className="flex items-center gap-x-1 whitespace-nowrap">
        <span>{item.name}</span>
        {item.type === "recipe" && (
          <span className="text-[9px] text-blue-600 bg-blue-50 rounded px-1 py-[1px]">
            [Recipe]
          </span>
        )}
      </div>
      {nutrition && (
        <span className="text-[10px] text-gray-500 mt-[1px] whitespace-nowrap">
          {nutrition.kcal} kcal / {nutrition.p}p / {nutrition.c}c /{" "}
          {nutrition.f}f
        </span>
      )}
      <button
        className="ml-2 text-red-600 font-bold text-lg self-end"
        title="Remove"
        onClick={onRemove}
        type="button"
        style={{ lineHeight: "1", padding: 0 }}
      >
        ×
      </button>
    </div>
  );
}
