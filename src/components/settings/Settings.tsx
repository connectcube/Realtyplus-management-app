import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useStore} from "@/lib/zustand";
import {auth, fireDataBase} from "@/lib/firebase";
import {updateProfile, updateEmail, deleteUser, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
import {doc, updateDoc, deleteDoc} from "firebase/firestore";
import {toast} from "react-toastify";
import {User, Settings as SettingsIcon, Shield, Trash2, Save, X, Eye, EyeOff} from "lucide-react";

import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "../ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Switch} from "../ui/switch";

export default function Settings() {
   const {user, setUser, clearUser} = useStore();
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

   // Form states
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      notifications: {
         email: true,
         push: true
      }
   });

   // Delete account states
   const [deleteConfirmation, setDeleteConfirmation] = useState("");
   const [deletePassword, setDeletePassword] = useState("");

   // Error states
   const [errors, setErrors] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      deletePassword: ""
   });

   // Load user data when component mounts
   useEffect(() => {
      if (user) {
         const nameParts = user.userName ? user.userName.split(" ") : ["", ""];
         setFormData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: user.email || "",
            phone: user.phone || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            notifications: {
               email: true,
               push: true
            }
         });
      } else {
         // Redirect to login if no user
         navigate("/login");
      }
   }, [user, navigate]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormData({
         ...formData,
         [name]: value
      });

      // Clear error when user types
      if (errors[name as keyof typeof errors]) {
         setErrors({
            ...errors,
            [name]: ""
         });
      }
   };

   const handleNotificationChange = (type: "email" | "push", checked: boolean) => {
      setFormData({
         ...formData,
         notifications: {
            ...formData.notifications,
            [type]: checked
         }
      });
   };

   const validateForm = () => {
      const newErrors = {...errors};
      let isValid = true;

      if (!formData.firstName.trim()) {
         newErrors.firstName = "First name is required";
         isValid = false;
      }

      if (!formData.lastName.trim()) {
         newErrors.lastName = "Last name is required";
         isValid = false;
      }

      if (!formData.email.trim()) {
         newErrors.email = "Email is required";
         isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = "Email is invalid";
         isValid = false;
      }

      if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
         newErrors.phone = "Phone number is invalid";
         isValid = false;
      }

      // Password validation only if user is trying to change password
      if (formData.newPassword || formData.confirmPassword) {
         if (!formData.currentPassword) {
            newErrors.currentPassword = "Current password is required to set a new password";
            isValid = false;
         }

         if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
            isValid = false;
         }

         if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
         }
      }

      setErrors(newErrors);
      return isValid;
   };

   const handleSaveProfile = async () => {
      if (!validateForm()) return;

      setIsLoading(true);
      try {
         const currentUser = auth.currentUser;
         if (!currentUser || !user?.uid) {
            toast.error("You must be logged in to update your profile");
            return;
         }

         // Update display name in Firebase Auth
         const fullName = `${formData.firstName} ${formData.lastName}`.trim();
         await updateProfile(currentUser, {
            displayName: fullName
         });

         // Update email if changed
         if (formData.email !== user.email && formData.currentPassword) {
            const credential = EmailAuthProvider.credential(user.email || "", formData.currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updateEmail(currentUser, formData.email);
         }

         // Update user document in Firestore
         const userRef = doc(fireDataBase, user.role + "s", user.uid);
         await updateDoc(userRef, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            userName: fullName,
            email: formData.email,
            phone: formData.phone,
            notificationPreferences: formData.notifications
         });

         // Update local state
         setUser({
            ...user,
            userName: fullName,
            email: formData.email,
            phone: formData.phone
         });

         toast.success("Profile updated successfully");

         // Clear password fields
         setFormData({
            ...formData,
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
         });
      } catch (error: any) {
         console.error("Error updating profile:", error);
         if (error.code === "auth/wrong-password") {
            setErrors({
               ...errors,
               currentPassword: "Incorrect password"
            });
         } else if (error.code === "auth/requires-recent-login") {
            toast.error("Please log out and log back in to update your email");
         } else {
            toast.error(error.message || "Failed to update profile");
         }
      } finally {
         setIsLoading(false);
      }
   };

   const handleDeleteAccount = async () => {
      if (deleteConfirmation !== "DELETE") {
         setErrors({
            ...errors,
            deletePassword: "Please type DELETE to confirm"
         });
         return;
      }

      if (!deletePassword) {
         setErrors({
            ...errors,
            deletePassword: "Password is required"
         });
         return;
      }

      setIsLoading(true);
      try {
         const currentUser = auth.currentUser;
         if (!currentUser || !user?.uid) {
            toast.error("You must be logged in to delete your account");
            return;
         }

         // Re-authenticate user before deletion
         const credential = EmailAuthProvider.credential(user.email || "", deletePassword);
         await reauthenticateWithCredential(currentUser, credential);

         // Delete user document from Firestore
         const userRef = doc(fireDataBase, user.role + "s", user.uid);
         await deleteDoc(userRef);

         // Delete user from Firebase Auth
         await deleteUser(currentUser);

         // Clear local state
         clearUser();
         toast.success("Your account has been deleted");
         navigate("/");
      } catch (error: any) {
         console.error("Error deleting account:", error);
         if (error.code === "auth/wrong-password") {
            setErrors({
               ...errors,
               deletePassword: "Incorrect password"
            });
         } else {
            toast.error(error.message || "Failed to delete account");
         }
      } finally {
         setIsLoading(false);
         setShowDeleteDialog(false);
      }
   };

   return (
      <div className="mx-auto px-4 py-8 container">
         <h1 className="flex items-center mb-6 font-bold text-2xl">
            <SettingsIcon className="mr-2 w-6 h-6" />
            Account Settings
         </h1>

         <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
               <TabsTrigger value="profile" className="flex items-center">
                  <User className="mr-2 w-4 h-4" />
                  Profile
               </TabsTrigger>
               <TabsTrigger value="security" className="flex items-center">
                  <Shield className="mr-2 w-4 h-4" />
                  Security
               </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
               <div className="gap-6 grid md:grid-cols-2">
                  <Card>
                     <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex flex-col items-center mb-6">
                           <Avatar className="mb-4 w-24 h-24">
                              <AvatarImage
                                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName || "guest"}`}
                                 alt={user?.userName || "Profile"}
                              />
                              <AvatarFallback>{user?.userName?.substring(0, 2).toUpperCase() || "RP"}</AvatarFallback>
                           </Avatar>
                           <Button variant="outline" size="sm">
                              Change Avatar
                           </Button>
                        </div>

                        <div className="gap-4 grid md:grid-cols-2">
                           <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                 id="firstName"
                                 name="firstName"
                                 value={formData.firstName}
                                 onChange={handleInputChange}
                                 placeholder="John"
                              />
                              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                 id="lastName"
                                 name="lastName"
                                 value={formData.lastName}
                                 onChange={handleInputChange}
                                 placeholder="Doe"
                              />
                              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="email">Email</Label>
                           <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john.doe@example.com"
                           />
                           {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="phone">Phone Number</Label>
                           <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1234567890" />
                           {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </div>
                     </CardContent>
                     <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                           Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
                           {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                     </CardFooter>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                        <CardDescription>Manage how you receive notifications.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                           <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-gray-500 text-sm">Receive notifications via email</p>
                           </div>
                           <Switch
                              checked={formData.notifications.email}
                              onCheckedChange={checked => handleNotificationChange("email", checked)}
                           />
                        </div>
                        <div className="flex justify-between items-center">
                           <div>
                              <p className="font-medium">Push Notifications</p>
                              <p className="text-gray-500 text-sm">Receive push notifications on your device</p>
                           </div>
                           <Switch
                              checked={formData.notifications.push}
                              onCheckedChange={checked => handleNotificationChange("push", checked)}
                           />
                        </div>
                     </CardContent>
                     <CardFooter>
                        <p className="text-gray-500 text-sm">You can change these settings at any time.</p>
                     </CardFooter>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="security">
               <div className="gap-6 grid md:grid-cols-2">
                  <Card>
                     <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password to keep your account secure.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="currentPassword">Current Password</Label>
                           <div className="relative">
                              <Input
                                 id="currentPassword"
                                 name="currentPassword"
                                 type={showPassword ? "text" : "password"}
                                 value={formData.currentPassword}
                                 onChange={handleInputChange}
                                 placeholder="••••••••"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="top-1/2 right-3 absolute -translate-y-1/2">
                                 {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                              </button>
                           </div>
                           {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="newPassword">New Password</Label>
                           <Input
                              id="newPassword"
                              name="newPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              placeholder="••••••••"
                           />
                           {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="confirmPassword">Confirm New Password</Label>
                           <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="••••••••"
                           />
                           {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                        </div>
                     </CardContent>
                     <CardFooter>
                        <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-red-600 hover:bg-red-700 ml-auto text-white">
                           {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                     </CardFooter>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>Irreversible and destructive actions.</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="bg-red-50 p-4 border border-red-200 rounded-md">
                           <div className="flex items-start">
                              <Trash2 className="mr-3 w-5 h-5 text-red-600" />
                              <div>
                                 <h3 className="font-medium text-red-600">Delete Account</h3>
                                 <p className="mt-1 text-gray-700 text-sm">
                                    Once you delete your account, there is no going back. All your data will be permanently removed.
                                 </p>
                                 <Button variant="destructive" className="mt-4" onClick={() => setShowDeleteDialog(true)}>
                                    Delete Account
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>

         {/* Delete Account Dialog */}
         <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                  <DialogDescription>
                     This action cannot be undone. This will permanently delete your account and remove all your data.
                  </DialogDescription>
               </DialogHeader>
               <div className="space-y-4 py-2">
                  <div className="space-y-2">
                     <Label htmlFor="deleteConfirmation">
                        Type <span className="font-bold">DELETE</span> to confirm
                     </Label>
                     <Input
                        id="deleteConfirmation"
                        value={deleteConfirmation}
                        onChange={e => setDeleteConfirmation(e.target.value)}
                        placeholder="DELETE"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="deletePassword">Enter your password</Label>
                     <Input
                        id="deletePassword"
                        type="password"
                        value={deletePassword}
                        onChange={e => setDeletePassword(e.target.value)}
                        placeholder="••••••••"
                     />
                     {errors.deletePassword && <p className="text-red-500 text-sm">{errors.deletePassword}</p>}
                  </div>
               </div>
               <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                     Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading || deleteConfirmation !== "DELETE"}>
                     {isLoading ? "Deleting..." : "Delete Account"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
