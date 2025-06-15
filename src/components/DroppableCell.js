"use client";
import { useDroppable } from "@dnd-kit/core";
import MealItemCard from "./MealItemCard";

export default function DroppableCell({ day, meal, items, onRemoveItem }) {
  const id = `${day}-${meal}`;
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
            onRemove={() => onRemoveItem(day, meal, idx)}
          />
        ))}
      </div>
    </td>
  );
}
