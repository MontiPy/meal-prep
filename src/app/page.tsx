"use client";
import React, { useState, useEffect } from "react";
import { INGREDIENTS } from "../data/ingredients";
import { IngredientCard } from "../components/IngredientCard";
import { TDEEForm } from "../components/TDEEForm";
import RemoveButton from "../components/RemoveButton";
import { DndContext } from "@dnd-kit/core";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  Chip,
  Snackbar,
  Alert,
  Slide,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";

function sumNutrition(mealIngredients: any[]) {
  return mealIngredients.reduce(
    (totals, mi) => {
      const factor = mi.serving / mi.ingredient.defaultServing;
      return {
        calories: totals.calories + mi.ingredient.calories * factor,
        protein: totals.protein + mi.ingredient.protein * factor,
        fat: totals.fat + mi.ingredient.fat * factor,
        carbs: totals.carbs + mi.ingredient.carbs * factor,
      };
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export default function HomePage() {
  // SSR-safe localStorage: always initialize empty, then load client-side
  const [mealIngredients, setMealIngredients] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [tdee, setTdee] = useState<number | null>(null);
  const [calTarget, setCalTarget] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "info" | "error";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  // Responsive
  const isMobile = useMediaQuery("(max-width:900px)");

  // On mount: load meal from localStorage, then render
  useEffect(() => {
    try {
      const loaded = JSON.parse(
        localStorage.getItem("mealIngredients") || "[]"
      );
      setMealIngredients(loaded);
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Save mealIngredients to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("mealIngredients", JSON.stringify(mealIngredients));
    }
  }, [mealIngredients, loaded]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    if (event.over && event.over.id === "meal-dropzone" && activeId) {
      const ing = INGREDIENTS.find((i) => i.id === activeId);
      if (ing) {
        setMealIngredients((prev: any) => [
          ...prev,
          { ingredient: ing, serving: ing.defaultServing },
        ]);
        setSnack({
          open: true,
          msg: `${ing.name} added to meal!`,
          type: "success",
        });
      }
    }
    setActiveId(null);
  };

  const removeIngredient = (idx: number) => {
    const removed = mealIngredients[idx]?.ingredient?.name;
    setMealIngredients((prev: any) => prev.filter((_, i) => i !== idx));
    setSnack({
      open: true,
      msg: `${removed} removed from meal`,
      type: "info",
    });
  };

  const totals = sumNutrition(mealIngredients);

  // Wait for localStorage hydration
  if (!loaded) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f4f6fb",
        }}
      >
        <CircularProgress size={48} thickness={5} color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #e3f2fd 30%, #f4f6fb 100%)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: isMobile ? "stretch" : "flex-start",
        py: 4,
        px: isMobile ? 1 : 4,
        gap: isMobile ? 0 : 5,
        fontFamily: "Inter, Roboto, sans-serif",
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={4}
        sx={{
          width: isMobile ? "100%" : 350,
          minHeight: 500,
          p: isMobile ? 2 : 3,
          mb: isMobile ? 2 : 0,
          borderRadius: 4,
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          color="primary"
          align="center"
          mb={2}
          sx={{
            letterSpacing: 1.2,
            textShadow: "0 2px 8px #90caf950",
          }}
        >
          Meal Prep Planner
        </Typography>
        <TDEEForm
          onTDEEChange={(tdeeVal, kcalTargetVal) => {
            setTdee(tdeeVal);
            setCalTarget(kcalTargetVal);
          }}
        />

        {tdee && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: "#e3f2fd", boxShadow: "none" }}>
            <Typography variant="body1" fontWeight={600}>
              TDEE: {tdee} kcal
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              Target: {calTarget} kcal
            </Typography>
          </Paper>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Ingredients
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: 300,
            pr: 1,
            mb: 1.5,
            borderRadius: 2,
            bgcolor: "#f5faff",
            boxShadow: "0 2px 12px #90caf920",
          }}
        >
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <List disablePadding>
              {INGREDIENTS.map((ingredient) => (
                <ListItem
                  key={ingredient.id}
                  disableGutters
                  disablePadding
                  sx={{
                    mb: 1,
                    cursor: "grab",
                    borderRadius: 2,
                    bgcolor:
                      activeId === ingredient.id ? "#bbdefb" : "transparent",
                    transition: "background 0.2s",
                  }}
                  draggable
                  onDragStart={() => setActiveId(ingredient.id)}
                  onDragEnd={() => setActiveId(null)}
                >
                  <IngredientCard
                    ingredient={ingredient}
                    serving={ingredient.defaultServing}
                  />
                </ListItem>
              ))}
            </List>
          </DndContext>
        </Box>
        <Typography variant="caption" color="text.secondary" align="center">
          Drag to meal area to add!
        </Typography>
      </Paper>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minWidth: isMobile ? "100%" : 380,
          maxWidth: 600,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: isMobile ? 2 : 4,
            minHeight: 560,
            borderRadius: 4,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            id="meal-dropzone"
            sx={{
              width: "100%",
              minHeight: 330,
              border: activeId ? "3px solid #1976d2" : "2px dashed #90caf9",
              borderRadius: 3,
              bgcolor: activeId ? "#e3f2fd" : "#f7fbff",
              p: isMobile ? 2 : 3,
              transition: "background 0.15s, border 0.15s",
              mb: 4,
              boxShadow: activeId
                ? "0 0 16px 2px #1976d280"
                : "0 2px 12px #90caf920",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (activeId) {
                const ing = INGREDIENTS.find((i) => i.id === activeId);
                if (ing) {
                  setMealIngredients((prev: any) => [
                    ...prev,
                    { ingredient: ing, serving: ing.defaultServing },
                  ]);
                  setSnack({
                    open: true,
                    msg: `${ing.name} added to meal!`,
                    type: "success",
                  });
                }
                setActiveId(null);
              }
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              align="center"
              mb={2}
              sx={{
                color: activeId ? "primary.main" : "text.primary",
                textShadow: activeId ? "0 2px 8px #1976d222" : "none",
              }}
            >
              Meal (Drop Here)
            </Typography>
            {mealIngredients.length === 0 ? (
              <Typography align="center" color="text.secondary">
                Drag ingredients here to start building your meal!
              </Typography>
            ) : (
              mealIngredients.map((mi, idx) => (
                <Slide
                  in
                  direction="up"
                  timeout={350 + idx * 70}
                  key={idx}
                  mountOnEnter
                  unmountOnExit
                >
                  <Box
                    sx={{
                      mb: 2,
                      p: 0,
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 2,
                      bgcolor: "#e3f2fd",
                      boxShadow: "0 1px 6px #90caf950",
                      transition: "all 0.18s",
                      minHeight: 80,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <IngredientCard
                        ingredient={mi.ingredient}
                        serving={mi.serving}
                        onServingChange={(val) => {
                          const next = [...mealIngredients];
                          next[idx].serving = val;
                          setMealIngredients(next);
                        }}
                      />
                    </Box>
                    <Chip
                      label={`x${mi.serving}`}
                      color="primary"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        ml: 1,
                        fontSize: 14,
                        bgcolor: "white",
                        borderRadius: 2,
                      }}
                    />
                    <RemoveButton onClick={() => removeIngredient(idx)} />
                  </Box>
                </Slide>
              ))
            )}
          </Box>

          {/* Nutrition Summary */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#e3f2fd",
              width: "100%",
              textAlign: "center",
              mt: "auto",
              boxShadow: "0 1px 8px #90caf950",
            }}
          >
            <Typography variant="h6" fontWeight={800} gutterBottom>
              Meal Totals
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              Calories: <b>{Math.round(totals.calories)}</b> kcal
              <br />
              Protein: <b>{Math.round(totals.protein)}</b> g
              <br />
              Fat: <b>{Math.round(totals.fat)}</b> g
              <br />
              Carbs: <b>{Math.round(totals.carbs)}</b> g
            </Typography>
            {calTarget && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  color:
                    Math.round(totals.calories) > calTarget
                      ? "error.main"
                      : "success.main",
                }}
              >
                {Math.round(totals.calories) > calTarget
                  ? `⚠️ Over your target by ${Math.round(
                      totals.calories - calTarget
                    )} kcal`
                  : `✅ Under your target by ${Math.round(
                      calTarget - totals.calories
                    )} kcal`}
              </Typography>
            )}
          </Paper>
        </Paper>
      </Box>

      {/* Snackbars for actions */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          severity={snack.type}
          sx={{ fontWeight: 600, fontSize: 16, letterSpacing: 0.5 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
