import { supabase } from "@/lib/supabase";
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

    // Sign up with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          userType: formData.userType,
          fullName: formData.name,
          phone: formData.phone || "NA",
        },
      },
    });
    if (signUpError) throw signUpError;

    if (authData.user) {
      // 2. Insert into users table
      const { error: profileError } = await supabase
        .from(formData.userType)
        .insert({
          id: authData.user.id, // This must match the authenticated user's ID
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone || "NA",
          role: formData.userType,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Optionally clean up the auth user if profile creation fails
        await supabase.auth.signOut();
        return null;
      }

      return "/login"; // return route string instead to tell to router to specific place
    }
  } catch (error: any) {
    console.error("Error signing up:", error);
  } finally {
    setIsLoading(false);
  }
};
export default userRegistration;
