"use client";
import SidebarItem from "./SidebarItem";
import { useDroppable } from "@dnd-kit/core";

export default function Sidebar({ ingredients, recipes }) {
  const {
    setNodeRef: recipesRef,
    isOver: overRecipes,
  } = useDroppable({ id: "Sidebar-recipes" });
  const {
    setNodeRef: ingRef,
    isOver: overIngredients,
  } = useDroppable({ id: "Sidebar-ingredients" });

  return (
    <aside className="md:w-[340px] w-full md:border-l border-t md:border-t-0 flex flex-col sticky top-0 right-0 h-screen bg-gray-50 z-10">
      <div className="flex flex-col h-full">
        <div
          ref={recipesRef}
          className={`overflow-y-auto border-b p-2 ${overRecipes ? "bg-blue-50" : ""}`}
          style={{ height: "33%" }}
        >
          <h2 className="font-bold mb-2 text-xs">Recipes</h2>
          {recipes.map((item) => (
            <SidebarItem key={item.id} item={item} type="recipe" />
          ))}
        </div>
        <div
          ref={ingRef}
          className={`overflow-y-auto p-2 flex-1 ${overIngredients ? "bg-blue-50" : ""}`}
        >
          <h2 className="font-bold mb-2 text-xs">Ingredients</h2>
          {ingredients.map((item) => (
            <SidebarItem key={item.id} item={item} type="ingredient" />
          ))}
        </div>
      </div>
    </aside>
  );
}
