'use client';
import React, { useState } from 'react';
import {
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Box
} from '@mui/material';

const ACTIVITY_FACTORS = [
  { label: 'Sedentary', value: 1.2 },
  { label: 'Lightly Active', value: 1.375 },
  { label: 'Moderately Active', value: 1.55 },
  { label: 'Very Active', value: 1.725 },
  { label: 'Athlete/Extra Active', value: 1.9 },
];

type UnitSystem = 'imperial' | 'metric';

export const TDEEForm: React.FC<{ onTDEEChange: (tdee: number, kcalTarget: number, bmr: number) => void }> = ({ onTDEEChange }) => {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(170); // pounds
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [weightMetric, setWeightMetric] = useState(77); // kg
  const [heightMetric, setHeightMetric] = useState(178); // cm
  const [activity, setActivity] = useState(1.2);
  const [goal, setGoal] = useState('maintain');
  const [weeklyChange, setWeeklyChange] = useState(1.0); // lbs or kg per week

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

  // BMR (metric inputs)
  function calcBMR
