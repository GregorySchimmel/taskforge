"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { DEMO_USERS } from "@/data/seed";
import {
  claimTask,
  createProject,
  createTasks,
  getAllTechTags,
  getLeaderboard,
  loadActiveRole,
  loadAuthUser,
  loadState,
  loginAsDemo,
  markNotificationsRead,
  reviewSubmission,
  saveActiveRole,
  saveAuthUser,
  saveState,
  signUpUser,
  submitTask,
  updateUserSkills,
} from "@/lib/store";
import type {
  AppState,
  Project,
  TaskDifficulty,
  TaskType,
  User,
  UserRole,
} from "@/types";

interface AppContextValue {
  state: AppState;
  user: User | null;
  activeRole: UserRole;
  isLoading: boolean;
  techTags: string[];
  leaderboard: ReturnType<typeof getLeaderboard>;
  setActiveRole: (role: UserRole) => void;
  signUp: (data: {
    name: string;
    email: string;
    role: UserRole;
    github: string;
    skills: string[];
  }) => void;
  loginDemo: (role: UserRole) => void;
  logout: () => void;
  claimTaskById: (taskId: string) => boolean;
  submitTaskWork: (
    taskId: string,
    data: {
      githubLink: string;
      demoLink?: string;
      notes: string;
      timeSpentHours: number;
    }
  ) => boolean;
  reviewTaskSubmission: (
    submissionId: string,
    approved: boolean,
    rating: number,
    feedback: string
  ) => boolean;
  postProject: (
    project: Omit<Project, "id" | "hirerId" | "hirerName" | "published" | "createdAt">,
    tasks: {
      title: string;
      description: string;
      acceptanceCriteria: string[];
      type: TaskType;
      difficulty: TaskDifficulty;
      estimatedHours: number;
      bounty: number;
      techTags: string[];
    }[]
  ) => void;
  updateSkills: (skills: string[]) => void;
  markAllNotificationsRead: () => void;
  getUserByUsername: (username: string) => User | undefined;
  getUserNotifications: () => AppState["notifications"];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole>("junior");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = loadState();
    const authUser = loadAuthUser();
    setState(loaded);
    setUser(authUser);
    setActiveRoleState(loadActiveRole(authUser));
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  const setActiveRole = useCallback((role: UserRole) => {
    setActiveRoleState(role);
    saveActiveRole(role);
  }, []);

  const signUp = useCallback(
    (data: Parameters<AppContextValue["signUp"]>[0]) => {
      if (!state) return;
      const { state: next, user: newUser } = signUpUser(state, data);
      persist(next);
      setUser(newUser);
      saveAuthUser(newUser);
      setActiveRole(newUser.role);
      toast.success(`Welcome to TaskForge, ${newUser.name}!`);
    },
    [state, persist, setActiveRole]
  );

  const loginDemo = useCallback(
    (role: UserRole) => {
      if (!state) return;
      const demoUser = role === "hirer" ? DEMO_USERS.hirer : DEMO_USERS.junior;
      const result = loginAsDemo(state, role);
      if (result) {
        setUser(result.user);
        saveAuthUser(result.user);
        setActiveRole(role);
        toast.success(`Logged in as ${demoUser.name} (${role})`);
      }
    },
    [state, setActiveRole]
  );

  const logout = useCallback(() => {
    setUser(null);
    saveAuthUser(null);
    toast.info("Logged out");
  }, []);

  const claimTaskById = useCallback(
    (taskId: string) => {
      if (!state || !user) return false;
      const next = claimTask(state, taskId, user.id);
      if (next === state) {
        toast.error("Could not claim task");
        return false;
      }
      persist(next);
      toast.success("Task claimed! Head to your dashboard to get started.");
      return true;
    },
    [state, user, persist]
  );

  const submitTaskWork = useCallback(
    (taskId: string, data: Parameters<AppContextValue["submitTaskWork"]>[1]) => {
      if (!state || !user) return false;
      const next = submitTask(state, taskId, user.id, data);
      if (next === state) {
        toast.error("Could not submit work");
        return false;
      }
      persist(next);
      toast.success("Submission sent for review!");
      return true;
    },
    [state, user, persist]
  );

  const reviewTaskSubmission = useCallback(
    (
      submissionId: string,
      approved: boolean,
      rating: number,
      feedback: string
    ) => {
      if (!state || !user) return false;
      const next = reviewSubmission(
        state,
        submissionId,
        user.id,
        approved,
        rating,
        feedback
      );
      if (next === state) {
        toast.error("Could not process review");
        return false;
      }
      const submission = next.submissions.find((s) => s.id === submissionId);
      const updatedUser = next.users.find((u) => u.id === user.id);
      persist(next);
      if (updatedUser && updatedUser.id === user.id) {
        setUser(updatedUser);
        saveAuthUser(updatedUser);
      }
      if (approved) {
        toast.success("Submission approved! Dev stats updated.");
      } else {
        toast.info("Submission sent back for revision.");
      }
      return true;
    },
    [state, user, persist]
  );

  const postProject = useCallback(
    (
      project: Parameters<AppContextValue["postProject"]>[0],
      tasks: Parameters<AppContextValue["postProject"]>[1]
    ) => {
      if (!state || !user) return;
      let next = createProject(state, user.id, project);
      const newProject = next.projects[0];
      next = createTasks(next, user.id, newProject.id, tasks);
      persist(next);
      toast.success(`Published ${tasks.length} task(s) to the board!`);
    },
    [state, user, persist]
  );

  const updateSkills = useCallback(
    (skills: string[]) => {
      if (!state || !user) return;
      const next = updateUserSkills(state, user.id, skills);
      persist(next);
      const updated = next.users.find((u) => u.id === user.id);
      if (updated) {
        setUser(updated);
        saveAuthUser(updated);
      }
      toast.success("Skills updated");
    },
    [state, user, persist]
  );

  const markAllNotificationsRead = useCallback(() => {
    if (!state || !user) return;
    persist(markNotificationsRead(state, user.id));
  }, [state, user, persist]);

  const getUserByUsername = useCallback(
    (username: string) => state?.users.find((u) => u.username === username),
    [state]
  );

  const getUserNotifications = useCallback(() => {
    if (!state || !user) return [];
    return state.notifications.filter((n) => n.userId === user.id);
  }, [state, user]);

  const value = useMemo<AppContextValue | null>(() => {
    if (!state) return null;
    return {
      state,
      user,
      activeRole,
      isLoading,
      techTags: getAllTechTags(state),
      leaderboard: getLeaderboard(state),
      setActiveRole,
      signUp,
      loginDemo,
      logout,
      claimTaskById,
      submitTaskWork,
      reviewTaskSubmission,
      postProject,
      updateSkills,
      markAllNotificationsRead,
      getUserByUsername,
      getUserNotifications,
    };
  }, [
    state,
    user,
    activeRole,
    isLoading,
    setActiveRole,
    signUp,
    loginDemo,
    logout,
    claimTaskById,
    submitTaskWork,
    reviewTaskSubmission,
    postProject,
    updateSkills,
    markAllNotificationsRead,
    getUserByUsername,
    getUserNotifications,
  ]);

  if (!value) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}