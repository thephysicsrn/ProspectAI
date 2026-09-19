'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  companyName: string;
  adminName: string;
  phone?: string;
  plan: 'starter' | 'scale' | 'enterprise' | string;
  role: 'admin' | 'sdr' | 'manager';
  createdAt: string;
  status: 'active' | 'trial' | 'pending';
}

interface SignUpData {
  email: string;
  password: string;
  companyName: string;
  adminName: string;
  phone?: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: 'sdr' | 'manager') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or sync user profile from Firestore
  const loadUserProfile = async (uid: string, fallbackEmail: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        // Fallback default profile if not in Firestore yet
        const defaultProfile: UserProfile = {
          uid,
          email: fallbackEmail || 'usuario@prospectai.com.br',
          companyName: 'Empresa Parceira B2B',
          adminName: fallbackEmail ? fallbackEmail.split('@')[0] : 'Gestor Comercial',
          plan: 'scale',
          role: 'admin',
          createdAt: new Date().toISOString(),
          status: 'active',
        };
        setUserProfile(defaultProfile);
        // Persist to Firestore
        try {
          await setDoc(userRef, defaultProfile);
        } catch (e) {
          console.warn('Could not auto-save fallback profile to Firestore:', e);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setUserProfile({
        uid,
        email: fallbackEmail,
        companyName: 'Empresa B2B',
        adminName: fallbackEmail ? fallbackEmail.split('@')[0] : 'Usuário',
        plan: 'scale',
        role: 'admin',
        createdAt: new Date().toISOString(),
        status: 'active',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadUserProfile(firebaseUser.uid, firebaseUser.email || '');
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await loadUserProfile(cred.user.uid, email);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignUpData) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: data.email,
        companyName: data.companyName,
        adminName: data.adminName,
        phone: data.phone || '',
        plan: data.plan || 'scale',
        role: 'admin',
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      // Save user profile in Firestore
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (role: 'sdr' | 'manager') => {
    setLoading(true);
    try {
      // Create or sign in anonymous or demo credentials
      const demoEmail = role === 'sdr' ? 'sdr.vendas@empresa.com.br' : 'diretoria@empresa.com.br';
      const demoPass = 'ProspectAI@2026';

      try {
        await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (loginErr: any) {
        // If demo user doesn't exist yet in Firebase Auth, create it!
        if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
          try {
            const cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
            const demoProfile: UserProfile = {
              uid: cred.user.uid,
              email: demoEmail,
              companyName: role === 'sdr' ? 'Alfa Tecnologia B2B' : 'Holding Brasil Soluções',
              adminName: role === 'sdr' ? 'Consultor SDR Vendas' : 'Diretor Comercial',
              plan: role === 'sdr' ? 'starter' : 'enterprise',
              role: role === 'sdr' ? 'sdr' : 'manager',
              createdAt: new Date().toISOString(),
              status: 'active',
            };
            await setDoc(doc(db, 'users', cred.user.uid), demoProfile);
            setUserProfile(demoProfile);
          } catch (createErr) {
            // If creation fails (e.g. already in use or offline), use anonymous sign in
            const anon = await signInAnonymously(auth);
            setUserProfile({
              uid: anon.user.uid,
              email: demoEmail,
              companyName: 'Alfa Soluções B2B',
              adminName: role === 'sdr' ? 'SDR Vendas' : 'Gestor Comercial',
              plan: role === 'sdr' ? 'starter' : 'enterprise',
              role: role === 'sdr' ? 'sdr' : 'manager',
              createdAt: new Date().toISOString(),
              status: 'active',
            });
          }
        } else {
          // Fallback demo
          const anon = await signInAnonymously(auth);
          setUserProfile({
            uid: anon.user.uid,
            email: demoEmail,
            companyName: 'Alfa Soluções B2B',
            adminName: role === 'sdr' ? 'SDR Vendas' : 'Gestor Comercial',
            plan: role === 'sdr' ? 'starter' : 'enterprise',
            role: role === 'sdr' ? 'sdr' : 'manager',
            createdAt: new Date().toISOString(),
            status: 'active',
          });
        }
      }
    } catch (finalErr) {
      console.error('Quick demo login error:', finalErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        login,
        signup,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
