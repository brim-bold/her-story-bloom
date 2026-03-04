import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; locked?: boolean }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  checkLoginAttempts: (email: string) => Promise<{ locked: boolean; attempts: number }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkLoginAttempts = async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('check_login_attempts', {
        user_email: email.toLowerCase()
      });

      if (error) {
        console.error('Error checking login attempts:', error);
        return { locked: false, attempts: 0 };
      }

      const result = data as { locked: boolean; attempts: number };
      return { locked: result.locked, attempts: result.attempts };
    } catch (error) {
      console.error('Error checking login attempts:', error);
      return { locked: false, attempts: 0 };
    }
  };

  const recordFailedAttempt = async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('record_failed_attempt', {
        user_email: email.toLowerCase()
      });

      if (error) {
        console.error('Error recording failed attempt:', error);
        return { locked: false, attempts: 0 };
      }

      const result = data as { locked: boolean; attempts: number };

      // Send password reset email if locked
      if (result.locked) {
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              name: 'User',
              email: email,
              template: 'password_reset_lockout'
            }
          });
        } catch (emailError) {
          console.error('Failed to send lockout email:', emailError);
        }
      }

      return { locked: result.locked, attempts: result.attempts };
    } catch (error) {
      console.error('Error recording failed attempt:', error);
      return { locked: false, attempts: 0 };
    }
  };

  const clearFailedAttempts = async (email: string) => {
    try {
      const { error } = await supabase.rpc('clear_failed_attempts', {
        user_email: email.toLowerCase()
      });

      if (error) {
        console.error('Error clearing failed attempts:', error);
      }
    } catch (error) {
      console.error('Error clearing failed attempts:', error);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    // Send welcome email if signup was successful
    if (!error) {
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            name: firstName || 'New Member',
            email: email,
            template: 'welcome'
          }
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't return error for email failure - signup was successful
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Check if account is locked first
    const { locked } = await checkLoginAttempts(email);
    if (locked) {
      return { error: new Error('Account temporarily locked due to multiple failed attempts. Please reset your password.'), locked: true };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Record failed attempt
      const result = await recordFailedAttempt(email);
      return { error, locked: result.locked };
    } else {
      // Clear failed attempts on successful login
      await clearFailedAttempts(email);
      return { error: null };
    }
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    // Clear failed attempts when password reset is initiated
    if (!error) {
      await clearFailedAttempts(email);
      
      // Send password reset email
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            name: 'User',
            email: email,
            template: 'password_reset'
          }
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    checkLoginAttempts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};