"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext";

export default function ShoppingPage() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState({});
  const [mealPlan, setMealPlan] = useState(null);
  const [days, setDays] = useState(1);
  const [planList, setPlanList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    const fetchIngredients = async () => {
      const snap = await getDocs(collection(db, "ingredients"));
      const map = {};
      snap.docs.forEach((d) => {
        map[d.id] = { id: d.id, ...d.data() };
      });
      setIngredients(map);
    };
    fetchIngredients();
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setMealPlan(snap.data().mealPlan || null);
      }
    };
    fetchPlan();
  }, [user]);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return;
      const snap = await getDocs(collection(db, "users", user.uid, "plans"));
      setPlanList(snap.docs.map((d) => d.id));
    };
    fetchPlans();
  }, [user]);

  const handleLoadPlan = async (name) => {
    if (!user || !name) return;
    const snap = await getDoc(doc(db, "users", user.uid, "plans", name));
    if (snap.exists()) {
      const data = snap.data();
      setMealPlan(data.meals || null);
    }
  };

  const totals = {};
  if (mealPlan) {
    Object.values(mealPlan).forEach((items) => {
      items.forEach((item) => {
        if (item.type === "ingredient") {
          const grams = Number(item.grams || ingredients[item.id]?.servingSize || 0);
          totals[item.id] = (totals[item.id] || 0) + grams;
        } else if (item.type === "recipe" && item.items) {
          item.items.forEach((ri) => {
            const grams = Number(ri.grams || 0) / (item.servings || 1);
            totals[ri.ingredientId] = (totals[ri.ingredientId] || 0) + grams;
          });
        }
      });
    });
  }

  const groceryList = Object.entries(totals).map(([id, g]) => {
    const ing = ingredients[id] || {};
    const unit = ing.servingUnit || "g";
    const amount = g * days;
    const isGramUnit = unit.toLowerCase().startsWith("g");
    return {
      id,
      name: ing.name || id,
      amount,
      unit,
      lbs: isGramUnit ? amount / 453.592 : null,
    };
  });

  return (
    <main className="flex flex-col items-center min-h-screen p-8" style={{ background: "var(--anime-bg)" }}>
      <div className="anime-card w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-4 font-heading text-center">Shopping List</h1>
        <div className="mb-4 text-center">
          <label className="mr-2 font-semibold">Days:</label>
          <div className="inline-flex gap-1">
            {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setDays(n)}
                className={`anime-btn px-2 py-1 text-sm ${days === n ? "bg-blue-600 text-white" : ""}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        {planList.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <select
              className="border px-2 py-1 flex-1"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="">Load plan...</option>
              {planList.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleLoadPlan(selectedPlan)}
              className="anime-btn px-2"
            >
              Load
            </button>
          </div>
        )}
        {groceryList.length === 0 ? (
          <div className="text-center mb-4">No saved meal plan.</div>
        ) : (
          <ul className="mb-4">
            {groceryList.map((item) => (
              <li key={item.id} className="flex items-center gap-2 mb-1">
                <input type="checkbox" className="mr-2" />
                <span className="flex-1">
                  {item.name} - {item.amount.toFixed(0)} {item.unit}
                  {item.lbs !== null && ` (${item.lbs.toFixed(2)} lbs)`}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/" className="anime-btn inline-block text-center w-full">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
