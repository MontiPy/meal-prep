"use client";
import { useDraggable } from "@dnd-kit/core";

function getSidebarMacros(item) {
  if (item.type === "ingredient" && item.caloriesPerServing !== undefined) {
    return {
      kcal: item.caloriesPerServing,
      p: item.proteinPerServing,
      c: item.carbsPerServing,
      f: item.fatPerServing,
    };
  }
  if (item.type === "recipe" && item.macrosPerServing) {
    return item.macrosPerServing;
  }
  if (item.type === "recipe" && item.perServing) {
    return {
      kcal: item.perServing.calories,
      p: item.perServing.protein,
      c: item.perServing.carbs,
      f: item.perServing.fat,
    };
  }
  return null;
}

export default function SidebarItem({ item, type }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: type + "-" + item.id,
    data: { ...item, type },
  });
  const macros = getSidebarMacros(item);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        mb-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded shadow-sm cursor-grab 
        inline-flex flex-col items-start text-xs
        ${isDragging ? "opacity-60" : ""}
      `}
      style={{
        minHeight: "28px",
        fontWeight: type === "recipe" ? "500" : "400",
        display: "inline-flex",
        alignItems: "flex-start",
      }}
    >
      <div className="flex items-center gap-x-1 whitespace-nowrap">
        <span>{item.name}</span>
        {type === "recipe" && (
          <span className="text-[9px] text-blue-600 bg-blue-50 rounded px-1 py-[1px]">
            [Recipe]
          </span>
        )}
      </div>
      {macros && (
        <span className="text-[10px] text-gray-500 mt-[1px] whitespace-nowrap">
          {macros.kcal} kcal / {macros.p}p / {macros.c}c / {macros.f}f
        </span>
      )}
    </div>
  );
}
