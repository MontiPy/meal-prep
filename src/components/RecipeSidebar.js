import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import RecipeModal from "./RecipeModal";

export default function RecipeSidebar({ ingredients }) {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);

  const fetchRecipes = async () => {
    const snapshot = await getDocs(collection(db, "recipes"));
    setRecipes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSave = async (recipe) => {
    if (editRecipe) {
      await updateDoc(doc(db, "recipes", editRecipe.id), recipe);
    } else {
      await addDoc(collection(db, "recipes"), recipe);
    }
    setEditRecipe(null);
    setShowModal(false);
    fetchRecipes();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "recipes", id));
    fetchRecipes();
  };

  return (
    <aside className="w-full md:w-[350px] bg-gray-50 border-l p-4 fixed md:static right-0 top-0 bottom-0 z-30 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recipe Builder</h2>
        <button
          className="anime-btn bg-blue-600 text-white px-2 py-1 rounded"
          onClick={() => {
            setEditRecipe(null);
            setShowModal(true);
          }}
        >
          + Add Recipe
        </button>
      </div>
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
    </aside>
  );
}
