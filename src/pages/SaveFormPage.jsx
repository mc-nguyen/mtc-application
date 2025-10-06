import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useLanguage } from '../LanguageContext';
import './SaveFormPage.css'; // Đảm bảo import file CSS mới

const SaveFormPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [status, setStatus] = useState('idle'); // idle | awaitingPassword | saving | success | error
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const formData = location.state?.formData;
  const isCamp = location.state?.isCamp || false;
  const email = formData?.mainInfo?.email;

  useEffect(() => {
    const checkAndHandleEmail = async () => {
      if (!formData || !email) {
        setError(t('error.noFormData'));
        setStatus('error');
        return;
      }

      try {
        const userRef = doc(db, 'artifacts', 'mtc-applications', 'public', 'data', 'email', email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          await saveFormToExistingUser(userRef);
        } else {
          setStatus('awaitingPassword');
        }
      } catch (err) {
        console.error('Email check failed:', err);
        setError(t('error.saveForm'));
        setStatus('error');
      }
    };

    checkAndHandleEmail();
  }, [formData, email, t]);

  const saveFormToExistingUser = async (userRef) => {
    try {
      setStatus('saving');
      const formRef = isCamp ? 
        doc(collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'campSubmissions')) :
        doc(collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions'));
      await setDoc(formRef, { ...formData, submissionDate: new Date().toISOString() }); // Thêm submissionDate
      const formId = formRef.id;

      await updateDoc(userRef, {
        forms: arrayUnion(formId),
      });

      setStatus('success');
    } catch (err) {
      console.error('Save to existing user failed:', err);
      setError(t('error.saveForm'));
      setStatus('error');
    }
  };

  const handleCreateAccountAndSave = async () => {
    if (!password || password.length < 6) {
      setError(t('saveForm.missingPassword'));
      return;
    }

    try {
      setStatus('saving');
      await createUserWithEmailAndPassword(auth, email, password);

      const formRef = doc(collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'forms'));
      await setDoc(formRef, { ...formData, submissionDate: new Date().toISOString() }); // Thêm submissionDate
      const formId = formRef.id;

      const userRef = doc(db, 'artifacts', 'mtc-applications', 'public', 'data', 'email', email);
      await setDoc(userRef, {
        role: 'user',
        forms: [formId],
      });

      setStatus('success');
    } catch (err) {
      console.error('Create account failed:', err);
      setError(t('error.saveForm'));
      setStatus('error');
    }
  };

  const handleGoHome = () => navigate('/');
  const handleViewDashboard = () => navigate('/dashboard');

  return (
    <div className="save-form-page">
      <h2>{t('saveForm.title')}</h2>

      {status === 'awaitingPassword' && (
        <>
          <p>{t('saveForm.enterPasswordPrompt')}</p>
          <input
            type="password"
            placeholder={t('saveForm.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleCreateAccountAndSave} className="primary-btn">{t('saveForm.createAccount')}</button>
        </>
      )}

      {status === 'saving' && <p>{t('saveForm.saving')}</p>}
      {status === 'success' && (
        <>
          <p>{t('saveForm.success')}</p>
          <button onClick={handleViewDashboard} className="primary-btn">{t('saveForm.viewDashboard')}</button>
          <button onClick={handleGoHome} className="secondary-btn">{t('saveForm.goHome')}</button>
        </>
      )}
      {status === 'error' && (
        <>
          <p className="error-message">{error}</p>
          <button onClick={handleGoHome} className="primary-btn">{t('saveForm.goHome')}</button>
        </>
      )}
    </div>
  );
};

export default SaveFormPage;