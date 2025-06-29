import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth } from '@/config/firebase';

// Types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  preferences: {
    voiceNavigation: boolean;
    autoReroute: boolean;
    notifications: boolean;
    locationSharing: boolean;
  };
  stats: {
    tripsSaved: number;
    fuelSaved: number;
    reportsSubmitted: number;
    communityRating: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CarProfile {
  id: string;
  userId: string;
  name: string;
  make: string;
  model: string;
  year: string;
  fuelEfficiency: number; // km/l
  fuelType: 'Regular' | 'Premium' | 'Diesel';
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CommunityReport {
  id: string;
  userId: string;
  type: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: 'active' | 'resolved';
  votes: {
    helpful: number;
    notHelpful: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TripHistory {
  id: string;
  userId: string;
  carId: string;
  origin: string;
  destination: string;
  distance: number; // km
  duration: number; // minutes
  fuelCost: number;
  tollCost: number;
  totalCost: number;
  route: {
    polyline: string;
    waypoints: string[];
  };
  createdAt: Timestamp;
}

class FirebaseService {
  // Authentication
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await this.createUserProfile(user.uid, {
        email,
        displayName,
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

      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // User Profile Management
  async createUserProfile(userId: string, profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      await doc(db, 'users', userId);
      await updateDoc(doc(db, 'users', userId), {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Car Profile Management
  async addCarProfile(carData: Omit<CarProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        ...carData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding car profile:', error);
      throw error;
    }
  }

  async getUserCars(userId: string): Promise<CarProfile[]> {
    try {
      const q = query(
        collection(db, 'cars'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CarProfile[];
    } catch (error) {
      console.error('Error getting user cars:', error);
      throw error;
    }
  }

  async updateCarProfile(carId: string, updates: Partial<CarProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'cars', carId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating car profile:', error);
      throw error;
    }
  }

  async deleteCarProfile(carId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'cars', carId));
    } catch (error) {
      console.error('Error deleting car profile:', error);
      throw error;
    }
  }

  async setDefaultCar(userId: string, carId: string): Promise<void> {
    try {
      // First, unset all cars as default for this user
      const userCars = await this.getUserCars(userId);
      const updatePromises = userCars.map(car => 
        this.updateCarProfile(car.id, { isDefault: car.id === carId })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error setting default car:', error);
      throw error;
    }
  }

  // Community Reports
  async submitReport(reportData: Omit<CommunityReport, 'id' | 'votes' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        ...reportData,
        votes: {
          helpful: 0,
          notHelpful: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }

  async getActiveReports(limitCount: number = 50): Promise<CommunityReport[]> {
    try {
      const q = query(
        collection(db, 'reports'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityReport[];
    } catch (error) {
      console.error('Error getting active reports:', error);
      throw error;
    }
  }

  async getUserReports(userId: string): Promise<CommunityReport[]> {
    try {
      const q = query(
        collection(db, 'reports'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityReport[];
    } catch (error) {
      console.error('Error getting user reports:', error);
      throw error;
    }
  }

  async updateReportStatus(reportId: string, status: 'active' | 'resolved'): Promise<void> {
    try {
      const docRef = doc(db, 'reports', reportId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  }

  async voteOnReport(reportId: string, voteType: 'helpful' | 'notHelpful'): Promise<void> {
    try {
      const docRef = doc(db, 'reports', reportId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentVotes = docSnap.data().votes;
        const newVotes = {
          ...currentVotes,
          [voteType]: currentVotes[voteType] + 1
        };
        
        await updateDoc(docRef, {
          votes: newVotes,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error voting on report:', error);
      throw error;
    }
  }

  // Trip History
  async saveTripHistory(tripData: Omit<TripHistory, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'trips'), {
        ...tripData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving trip history:', error);
      throw error;
    }
  }

  async getUserTripHistory(userId: string, limitCount: number = 20): Promise<TripHistory[]> {
    try {
      const q = query(
        collection(db, 'trips'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TripHistory[];
    } catch (error) {
      console.error('Error getting trip history:', error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToActiveReports(callback: (reports: CommunityReport[]) => void) {
    const q = query(
      collection(db, 'reports'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (querySnapshot) => {
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityReport[];
      callback(reports);
    });
  }

  subscribeToUserCars(userId: string, callback: (cars: CarProfile[]) => void) {
    const q = query(
      collection(db, 'cars'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const cars = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CarProfile[];
      callback(cars);
    });
  }
}

export const firebaseService = new FirebaseService();