"use client";
import SidebarItem from "./SidebarItem";

export default function Sidebar({ ingredients, recipes }) {
  return (
    <aside className="md:w-[340px] w-full md:border-l border-t md:border-t-0 flex flex-col sticky top-0 right-0 max-h-screen h-screen bg-gray-50 z-10">
      <div className="flex flex-col h-full">
        <div className="overflow-y-auto border-b p-2" style={{ height: "33%" }}>
          <h2 className="font-bold mb-2 text-xs">Recipes</h2>
          {recipes.map((item) => (
            <SidebarItem key={item.id} item={item} type="recipe" />
          ))}
        </div>
        <div className="overflow-y-auto p-2 flex-1">
          <h2 className="font-bold mb-2 text-xs">Ingredients</h2>
          {ingredients.map((item) => (
            <SidebarItem key={item.id} item={item} type="ingredient" />
          ))}
        </div>
      </div>
    </aside>
  );
}
