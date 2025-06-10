"use client";
import React from "react";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import { TDEEForm } from "../components/TDEEForm";

export default function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6fb", p: 4 }}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, minHeight: 500 }}>
            <TDEEForm onTDEEChange={() => {}} />
          </Paper>
        </Grid>

        {/* Main area */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 4 }}>
            {/* Meals Row */}
            <Grid container spacing={3} justifyContent="center">
              {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                <Grid item xs={12} md={4} key={meal}>
                  <Paper
                    sx={{
                      p: 2,
                      minHeight: 140,
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6">{meal}</Typography>
                    {/* Ingredient list for this meal goes here */}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
          {/* Daily Stats */}
          <Paper sx={{ p: 3, borderRadius: 2, mt: 3, minHeight: 90 }}>
            <Typography variant="h6" align="center">
              Daily Stats for calories, protein, carbs, fats
            </Typography>
            {/* Put daily macro totals here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
