"use client";
import { useDroppable } from "@dnd-kit/core";
import MealItemCard from "./MealItemCard";

export default function SingleMealDropCell({ meal, items, onRemoveItem, onUpdateItem }) {
  const id = `SingleDay-${meal}`;
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <td>
      <div
        ref={setNodeRef}
        className={`min-h-[40px] border rounded ${
          isOver ? "bg-blue-100" : ""
        } flex flex-wrap gap-1`}
      >
        {(items || []).map((i, idx) => (
          <MealItemCard
            key={i.id + idx}
            item={i}
            onRemove={() => onRemoveItem(meal, idx)}
            onUpdate={(fields) => onUpdateItem(meal, idx, fields)}
          />
        ))}
      </div>
    </td>
  );
}
