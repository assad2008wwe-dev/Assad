import React from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: 'Kc' | 'pH';
  difficulty: Difficulty;
}

export interface KcCalculationResult {
  kc: number;
  expression: string;
}

export interface PhCalculationResult {
  ph: number;
  poh: number;
  hPlus: number;
  ohMinus: number;
  nature: 'حمضي' | 'قاعدي' | 'متعادل';
}

export type AppView = 'home' | 'kc-calc' | 'ph-calc' | 'quiz' | 'gemini-assistant';

export interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
}