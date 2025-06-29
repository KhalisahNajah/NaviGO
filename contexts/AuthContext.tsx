import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { firebaseService, UserProfile } from '@/services/firebaseService';
import { analyticsService } from '@/services/analyticsService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
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
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        setIsGuest(false);
        try {
          let profile = await firebaseService.getUserProfile(user.uid);
          
          // Create profile if it doesn't exist
          if (!profile) {
            await firebaseService.createUserProfile(user.uid, {
              email: user.email || '',
              displayName: user.displayName || 'User',
              currency: {
                code: 'USD',
                symbol: '$',
                name: 'US Dollar'
              },
              preferences: {
                voiceNavigation: true,
                autoReroute: true,
                notifications: true,
                locationSharing: true
              },
              stats: {
                tripsSaved: 0,
                fuelSaved: 0,
                reportsSubmitted: 0,
                communityRating: 5.0
              }
            });
            profile = await firebaseService.getUserProfile(user.uid);
          }
          
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
        if (!isGuest) {
          analyticsService.trackEvent('user_signed_out');
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [isGuest]);

  const signIn = async (email: string, password: string) => {
    try {
      await firebaseService.signIn(email, password);
      setIsGuest(false);
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
      setIsGuest(false);
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
      if (user) {
        await firebaseService.signOut();
      }
      setIsGuest(false);
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

  // Create a mock profile for guest users
  const guestProfile: UserProfile = {
    id: 'guest',
    email: 'guest@navifuel.com',
    displayName: 'Guest User',
    currency: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar'
    },
    preferences: {
      voiceNavigation: true,
      autoReroute: true,
      notifications: false,
      locationSharing: false
    },
    stats: {
      tripsSaved: 0,
      fuelSaved: 0,
      reportsSubmitted: 0,
      communityRating: 5.0
    },
    createdAt: new Date() as any,
    updatedAt: new Date() as any
  };

  const value = {
    user,
    userProfile: isGuest ? guestProfile : userProfile,
    loading,
    isGuest,
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