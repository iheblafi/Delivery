import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the shape of the AuthState
export interface AuthState {
  user: any;
  token: string;
}

// Define the default state
const defaultState: AuthState = {
  user: null,
  token: '',
};

// Create a context with the default state
interface AuthContextProps {
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(defaultState);

  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};
