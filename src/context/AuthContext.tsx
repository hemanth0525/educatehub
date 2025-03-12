import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from "sonner";
import { db } from '../lib/firebase';

// Extend Firebase User type with our custom properties
interface User extends FirebaseUser {
  name?: string;
  role?: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, tutorInfo?: {
    teachingExperience: string;
    expertise: string;
    qualifications: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the existing Firebase app's auth instance.
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Extend Firebase user with our custom properties
        const customUser = firebaseUser as User;
        customUser.id = firebaseUser.uid;

        try {
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            customUser.name = userData.name;
            customUser.role = userData.role;
          }
          setUser(customUser);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUser(customUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'student', tutorInfo?: {
    teachingExperience: string;
    expertise: string;
    qualifications: string;
  }) => {
    try {
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Create user profile in Firestore with role and tutor info if provided
      const userData = {
        name,
        email,
        createdAt: new Date(),
        role,
        ...(role === 'tutor' && tutorInfo ? {
          teachingExperience: tutorInfo.teachingExperience,
          expertise: tutorInfo.expertise,
          qualifications: tutorInfo.qualifications
        } : {})
      };

      await setDoc(doc(db, 'users', user.uid), userData);
    } catch (err) {
      setError('Failed to create account. Please try again.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      setError('Failed to log out.');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
