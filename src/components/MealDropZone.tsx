"use client";
import React from "react";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { IngredientCard } from "./IngredientCard";
import RemoveButton from "./RemoveButton";
import { Ingredient, MealIngredient } from "../types";

interface Props {
  mealName: string;
  ingredients: MealIngredient[];
  onServingChange: (idx: number, newServing: number) => void;
  onRemove: (idx: number) => void;
  onDrop: (ingredient: Ingredient) => void;
  activeId: string | null;
}

export const MealDropZone: React.FC<Props> = ({
  mealName,
  ingredients,
  onServingChange,
  onRemove,
  onDrop,
  activeId,
}) => (
  <Paper
    sx={{
      p: 2,
      minHeight: 180,
      borderRadius: 2,
      textAlign: "center",
      border: activeId ? "3px solid #1976d2" : "2px dashed #90caf9",
      bgcolor: activeId ? "#e3f2fd" : "#fafbfc",
      transition: "all 0.2s",
    }}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      if (activeId) onDrop({ id: activeId } as Ingredient); // We'll match ID in parent
    }}
  >
    <Typography variant="h6" sx={{ mb: 1 }}>
      {mealName}
    </Typography>
    {ingredients.length === 0 ? (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Drag ingredients here
      </Typography>
    ) : (
      ingredients.map((mi, idx) => (
        <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <IngredientCard
              ingredient={mi.ingredient}
              serving={mi.serving}
              onServingChange={(val) => onServingChange(idx, val)}
            />
          </Box>
          <Chip
            label={`x${mi.serving}`}
            color="primary"
            size="small"
            sx={{ ml: 1 }}
          />
          <RemoveButton onClick={() => onRemove(idx)} />
        </Box>
      ))
    )}
  </Paper>
);
