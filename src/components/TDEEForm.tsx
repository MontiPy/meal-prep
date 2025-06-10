"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

const ACTIVITY_FACTORS = [
  { label: "Sedentary", value: 1.2 },
  { label: "Lightly Active", value: 1.375 },
  { label: "Moderately Active", value: 1.55 },
  { label: "Very Active", value: 1.725 },
  { label: "Athlete/Extra Active", value: 1.9 },
];

type UnitSystem = "imperial" | "metric";

export const TDEEForm: React.FC<{
  onTDEEChange: (tdee: number, kcalTarget: number) => void;
}> = ({ onTDEEChange }) => {
  // Toggle state: 'imperial' by default
  const [unit, setUnit] = useState<UnitSystem>("imperial");

  // Common states
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(30);
  // Weight and height: store in the currently displayed units
  const [weight, setWeight] = useState(170); // pounds (default Imperial)
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [weightMetric, setWeightMetric] = useState(77); // kg
  const [heightMetric, setHeightMetric] = useState(178); // cm
  const [activity, setActivity] = useState(1.2);
  const [goal, setGoal] = useState("maintain");

  // Conversion helpers
  const lbToKg = (lb: number) => lb * 0.453592;
  const ftInToCm = (ft: number, inches: number) => (ft * 12 + inches) * 2.54;
  const kgToLb = (kg: number) => kg / 0.453592;
  const cmToFtIn = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - feet * 12);
    return { feet, inches };
  };

  // BMR calculation always expects kg and cm
  function calcBMR(weightKg: number, heightCm: number) {
    return gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  function calcTDEE(bmr: number) {
    return Math.round(bmr * Number(activity));
  }

  function getTarget(tdee: number) {
    if (goal === "lose") return tdee - 500;
    if (goal === "gain") return tdee + 500;
    return tdee;
  }

  // When toggling units, auto-convert the displayed values!
  const handleUnitChange = (
    _: React.MouseEvent<HTMLElement>,
    nextUnit: UnitSystem | null
  ) => {
    if (!nextUnit || nextUnit === unit) return;

    if (nextUnit === "imperial") {
      setWeight(Math.round(kgToLb(weightMetric)));
      const { feet, inches } = cmToFtIn(heightMetric);
      setHeightFeet(feet);
      setHeightInches(inches);
    } else {
      setWeightMetric(Math.round(lbToKg(weight)));
      setHeightMetric(Math.round(ftInToCm(heightFeet, heightInches)));
    }
    setUnit(nextUnit);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Convert inputs to metric for calculation
    let weightKg: number;
    let heightCm: number;
    if (unit === "imperial") {
      weightKg = lbToKg(weight);
      heightCm = ftInToCm(heightFeet, heightInches);
    } else {
      weightKg = weightMetric;
      heightCm = heightMetric;
    }
    const bmr = calcBMR(weightKg, heightCm);
    const tdee = calcTDEE(bmr);
    const target = getTarget(tdee);
    onTDEEChange(tdee, target);
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Toggle at the top */}
        <Box display="flex" justifyContent="center" mb={2}>
          <ToggleButtonGroup
            color="primary"
            value={unit}
            exclusive
            onChange={handleUnitChange}
            aria-label="Unit system"
          >
            <ToggleButton value="imperial">Imperial (US)</ToggleButton>
            <ToggleButton value="metric">Metric</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Typography variant="h6">TDEE Calculator</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <TextField
            label="Gender"
            select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            size="small"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            size="small"
          />

          {unit === "imperial" ? (
            <>
              <TextField
                label="Weight (lb)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                size="small"
              />
              <Box display="flex" gap={1}>
                <TextField
                  label="Height (ft)"
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(Number(e.target.value))}
                  size="small"
                  sx={{ width: 80 }}
                />
                <TextField
                  label="Height (in)"
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(Number(e.target.value))}
                  size="small"
                  sx={{ width: 90 }}
                />
              </Box>
            </>
          ) : (
            <>
              <TextField
                label="Weight (kg)"
                type="number"
                value={weightMetric}
                onChange={(e) => setWeightMetric(Number(e.target.value))}
                size="small"
              />
              <TextField
                label="Height (cm)"
                type="number"
                value={heightMetric}
                onChange={(e) => setHeightMetric(Number(e.target.value))}
                size="small"
              />
            </>
          )}

          <TextField
            label="Activity Level"
            select
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value))}
            size="small"
          >
            {ACTIVITY_FACTORS.map((af) => (
              <MenuItem key={af.value} value={af.value}>
                {af.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Goal"
            select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            size="small"
          >
            <MenuItem value="maintain">Maintain</MenuItem>
            <MenuItem value="lose">Lose Weight</MenuItem>
            <MenuItem value="gain">Gain Weight</MenuItem>
          </TextField>
          <Button type="submit" variant="contained">
            Calculate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
