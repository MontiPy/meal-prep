"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
    const fetchGoal = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().dailyGoal) {
        setCalorieGoal(snap.data().dailyGoal);
      }
    };
    fetchGoal();
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
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[1fr_340px]">
        <main className="p-4 overflow-auto flex flex-col items-center">
          <div className="mb-4">
            <MacroGoalControl
              calorieGoal={calorieGoal}
              // setCalorieGoal={setCalorieGoal}
              macroPercents={macroPercents}
              setMacroPercents={setMacroPercents}
            />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-center">Single Day Meal Plan</h1>
          <SingleDayPlan
            meals={meals}
            onRemoveItem={handleRemoveItem}
            calorieGoal={calorieGoal}
            macroPercents={macroPercents}
          />
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
      </div>
    </DndContext>
  );
}
