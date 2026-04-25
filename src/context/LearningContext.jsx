/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LearningContext = createContext(null);

const DEFAULT_STATE = {
  apiKey: "",
  userProfile: { occupation: "", goal: "", skills: "", name: "" },
  currentTopic: "",
  topicsExplored: [],
  quizHistory: [],
  sessionHistory: [],
  streakDays: 0,
  lastActiveDate: null,
  totalTimeSpent: 0,
  masteryLevels: {},
};

const STORAGE_KEY = "learnwise_state";

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch (e) {
    console.warn("Failed to load state:", e);
  }
  return DEFAULT_STATE;
};

export const LearningProvider = ({ children }) => {
  const [state, setState] = useState(loadState);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state:", e);
    }
  }, [state]);

  // Streak tracking
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (state.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      setState((prev) => ({
        ...prev,
        lastActiveDate: today,
        streakDays: prev.lastActiveDate === yesterday ? prev.streakDays + 1 : 1,
      }));
    }
  }, []);

  const setApiKey = useCallback((key) => {
    setState((prev) => ({ ...prev, apiKey: key }));
    localStorage.setItem("gemini_key", key);
  }, []);

  const setUserProfile = useCallback((profile) => {
    setState((prev) => ({ ...prev, userProfile: profile }));
    localStorage.setItem("ai_user_profile", JSON.stringify(profile));
  }, []);

  const setCurrentTopic = useCallback((topic) => {
    setState((prev) => {
      const explored = prev.topicsExplored.includes(topic)
        ? prev.topicsExplored
        : [...prev.topicsExplored, topic];
      return { ...prev, currentTopic: topic, topicsExplored: explored };
    });
  }, []);

  const recordQuizResult = useCallback((topic, score, total) => {
    setState((prev) => {
      const entry = { topic, score, total, date: new Date().toISOString() };
      const history = [...prev.quizHistory, entry];

      // Calculate mastery for this topic
      const topicQuizzes = history.filter((q) => q.topic === topic);
      const avgScore = topicQuizzes.reduce((a, q) => a + q.score / q.total, 0) / topicQuizzes.length;
      const mastery = Math.round(avgScore * 100);

      return {
        ...prev,
        quizHistory: history,
        masteryLevels: { ...prev.masteryLevels, [topic]: mastery },
      };
    });
  }, []);

  const addSessionEntry = useCallback((entry) => {
    setState((prev) => ({
      ...prev,
      sessionHistory: [
        { ...entry, timestamp: new Date().toISOString() },
        ...prev.sessionHistory,
      ].slice(0, 50),
    }));
  }, []);

  const getDifficultyLevel = useCallback(
    (topic) => {
      const mastery = state.masteryLevels[topic];
      if (mastery === undefined) return "beginner";
      if (mastery < 40) return "beginner";
      if (mastery < 70) return "intermediate";
      return "advanced";
    },
    [state.masteryLevels]
  );

  const isSetupComplete = Boolean(
    (state.apiKey || import.meta.env.VITE_GEMINI_API_KEY_PRIMARY || import.meta.env.VITE_GEMINI_API_KEY_FALLBACK)
  );

  const value = {
    ...state,
    setApiKey,
    setUserProfile,
    setCurrentTopic,
    recordQuizResult,
    addSessionEntry,
    getDifficultyLevel,
    isSetupComplete,
  };

  return (
    <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
  );
};

export const useLearning = () => {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning must be used within LearningProvider");
  return ctx;
};
