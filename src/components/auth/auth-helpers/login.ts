import { auth, fireDataBase } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useStore } from "@/lib/zustand";

const login = async (setIsLoading, formData) => {
  const updateProfile = useStore.getState().updateProfile;
  try {
    setIsLoading(true);

    // 1. Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    if (userCredential.user) {
      // 2. Check each user type collection for the user's ID
      const userTypes = ["landlord", "tenant", "contractor"];

      for (const userType of userTypes) {
        // Query Firestore for the user
        const userQuery = query(
          collection(fireDataBase, userType),
          where("uid", "==", userCredential.user.uid)
        );

        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          // User found in this collection
          const userData = querySnapshot.docs[0].data();
          const role = userData.role;

          console.log(userData);

          updateProfile({
            userName: userData.full_name,
            role: userData.role,
            email: userData.email,
            uid: userData.uid,
            id: querySnapshot.docs[0].id, // Firestore document ID
            phone: userData.phone,
          });

          // Return the role
          return role;
        }
      }

      // If we get here, the user wasn't found in any collection
      throw new Error("User not found in any role collection");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

export default login;
