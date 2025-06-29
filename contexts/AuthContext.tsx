import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { firebaseService, UserProfile } from '@/services/firebaseService';
import { analyticsService } from '@/services/analyticsService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const profile = await firebaseService.getUserProfile(user.uid);
          setUserProfile(profile);
          
          // Set analytics user
          analyticsService.setUser(user.uid);
          analyticsService.setUserProperties({
            user_id: user.uid,
            email: user.email,
            display_name: profile?.displayName,
            currency: profile?.currency.code,
          });
          
          analyticsService.trackEvent('user_authenticated', {
            method: 'email',
            user_id: user.uid,
          });
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
        analyticsService.trackEvent('user_signed_out');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await firebaseService.signIn(email, password);
      analyticsService.trackEvent('sign_in', {
        method: 'email',
      });
    } catch (error) {
      console.error('Sign in error:', error);
      analyticsService.trackEvent('sign_in_failed', {
        method: 'email',
        error: (error as Error).message,
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      await firebaseService.signUp(email, password, displayName);
      analyticsService.trackEvent('sign_up', {
        method: 'email',
      });
    } catch (error) {
      console.error('Sign up error:', error);
      analyticsService.trackEvent('sign_up_failed', {
        method: 'email',
        error: (error as Error).message,
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (user) {
      try {
        await firebaseService.updateUserProfile(user.uid, updates);
        const updatedProfile = await firebaseService.getUserProfile(user.uid);
        setUserProfile(updatedProfile);
        
        // Track profile updates
        analyticsService.trackEvent('profile_updated', {
          updated_fields: Object.keys(updates),
        });
        
        // Update analytics user properties if currency changed
        if (updates.currency) {
          analyticsService.setUserProperties({
            currency: updates.currency.code,
          });
        }
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}