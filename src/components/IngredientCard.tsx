"use client";
import React from "react";
import { Card, CardContent, Typography, TextField } from "@mui/material";
import { Ingredient } from "../types";

interface Props {
  ingredient: Ingredient;
  serving: number;
  onServingChange?: (newServing: number) => void;
}

export const IngredientCard: React.FC<Props> = ({
  ingredient,
  serving,
  onServingChange,
}) => {
  const factor = serving / ingredient.defaultServing;

  return (
    <Card sx={{ mb: 2, minWidth: 220 }}>
      <CardContent>
        <Typography variant="h6">{ingredient.name}</Typography>
        <Typography variant="body2">
          {Math.round(ingredient.calories * factor)} kcal | Protein:{" "}
          {Math.round(ingredient.protein * factor)}g | Fat:{" "}
          {Math.round(ingredient.fat * factor)}g | Carbs:{" "}
          {Math.round(ingredient.carbs * factor)}g
        </Typography>
        <TextField
          label={`Serving (${ingredient.unit})`}
          type="number"
          value={serving}
          size="small"
          sx={{ mt: 1, width: 100 }}
          onChange={(e) =>
            onServingChange && onServingChange(Number(e.target.value))
          }
        />
      </CardContent>
    </Card>
  );
};
