"use client";
import DroppableCell from "./DroppableCell";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

export default function MealPlanGrid({ meals, onRemoveItem }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-[700px] w-full border text-xs md:text-base">
        <thead>
          <tr>
            <th className="border p-2">Day</th>
            {MEALS.map((meal) => (
              <th key={meal} className="border p-2">
                {meal}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map((day) => (
            <tr key={day}>
              <td className="border p-2 font-bold">{day}</td>
              {MEALS.map((meal) => (
                <DroppableCell
                  key={meal}
                  day={day}
                  meal={meal}
                  items={meals[day][meal]}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
