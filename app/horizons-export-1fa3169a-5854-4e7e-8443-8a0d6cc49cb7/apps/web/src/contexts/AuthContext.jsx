import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  const determineUserType = (model) => {
    if (!model) return null;
    if (model.collectionName === 'admin_users') return 'admin';
    if (model.collectionName === 'clientes') return 'cliente';
    if (model.collectionName === 'modelos') return 'modelo';
    return null;
  };

  const refreshUser = async () => {
    if (!pb.authStore.isValid || !pb.authStore.model) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setUserType(null);
      return;
    }

    try {
      const collection = pb.authStore.model.collectionName;
      const user = await pb.collection(collection).getOne(pb.authStore.model.id, { $autoCancel: false });
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserType(determineUserType(user));
    } catch (error) {
      console.error("Error refreshing user:", error);
      setCurrentUser(pb.authStore.model);
      setIsAuthenticated(true);
      setUserType(determineUserType(pb.authStore.model));
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setLoading(false);
    };

    initAuth();

    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (model) {
        refreshUser();
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUserType(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loginClient = async (email, password) => {
    const authData = await pb.collection('clientes').authWithPassword(email, password, { $autoCancel: false });
    await refreshUser();
    return authData;
  };

  const loginModel = async (email, password) => {
    const authData = await pb.collection('modelos').authWithPassword(email, password, { $autoCancel: false });
    await refreshUser();
    return authData;
  };

  const signupClient = async (data) => {
    const record = await pb.collection('clientes').create({
      ...data,
      saldo_creditos: 0,
      ativo: true,
    }, { $autoCancel: false });
    return record;
  };

  const signupModel = async (formData) => {
    // formData is expected to be a FormData object to handle file uploads
    formData.append('status_aprovacao', 'Em análise');
    formData.append('ganhos_totais', 0);
    formData.append('ativo', true);
    
    const record = await pb.collection('modelos').create(formData, { $autoCancel: false });
    return record;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserType(null);
  };

  const value = {
    currentUser,
    isAuthenticated,
    userType,
    loading,
    loginClient,
    loginModel,
    signupClient,
    signupModel,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};