"use client";
import { useEffect, useState, useContext, use } from "react";
import { db } from "@/lib/firebase"; // Update path if needed
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../AuthContext"; // Adjust if your context is elsewhere

export default function MealPlanPage() {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    date: "",
    meals: [
      {
        name: "",
        items: [{ name: "", quantity: 0, unit: "" }],
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    ],
  });

  const handleAddMealPlan = async () => {
    if (!user) return;
    await addDoc(collection(db, "mealPlans"), {
      ...newPlan,
      userId: user.uid,
    });
    setShowModal(false);
    // Optionally re-fetch or optimistically update mealPlans here
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchMealPlans = async () => {
      const q = query(
        collection(db, "mealPlans"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      setMealPlans(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchMealPlans();
  }, [user]);

  // TODO: Add handlers for add/edit/delete (show modal, etc.)

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Meal Plan</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        mealPlans.map((plan) => (
          <div key={plan.id} className="mb-6 p-4 rounded shadow bg-white">
            <div className="font-bold">{plan.date}</div>
            {plan.meals?.map((meal) => (
              <div key={meal.name} className="ml-2">
                <span className="font-semibold">{meal.name}</span>:{" "}
                {meal.items.map((item) => (
                  <span key={item.name}>
                    {item.name} ({item.quantity}
                    {item.unit}){" "}
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  kcal: {meal.calories}
                </span>
              </div>
            ))}
          </div>
        ))
      )}
      <button
        className="anime-btn bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        + New Meal Plan
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Meal Plan</h2>
            <label className="block mb-2">
              Date:
              <input
                type="date"
                className="border p-2 w-full"
                value={newPlan.date}
                onChange={(e) =>
                  setNewPlan((plan) => ({ ...plan, date: e.target.value }))
                }
              />
            </label>
            {/* Expand: Map over meals, allow editing/adding meals/items */}
            <button
              className="anime-btn bg-green-600 text-white px-4 py-2 rounded mt-4"
              onClick={handleAddMealPlan}
            >
              Save Meal Plan
            </button>
            <button
              className="ml-2 anime-btn px-4 py-2"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
