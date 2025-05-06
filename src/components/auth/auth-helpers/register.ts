import { auth, fireDataBase } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const userRegistration = async (setIsLoading, formData, setTab) => {
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

    // Check if a user is already authenticated
    const currentUser = auth.currentUser;
    let userId;

    if (currentUser) {
      // User is already authenticated, use their existing UID
      userId = currentUser.uid;

      // Check if document already exists for this user
      const userDocRef = doc(fireDataBase, `${formData.userType}s`, userId);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Document doesn't exist, create one with just the UID
        await setDoc(userDocRef, {
          uid: userId,
          role: formData.userType,
          createdAt: new Date(),
        });
        console.log("Created minimal user profile for existing auth user");
      } else {
        console.log("User document already exists, no action needed");
      }
      toast("Seems like you already registered, login instead.");
      setTab("login");
      return "/login";
    } else {
      // No user is authenticated, create a new account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      userId = userCredential.user.uid;
      console.log("Created new user account:", userId);
    }

    // Create a user profile in Firestore
    const userDocRef = doc(fireDataBase, `${formData.userType}s`, userId);

    // User data to store in Firestore
    const userData = {
      uid: userId,
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone || "NA",
      role: formData.userType,
      createdAt: new Date(),
    };

    try {
      // Add user to Firestore collection based on user type
      await setDoc(userDocRef, userData);
      console.log("User profile created successfully");
    } catch (profileError) {
      console.error("Profile creation error:", profileError);

      // Only delete the auth user if we created a new one
      if (!currentUser) {
        // Get the current user again to ensure we have the latest reference
        const userToDelete = auth.currentUser;
        if (userToDelete) {
          await userToDelete.delete();
          console.log("Deleted user account due to profile creation failure");
        }
      }
      return null;
    }

    // Only sign out if we want the user to log in again
    // You might want to keep them signed in depending on your app flow
    if (!currentUser) {
      await auth.signOut();
    }

    return "/login"; // return route string to redirect to login page
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

export default userRegistration;
