"use client";
import { useDraggable } from "@dnd-kit/core";
function getIngredientNutrition(item) {
  if (item.caloriesPerServing === undefined) return null;
  const factor = item.grams ? item.grams / (item.servingSize || 1) : 1;
  return {
    kcal: (item.caloriesPerServing || 0) * factor,
    p: (item.proteinPerServing || 0) * factor,
    c: (item.carbsPerServing || 0) * factor,
    f: (item.fatPerServing || 0) * factor,
  };
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

export default function MealItemCard({ item, meal, index, onRemove, onUpdate }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `plan-${meal}-${index}`,
    data: { ...item, fromMeal: meal, index, source: "plan" },
  });
  const nutrition =
    item.type === "ingredient"
      ? getIngredientNutrition(item)
      : getRecipeNutrition(item);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        bg-gray-100
        inline-flex flex-col items-start text-xs
        px-2 py-1
        rounded
        shadow-sm
        whitespace-nowrap
        ${isDragging ? "opacity-60" : ""}
      `}
      style={{
        minHeight: "28px",
        fontWeight: item.type === "recipe" ? "500" : "400",
        maxWidth: "220px",
        cursor: "grab",
      }}
    >
      <div className="flex items-center gap-x-1 whitespace-nowrap">
        <span>{item.name}</span>
        {item.type === "ingredient" && (
          <input
            type="number"
            step="any"
            className="w-14 text-[9px] border rounded px-1"
            value={item.grams ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdate && onUpdate({ grams: isNaN(val) ? 0 : val });
            }}
          />
        )}
        {item.type === "recipe" && (
          <span className="text-[9px] text-blue-600 bg-blue-50 rounded px-1 py-[1px]">
            [Recipe]
          </span>
        )}
      </div>
      {nutrition && (
        <span className="text-[10px] text-gray-500 mt-[1px] whitespace-nowrap">
          {nutrition.kcal.toFixed ? nutrition.kcal.toFixed(0) : nutrition.kcal} kcal / {nutrition.p.toFixed ? nutrition.p.toFixed(1) : nutrition.p}p / {nutrition.c.toFixed ? nutrition.c.toFixed(1) : nutrition.c}c /{' '}
          {nutrition.f.toFixed ? nutrition.f.toFixed(1) : nutrition.f}f
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
