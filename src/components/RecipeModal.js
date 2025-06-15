import React, { useState, useEffect } from "react";

export default function RecipeModal({
  open,
  onClose,
  onSave,
  initial,
  ingredients,
}) {
  // ingredients: full ingredient library [{ id, name, servingSize, servingUnit, caloriesPerServing, ... }]
  const [recipe, setRecipe] = useState(
    initial || { name: "", servings: 1, items: [] }
  );

  useEffect(() => {
    setRecipe(initial || { name: "", servings: 1, items: [] });
  }, [initial, open]);

  const handleIngredientChange = (idx, key, value) => {
    const items = [...recipe.items];
    items[idx] = { ...items[idx], [key]: value };
    setRecipe({ ...recipe, items });
  };

  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      items: [...recipe.items, { ingredientId: "", grams: "" }],
    });
  };

  const handleRemoveIngredient = (idx) => {
    const items = recipe.items.filter((_, i) => i !== idx);
    setRecipe({ ...recipe, items });
  };

  // Calculate total macros per serving
  const macroTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  recipe.items.forEach((item) => {
    const ing = ingredients.find((i) => i.id === item.ingredientId);
    if (!ing || !item.grams || !ing.servingSize) return;
    const factor = item.grams / ing.servingSize;
    macroTotals.calories += (ing.caloriesPerServing || 0) * factor;
    macroTotals.protein += (ing.proteinPerServing || 0) * factor;
    macroTotals.carbs += (ing.carbsPerServing || 0) * factor;
    macroTotals.fat += (ing.fatPerServing || 0) * factor;
  });
  // Per user serving
  const perServing = {
    calories: recipe.servings ? macroTotals.calories / recipe.servings : 0,
    protein: recipe.servings ? macroTotals.protein / recipe.servings : 0,
    carbs: recipe.servings ? macroTotals.carbs / recipe.servings : 0,
    fat: recipe.servings ? macroTotals.fat / recipe.servings : 0,
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initial ? "Edit" : "Add"} Recipe
        </h2>
        <label className="block mb-2">
          Name:
          <input
            className="border p-2 w-full"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
          />
        </label>
        <label className="block mb-2">
          Servings:
          <input
            type="number"
            min={1}
            step="any"
            className="border p-2 w-full"
            value={recipe.servings}
            onChange={(e) =>
              setRecipe({ ...recipe, servings: Number(e.target.value) })
            }
          />
        </label>
        <div className="my-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Ingredients</span>
            <button
              className="anime-btn px-2 py-1 bg-blue-600 text-white rounded"
              onClick={handleAddIngredient}
            >
              + Add Ingredient
            </button>
          </div>
          {recipe.items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <select
                className="border p-2 flex-1"
                value={item.ingredientId}
                onChange={(e) =>
                  handleIngredientChange(idx, "ingredientId", e.target.value)
                }
              >
                <option value="">Select ingredient</option>
                {ingredients.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.servingSize}
                    {i.servingUnit} per serving)
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                step="any"
                className="border p-2 w-24"
                value={item.grams}
                placeholder="grams"
                onChange={(e) =>
                  handleIngredientChange(idx, "grams", Number(e.target.value))
                }
              />
              <span>g</span>
              <button
                className="text-red-600 font-bold"
                onClick={() => handleRemoveIngredient(idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 text-sm">
          <div className="font-semibold mb-1">Per Serving Nutrition:</div>
          <div>
            {perServing.calories.toFixed(0)} kcal /{" "}
            {perServing.protein.toFixed(1)}p / {perServing.carbs.toFixed(1)}c /{" "}
            {perServing.fat.toFixed(1)}f
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="anime-btn bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => {
              onSave(recipe);
              onClose();
            }}
          >
            Save
          </button>
          <button className="ml-2 anime-btn px-4 py-2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
