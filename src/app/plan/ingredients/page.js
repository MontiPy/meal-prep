"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import IngredientModal from "@/components/IngredientModal";

export default function IngredientLibraryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIngredient, setEditIngredient] = useState(null);

  const fetchIngredients = async () => {
    const snapshot = await getDocs(collection(db, "ingredients"));
    setIngredients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleSave = async (ingredient) => {
    if (editIngredient) {
      await updateDoc(doc(db, "ingredients", editIngredient.id), ingredient);
    } else {
      await addDoc(collection(db, "ingredients"), ingredient);
    }
    setEditIngredient(null);
    setShowModal(false);
    fetchIngredients();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "ingredients", id));
    fetchIngredients();
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Ingredient Library</h1>
      <button
        className="anime-btn bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditIngredient(null);
          setShowModal(true);
        }}
      >
        + Add Ingredient
      </button>
      <ul>
        {ingredients.map((ing) => (
          <li key={ing.id} className="flex items-center gap-2 border-b py-2">
            <span className="flex-1 font-semibold">{ing.name}</span>
            <span className="text-sm text-gray-600">
              {ing.caloriesPerServing} kcal / {ing.proteinPerServing}p /{" "}
              {ing.carbsPerServing}c / {ing.fatPerServing}f per{" "}
              {ing.servingSize}
              {ing.servingUnit}
            </span>
            <button
              className="anime-btn px-2"
              onClick={() => {
                setEditIngredient(ing);
                setShowModal(true);
              }}
            >
              Edit
            </button>
            <button
              className="anime-btn px-2 text-red-600"
              onClick={() => handleDelete(ing.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <IngredientModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditIngredient(null);
        }}
        onSave={handleSave}
        initial={editIngredient}
      />
    </main>
  );
}
