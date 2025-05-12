import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Menu, Bell, User, LogOut, Settings, Home} from "lucide-react";
import {Button} from "../ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {signOut} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {useStore} from "@/lib/zustand";
import {toast} from "react-toastify";

interface HeaderProps {
   onMenuToggle?: () => void;
}

const Header = ({onMenuToggle = () => {}}: HeaderProps) => {
   const {user, clearUser} = useStore();
   const navigate = useNavigate();
   const [showDropdown, setShowDropdown] = useState(false);

   // Debug message to verify state changes
   useEffect(() => {
      console.log("Dropdown state:", showDropdown);
   }, [showDropdown]);

   const handleSignOut = async () => {
      try {
         await signOut(auth);
         clearUser();
         toast.success("Successfully logged out");
         navigate("/");
      } catch (error) {
         console.error("Error signing out:", error);
         toast.error("Failed to log out. Please try again.");
      }
   };

   const getUserInitials = () => {
      if (user?.userName) {
         return user.userName.substring(0, 2).toUpperCase();
      }
      return "RP";
   };

   const getRoleDisplay = () => {
      if (!user?.role) return "";
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
   };

   // Simple function to toggle dropdown
   const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
   };

   return (
      <header className="top-0 z-10 sticky bg-red-600 shadow-md w-full text-white">
         <div className="flex justify-between items-center mx-auto px-4 h-20 container">
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="md:hidden hover:bg-red-700 text-white" onClick={onMenuToggle}>
                  <Menu className="w-6 h-6" />
               </Button>
               <Link to="/" className="flex justify-center items-center gap-2">
                  <div className="bg-white rounded-full size-1"></div>
                  <h1 className="font-bold text-xl">RealtyPlus</h1>
               </Link>
            </div>

            <div className="flex items-center gap-4">
               <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-red-700 text-white"
                  onClick={() => navigate("/notifications")}>
                  <Bell className="w-5 h-5" />
                  {user?.notifications && (user.notifications.messages.length > 0 || user.notifications.requests.length > 0) && (
                     <span className="-top-1 -right-1 absolute flex justify-center items-center bg-yellow-400 rounded-full w-5 h-5 font-bold text-black text-xs">
                        {user.notifications.messages.length + user.notifications.requests.length}
                     </span>
                  )}
               </Button>

               {/* Simple dropdown implementation */}
               <div className="relative">
                  <button
                     onClick={toggleDropdown}
                     className="flex items-center gap-2 hover:bg-red-700 px-3 py-2 rounded-md transition-colors">
                     <Avatar className="w-8 h-8">
                        <AvatarImage
                           src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName || "guest"}`}
                           alt={user?.userName || "Guest"}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                     </Avatar>
                     <div className="hidden md:flex flex-col items-start">
                        <span className="font-medium text-sm">{user?.userName || "Guest"}</span>
                        {user?.role && <span className="text-white/80 text-xs">{getRoleDisplay()}</span>}
                     </div>
                  </button>

                  {/* Debug indicator */}
                  <div
                     className="-top-2 -right-2 absolute bg-green-500 rounded-full w-2 h-2"
                     style={{display: showDropdown ? "block" : "none"}}></div>

                  {/* Dropdown menu */}
                  {showDropdown && (
                     <div
                        className="right-0 absolute bg-white ring-opacity-5 shadow-lg mt-2 rounded-md focus:outline-none ring-1 ring-black w-56 origin-top-right"
                        style={{zIndex: 1000}}>
                        <div className="py-1">
                           <div className="px-4 py-2 border-gray-100 border-b font-medium text-gray-900 text-sm">My Account</div>
                           <a
                              href="#"
                              className="block flex items-center hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm"
                              onClick={e => {
                                 e.preventDefault();
                                 navigate("/settings");
                                 setShowDropdown(false);
                              }}>
                              <Settings className="mr-2 w-4 h-4" />
                              Settings
                           </a>

                           <div className="my-1 border-gray-100 border-t"></div>

                           <a
                              href="#"
                              className="block flex items-center hover:bg-gray-100 px-4 py-2 text-red-600 text-sm"
                              onClick={e => {
                                 e.preventDefault();
                                 handleSignOut();
                                 setShowDropdown(false);
                              }}>
                              <LogOut className="mr-2 w-4 h-4" />
                              Logout
                           </a>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
