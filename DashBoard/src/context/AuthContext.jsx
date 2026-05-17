// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      try {
        const snap = await getDocs(collection(db, 'admins'));

        const adminEmails = snap.docs.map((d) => {
          const data = d.data();
          // Trimma o nome de cada chave para tolerar espaços acidentais
          const normalized = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k.trim(), typeof v === 'string' ? v.trim() : v])
          );
          return normalized.email?.toLowerCase() || '';
        }).filter(Boolean);

        const admin = adminEmails.includes(u.email?.toLowerCase().trim());
        setIsAdmin(admin);
      } catch (err) {
        console.error('[AuthContext] erro ao buscar admins:', err);
        setIsAdmin(false);
      }

      setUser(u);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}