import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, saveOpportunity, unsaveOpportunity } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      if (!token) {
        if (!cancelled) {
          setUser(null);
          setSavedIds(new Set());
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getCurrentUser(token);
        if (!cancelled) {
          setUser(data.user);
          setSavedIds(new Set((data.user.savedOpportunities || []).map(String)));
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setSavedIds(new Set());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, [token]);

  function login(newToken, newUser) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
    setSavedIds(new Set((newUser.savedOpportunities || []).map(String)));
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setSavedIds(new Set());
  }

  async function toggleSave(opportunityId) {
    if (!token) {
      return;
    }

    const id = String(opportunityId);
    const isSaved = savedIds.has(id);

    setSavedIds((current) => {
      const next = new Set(current);
      if (isSaved) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    try {
      if (isSaved) {
        await unsaveOpportunity(token, id);
      } else {
        await saveOpportunity(token, id);
      }
    } catch {
      setSavedIds((current) => {
        const next = new Set(current);
        if (isSaved) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, savedIds, login, logout, toggleSave }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
