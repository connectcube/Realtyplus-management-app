import { auth, fireDataBase } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const userRegistration = async (setIsLoading, formData) => {
  try {
    setIsLoading(true);

    // Validate required fields
    if (
      !formData.email ||
      !formData.password ||
      !formData.userType ||
      !formData.name
    ) {
      throw new Error("Missing required fields");
    }

    // Sign up with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    if (userCredential.user) {
      // Create a user profile in Firestore
      const userDocRef = doc(
        fireDataBase,
        formData.userType,
        userCredential.user.uid
      );

      // User data to store in Firestore
      const userData = {
        uid: userCredential.user.uid,
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || "NA",
        role: formData.userType,
        createdAt: new Date(),
      };

      try {
        // Add user to Firestore collection based on user type
        await setDoc(userDocRef, userData);
      } catch (profileError) {
        console.error("Profile creation error:", profileError);
        // Delete the auth user if profile creation fails
        await userCredential.user.delete();
        return null;
      }

      // Sign out the user after registration
      await auth.signOut();

      return "/login"; // return route string to redirect to login page
    }
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

export default userRegistration;
