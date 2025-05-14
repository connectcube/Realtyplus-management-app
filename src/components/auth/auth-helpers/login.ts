import {auth, fireDataBase} from "@/lib/firebase";
import {signInWithEmailAndPassword} from "firebase/auth";
import {collection, query, where, getDocs} from "firebase/firestore";
import {useStore} from "@/lib/zustand";

const login = async (setIsLoading, formData) => {
   const updateProfile = useStore.getState().setUser;
   console.log("Login attempt started for:", formData.email);
   try {
      setIsLoading(true);
      console.log("Setting loading state to true");

      // 1. Authenticate with Firebase
      console.log("Attempting Firebase authentication...");
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Firebase authentication successful", userCredential.user.uid);

      if (userCredential.user) {
         // 2. Check each user type collection for the user's ID
         const userTypes = ["landlords", "tenants", "contractors"];
         console.log("Checking user collections:", userTypes);

         for (const userType of userTypes) {
            // Query Firestore for the user
            console.log(`Checking ${userType} collection...`);
            const userQuery = query(collection(fireDataBase, userType), where("uid", "==", userCredential.user.uid));

            const querySnapshot = await getDocs(userQuery);
            console.log(`${userType} query results:`, querySnapshot.size, "documents found");
            console.log("User found in collection:", querySnapshot);
            if (!querySnapshot.empty) {
               // User found in this collection
               const userData = querySnapshot.docs[0].data();
               const role = userData.role;

               console.log("User found in collection:", userType);
               console.log("User data:", userData);

               updateProfile({
                  userName: `${userData.firstName} ${userData.lastName}`,
                  role: userType,
                  email: userData.email,
                  uid: userData.uid,
                  id: querySnapshot.docs[0].id, // Firestore document ID
                  phone: userData.phone,
                  propertyRefs: userData.propertyRef,
                  propertyRef: userData.propertyRef.length > 0 ? userData.propertyRef[0] : userData.propertyRef
               });
               console.log("Profile updated with role:", role);

               // Return the role
               console.log("Login successful, returning role:", role);
               return role;
            }
         }

         // If we get here, the user wasn't found in any collection
         console.log("User authenticated but not found in any role collection");
         throw new Error("User not found in any role collection");
      }
   } catch (error) {
      console.error("Login error:", error);
      console.log("Login failed with error message:", error.message);
      throw error;
   } finally {
      console.log("Login process completed, setting loading state to false");
      setIsLoading(false);
   }
};

export default login;
