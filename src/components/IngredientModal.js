import React, { useState, useEffect } from "react";

export default function IngredientModal({ open, onClose, onSave, initial }) {
  const [ingredient, setIngredient] = useState(
    initial || {
      name: "",
      servingSize: "",
      servingUnit: "",
      caloriesPerServing: "",
      proteinPerServing: "",
      carbsPerServing: "",
      fatPerServing: "",
    }
  );

  useEffect(() => {
    setIngredient(
      initial || {
        name: "",
        servingSize: "",
        servingUnit: "",
        caloriesPerServing: "",
        proteinPerServing: "",
        carbsPerServing: "",
        fatPerServing: "",
      }
    );
  }, [initial, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initial ? "Edit" : "Add"} Ingredient
        </h2>
        <label className="block mb-2">
          Name:
          <input
            className="border p-2 w-full"
            value={ingredient.name}
            onChange={(e) =>
              setIngredient({ ...ingredient, name: e.target.value })
            }
          />
        </label>
        <div className="flex gap-2 mb-2">
          <label className="flex-1">
            Serving size:
            <input
              type="number"
              step="any"
              className="border p-2 w-full"
              value={ingredient.servingSize}
              onChange={(e) =>
                setIngredient({
                  ...ingredient,
                  servingSize: Number(e.target.value),
                })
              }
            />
          </label>
          <label className="flex-1">
            Unit:
            <input
              className="border p-2 w-full"
              value={ingredient.servingUnit}
              onChange={(e) =>
                setIngredient({ ...ingredient, servingUnit: e.target.value })
              }
              placeholder="g, ml, cup, slice, etc."
            />
          </label>
        </div>
        <label className="block mb-2">
          Calories per serving:
          <input
            type="number"
            step="any"
            className="border p-2 w-full"
            value={ingredient.caloriesPerServing}
            onChange={(e) =>
              setIngredient({
                ...ingredient,
                caloriesPerServing: Number(e.target.value),
              })
            }
          />
        </label>
        <label className="block mb-2">
          Protein per serving:
          <input
            type="number"
            step="any"
            className="border p-2 w-full"
            value={ingredient.proteinPerServing}
            onChange={(e) =>
              setIngredient({
                ...ingredient,
                proteinPerServing: Number(e.target.value),
              })
            }
          />
        </label>
        <label className="block mb-2">
          Carbs per serving:
          <input
            type="number"
            step="any"
            className="border p-2 w-full"
            value={ingredient.carbsPerServing}
            onChange={(e) =>
              setIngredient({
                ...ingredient,
                carbsPerServing: Number(e.target.value),
              })
            }
          />
        </label>
        <label className="block mb-2">
          Fat per serving:
          <input
            type="number"
            step="any"
            className="border p-2 w-full"
            value={ingredient.fatPerServing}
            onChange={(e) =>
              setIngredient({
                ...ingredient,
                fatPerServing: Number(e.target.value),
              })
            }
          />
        </label>
        <div className="flex justify-end mt-4">
          <button
            className="anime-btn bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => {
              onSave(ingredient);
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
