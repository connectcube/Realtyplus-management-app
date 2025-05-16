// src/components/auth/AuthProvider.tsx
import { useEffect } from 'react';
import { auth, fireDataBase } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useStore } from '@/lib/zustand';

export const AuthProvider = ({ children }) => {
  const updateProfile = useStore.getState().setUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        console.log('User is signed in:', user.uid);

        // Check each user type collection for the user's ID
        const userTypes = ['landlords', 'tenants', 'contractors'];

        for (const userType of userTypes) {
          const userQuery = query(collection(fireDataBase, userType), where('uid', '==', user.uid));

          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();

            updateProfile({
              ...userData,
              userName:
                userData.full_name || `${userData.firstName || ''} ${userData.lastName || ''}`,
              role: userType,
              email: userData.email,
              uid: userData.uid,
              id: querySnapshot.docs[0].id,
              phone: userData.phone,
            });
            break;
          }
        }
      } else {
        // User is signed out
        console.log('User is signed out');
        updateProfile({
          userName: null,
          role: null,
          email: null,
          uid: null,
          id: null,
          phone: null,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};
