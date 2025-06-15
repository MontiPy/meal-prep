"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import Sidebar from "@/components/Sidebar";
import MealPlanGrid from "@/components/MealPlanGrid";

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
          <MealPlanGrid meals={meals} onRemoveItem={handleRemoveItem} />
          <DragOverlay>
            {dragItem && (
              <div className="p-2 bg-white rounded shadow border-2 border-blue-500 opacity-90 text-xs inline-flex flex-col items-start">
                <div className="flex items-center gap-x-1 whitespace-nowrap">
                  <span>{dragItem.name}</span>
                  {dragItem.type === "recipe" && (
                    <span className="text-[9px] text-blue-600 bg-blue-50 rounded px-1 py-[1px]">
                      [Recipe]
                    </span>
                  )}
                </div>
                {/* Optional: show macros here too if you like */}
              </div>
            )}
          </DragOverlay>
        </main>
        <Sidebar ingredients={ingredients} recipes={recipes} />
      </DndContext>
    </div>
  );
}
