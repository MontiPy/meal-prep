"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import Sidebar from "@/components/Sidebar";
import SingleDayPlan from "@/components/SingleDayPlan";
import MacroGoalControl from "@/components/MacroGoalControl";
import { useAuth } from "../AuthContext"; // Adjust path as needed

const MEALS = ["Breakfast", "Lunch", "Dinner"];

export default function SingleDayMealPlanPage() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [meals, setMeals] = useState(() => {
    const initial = {};
    MEALS.forEach((meal) => {
      initial[meal] = [];
    });
    return initial;
  });
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [macroPercents, setMacroPercents] = useState({
    protein: 30,
    carbs: 40,
    fat: 30,
  });
  const [dragItem, setDragItem] = useState(null);

  useEffect(() => {
    if (user && user.dailyGoal) {
      setCalorieGoal(user.dailyGoal);
    }
  }, [user]);

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
    const meal = event.over.id.replace("SingleDay-", "");
    setMeals((prev) => {
      const updated = { ...prev };
      const already = updated[meal].find(
        (i) =>
          i.id === event.active.data.current.id &&
          i.type === event.active.data.current.type
      );
      if (already) return prev;
      updated[meal] = [...updated[meal], event.active.data.current];
      return updated;
    });
  };

  const handleRemoveItem = (meal, idx) => {
    setMeals((prev) => {
      const updated = { ...prev };
      updated[meal].splice(idx, 1);
      return updated;
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MacroGoalControl
        calorieGoal={calorieGoal}
        // setCalorieGoal={setCalorieGoal}
        macroPercents={macroPercents}
        setMacroPercents={setMacroPercents}
      />
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <main className="flex-1 p-4 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Single Day Meal Plan</h1>
          <SingleDayPlan meals={meals} onRemoveItem={handleRemoveItem} />
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
              </div>
            )}
          </DragOverlay>
        </main>
        <Sidebar ingredients={ingredients} recipes={recipes} />
      </DndContext>
    </div>
  );
}
