import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/zustand";

const login = async (setIsLoading, formData) => {
  const updateProfile = useStore.getState().updateProfile;
  try {
    setIsLoading(true);

    // 1. Authenticate with Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

    if (authError) throw authError;

    if (authData.user) {
      // 2. Check each user type table for the user's ID
      const userTypes = ["landlord", "tenant", "contractor"];

      for (const userType of userTypes) {
        const { data: userData, error: userError } = await supabase
          .from(userType)
          .select("role, full_name, email, uid, id, phone")
          .eq("id", authData.user.id)
          .single();
        const role = await userData.role;
        console.log(userData);
        updateProfile({
          userName: userData.full_name,
          role: userData.role,
          email: userData.email,
          uid: userData.uid,
          id: userData.id,
          phone: userData.phone,
        });
        if (!userError && userData) {
          // User found in this table, return the role and user type
          return role;
        }
      }
      // If we get here, the user wasn't found in any table
      throw new Error("User not found in any role table");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

export default login;
