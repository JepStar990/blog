import { useState, useCallback } from "react";

export function useAuth() {
  const [apiKey, setApiKey] = useState<string | null>(
    () => localStorage.getItem("admin_api_key")
  );
  const [deepseekKey, setDeepseekKey] = useState<string | null>(
    () => localStorage.getItem("deepseek_api_key")
  );

  const login = useCallback((key: string) => {
    localStorage.setItem("admin_api_key", key);
    setApiKey(key);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_api_key");
    setApiKey(null);
  }, []);

  const setDeepseek = useCallback((key: string) => {
    localStorage.setItem("deepseek_api_key", key);
    setDeepseekKey(key);
  }, []);

  return {
    apiKey,
    deepseekKey,
    isAuthenticated: !!apiKey,
    login,
    logout,
    setDeepseek,
  };
}
