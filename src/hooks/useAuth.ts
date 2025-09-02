import { useRef, useCallback } from 'react';
import { registerUser as apiRegisterUser, loginUser as apiLoginUser, saveUser as apiSaveUser } from '@/services/auth';
import type { GameState } from '../types/game';

interface RegisterParams {
  username: string;
  password: string;
  data: GameState;
}

export const useAuth = () => {
  const credentialsRef = useRef<{ username: string; password: string } | null>(null);

  const registerUser = useCallback(async ({ username, password, data }: RegisterParams) => {
    await apiRegisterUser({ username, password, data });
    credentialsRef.current = { username, password };
  }, []);

  const loginUser = useCallback(async (username: string, password: string): Promise<GameState> => {
    const data = await apiLoginUser<GameState>({ username, password });
    credentialsRef.current = { username, password };
    return data;
  }, []);

  const saveGame = useCallback(async (state: GameState) => {
    const creds = credentialsRef.current;
    if (!creds) return;
    try {
      await apiSaveUser({ username: creds.username, password: creds.password, data: state });
    } catch (err) {
      console.error('Failed to save game state', err);
    }
  }, []);

  const logout = useCallback(() => {
    credentialsRef.current = null;
  }, []);

  return { registerUser, loginUser, saveGame, logout, credentialsRef };
};

export type UseAuthReturn = ReturnType<typeof useAuth>;
