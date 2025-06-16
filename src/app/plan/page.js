"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
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
    protein: 40,
    carbs: 35,
    fat: 25,
  });
  const [dragItem, setDragItem] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const fetchGoal = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.dailyGoal) {
          setCalorieGoal(data.dailyGoal);
        }
        if (data.macroPercents) {
          setMacroPercents({
            protein: data.macroPercents.protein ?? 30,
            carbs: data.macroPercents.carbs ?? 40,
            fat: data.macroPercents.fat ?? 30,
          });
        }
        if (data.mealPlan) {
          setMeals(data.mealPlan);
        }
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
    const data = event.active.data.current;
    setMeals((prev) => {
      const updated = { ...prev };
      const already = updated[meal].find(
        (i) => i.id === data.id && i.type === data.type
      );
      if (already) return prev;

      let newItem = { ...data };
      if (newItem.type === "ingredient") {
        if (newItem.servingSize) {
          newItem.grams = newItem.servingSize;
        }
      }

      updated[meal] = [...updated[meal], newItem];
      return updated;
    });
  };

  const handleUpdateItem = (meal, idx, fields) => {
    setMeals((prev) => {
      const updated = { ...prev };
      updated[meal] = updated[meal].map((item, i) =>
        i === idx ? { ...item, ...fields } : item
      );
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

  const handleSavePlan = async () => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), { mealPlan: meals }, { merge: true });
    setSaveStatus("Saved!");
    setTimeout(() => setSaveStatus("");, 2000);
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
          <h1 className="text-2xl font-bold mb-4 text-center">
            Single Day Meal Plan
          </h1>
          <SingleDayPlan
            meals={meals}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
            calorieGoal={calorieGoal}
            macroPercents={macroPercents}
          />
          <button
            onClick={handleSavePlan}
            className="anime-btn mt-4 px-4 py-2 bg-green-600 text-white"
          >
            Save Plan
          </button>
          {saveStatus && <div className="mt-2 text-sm">{saveStatus}</div>}
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
