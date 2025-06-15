"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

function DraggableSidebarItem({ item, type }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: type + "-" + item.id,
    data: { ...item, type },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`mb-1 p-1 bg-gray-50 border border-gray-200 rounded shadow-sm cursor-grab flex items-center text-xs
        ${isDragging ? "opacity-60" : ""}
        ${type === "ingredient" ? "pl-2 pr-2" : "pl-2 pr-2"}
      `}
      style={{
        minHeight: "24px",
        fontWeight: type === "recipe" ? "500" : "400",
      }}
    >
      <span className="truncate">{item.name}</span>
      {type === "recipe" && (
        <span className="ml-1 text-[9px] text-blue-600 bg-blue-50 rounded px-1 py-[1px]">
          [Recipe]
        </span>
      )}
    </div>
  );
}

function getIngredientNutrition(item) {
  // Using per serving as default (can extend for quantity later)
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
  // For now, assume the recipe object contains per serving info. You can update this later.
  return item.macrosPerServing
    ? {
        kcal: item.macrosPerServing.kcal,
        p: item.macrosPerServing.p,
        c: item.macrosPerServing.c,
        f: item.macrosPerServing.f,
      }
    : item.perServing
    ? {
        kcal: item.perServing.calories,
        p: item.perServing.protein,
        c: item.perServing.carbs,
        f: item.perServing.fat,
      }
    : null;
}

function DroppableCell({ day, meal, items, onRemoveItem }) {
  const id = `${day}-${meal}`;
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <td>
      <div
        ref={setNodeRef}
        className={`min-h-[40px] border rounded ${isOver ? "bg-blue-100" : ""}`}
      >
        {(items || []).map((i, idx) => {
          const nutrition =
            i.type === "ingredient"
              ? getIngredientNutrition(i)
              : getRecipeNutrition(i);

          return (
            <div
              key={i.id + idx}
              className={`bg-gray-100 m-1 px-2 py-1 rounded flex items-center justify-between ${
                i.type === "ingredient" ? "text-xs" : ""
              }`}
              style={{
                minHeight: i.type === "ingredient" ? "28px" : "38px",
              }}
            >
              <span className="flex flex-col">
                <span className="font-medium flex items-center">
                  {i.name}
                  {i.type === "recipe" && (
                    <span className="ml-1 text-xs text-blue-600">[Recipe]</span>
                  )}
                </span>
                {nutrition && (
                  <span className="text-[10px] text-gray-600">
                    {nutrition.kcal} kcal / {nutrition.p}p / {nutrition.c}c /{" "}
                    {nutrition.f}f
                  </span>
                )}
              </span>
              <button
                className="ml-2 text-red-600 font-bold text-lg"
                title="Remove"
                onClick={() => onRemoveItem(day, meal, idx)}
                type="button"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </td>
  );
}

export default function MealPlanPage() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [meals, setMeals] = useState(() => {
    const initial = {};
    DAYS.forEach((day) => {
      initial[day] = {};
      MEALS.forEach((meal) => {
        initial[day][meal] = [];
      });
    });
    return initial;
  });
  const [dragItem, setDragItem] = useState(null);
  const [matchAll, setMatchAll] = useState(false);

  // Fetch ingredients and recipes
  useEffect(() => {
    const fetchAll = async () => {
      const ingSnap = await getDocs(collection(db, "ingredients"));
      setIngredients(
        ingSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "ingredient",
        }))
      );
      const recSnap = await getDocs(collection(db, "recipes"));
      setRecipes(
        recSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "recipe",
        }))
      );
    };
    fetchAll();
  }, []);

  // Drag and drop handlers
  const handleDragStart = (event) => {
    setDragItem(event.active.data.current);
  };
  const handleDragEnd = (event) => {
    setDragItem(null);
    if (!event.over) return;
    const [day, meal] = event.over.id.split("-");
    setMeals((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const already = updated[day][meal].find(
        (i) =>
          i.id === event.active.data.current.id &&
          i.type === event.active.data.current.type
      );
      if (already) return prev;
      updated[day][meal].push(event.active.data.current);
      // If matchAll and first day, copy
      if (matchAll && day === DAYS[0]) {
        DAYS.slice(1).forEach((otherDay) => {
          updated[otherDay][meal] = [...updated[day][meal]];
        });
      }
      return updated;
    });
  };

  const handleRemoveItem = (day, meal, idx) => {
    setMeals((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[day][meal].splice(idx, 1);
      return updated;
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <main className="flex-1 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold mb-2">Meal Plan</h1>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={matchAll}
                onChange={(e) => setMatchAll(e.target.checked)}
              />
              Make all days match {DAYS[0]}
            </label>
          </div>
          <div className="overflow-auto">
            <table className="min-w-[700px] w-full border text-xs md:text-base">
              <thead>
                <tr>
                  <th className="border p-2">Day</th>
                  {MEALS.map((meal) => (
                    <th key={meal} className="border p-2">
                      {meal}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day}>
                    <td className="border p-2 font-bold">{day}</td>
                    {MEALS.map((meal) => (
                      <DroppableCell
                        key={meal}
                        day={day}
                        meal={meal}
                        items={meals[day][meal]}
                        onRemoveItem={handleRemoveItem}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DragOverlay>
            {dragItem && (
              <div className="p-2 bg-white rounded shadow border-2 border-blue-500 opacity-90">
                {dragItem.name}
                {dragItem.type === "recipe" ? (
                  <span className="ml-1 text-xs text-blue-600">[Recipe]</span>
                ) : null}
              </div>
            )}
          </DragOverlay>
        </main>
        {/* Sidebar */}
        <aside className="md:w-[200px] w-full md:border-l border-t md:border-t-0 flex flex-col sticky top-0 right-0 max-h-screen h-screen bg-gray-50 z-10">
          <div className="flex flex-col h-full">
            {/* Recipes 1/3 */}
            <div
              className="overflow-y-auto border-b p-2"
              style={{ height: "33%" }}
            >
              <h2 className="font-bold mb-2">Recipes</h2>
              {recipes.map((item) => (
                <DraggableSidebarItem key={item.id} item={item} type="recipe" />
              ))}
            </div>
            {/* Ingredients 2/3 */}
            <div className="overflow-y-auto p-2 flex-1">
              <h2 className="font-bold mb-2">Ingredients</h2>
              {ingredients.map((item) => (
                <DraggableSidebarItem
                  key={item.id}
                  item={item}
                  type="ingredient"
                />
              ))}
            </div>
          </div>
        </aside>
      </DndContext>
    </div>
  );
}
