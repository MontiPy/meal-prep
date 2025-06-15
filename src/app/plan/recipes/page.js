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
import RecipeModal from "@/components/RecipeModal";

export default function RecipeBuilderPage() {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  // Fetch ingredients and recipes
  useEffect(() => {
    const fetchAll = async () => {
      const ingSnap = await getDocs(collection(db, "ingredients"));
      setIngredients(
        ingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      const recSnap = await getDocs(collection(db, "recipes"));
      setRecipes(recSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchAll();
  }, []);

  const handleSave = async (recipe) => {
    if (editRecipe) {
      await updateDoc(doc(db, "recipes", editRecipe.id), recipe);
    } else {
      await addDoc(collection(db, "recipes"), recipe);
    }
    setEditRecipe(null);
    setShowModal(false);
    // Refresh list
    const recSnap = await getDocs(collection(db, "recipes"));
    setRecipes(recSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "recipes", id));
    setRecipes(recipes.filter((r) => r.id !== id));
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Recipe Builder</h1>
      <button
        className="anime-btn bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditRecipe(null);
          setShowModal(true);
        }}
      >
        + Add Recipe
      </button>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id} className="border-b pb-2 mb-2">
            <div className="font-semibold">{recipe.name}</div>
            <div className="text-xs text-gray-600 mb-1">
              Servings: {recipe.servings}
            </div>
            <button
              className="anime-btn px-2 text-sm"
              onClick={() => {
                setEditRecipe(recipe);
                setShowModal(true);
              }}
            >
              Edit
            </button>
            <button
              className="anime-btn px-2 text-red-600 text-sm"
              onClick={() => handleDelete(recipe.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <RecipeModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditRecipe(null);
        }}
        onSave={handleSave}
        initial={editRecipe}
        ingredients={ingredients}
      />
    </main>
  );
}
