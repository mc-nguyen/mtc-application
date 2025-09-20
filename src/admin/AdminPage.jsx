// src/admin/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      {user ? (
        <AdminDashboard />
      ) : (
        <AdminLogin onLogin={() => setUser(auth.currentUser)} />
      )}
    </div>
  );
};

export default AdminPage;