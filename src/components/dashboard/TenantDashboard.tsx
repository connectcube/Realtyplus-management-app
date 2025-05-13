import React, {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {Card} from "../ui/card";
import RentStatusCard from "./RentStatusCard";
import MaintenanceRequestForm from "../maintenance/MaintenanceRequestForm";
import RequestHistoryList from "../maintenance/RequestHistoryList";
import MessageCenter from "../communication/MessageCenter";
import {Home, Wrench, FileText, MessageCircle, Star} from "lucide-react";
import RatingStars from "@/components/rating/RatingStars";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useStore} from "@/lib/zustand";

interface TenantDashboardProps {
   tenantName?: string;
   propertyAddress?: string;
   rentInfo?: {
      dueDate: string;
      amount: number;
      status: "paid" | "due" | "overdue" | "partially_paid";
      remainingDays: number;
      percentagePaid: number;
   };
}

const TenantDashboard = ({
   tenantName = "Alex Johnson",
   propertyAddress = "123 Main Street, Apt 4B, Cityville, ST 12345",
   rentInfo = {
      dueDate: "2023-06-15",
      amount: 1200,
      status: "due" as const,
      remainingDays: 5,
      percentagePaid: 0
   }
}: TenantDashboardProps) => {
   const {user, setUser} = useStore();
   const [activeTab, setActiveTab] = useState("rent");
   const [showRatingDialog, setShowRatingDialog] = useState(false);
   const [landlordRating, setLandlordRating] = useState(0);
   const [ratingComment, setRatingComment] = useState("");
   useEffect(() => {
      if (!user) {
         return;
      }

      console.log(user);
   });
   return (
      <div className="bg-gray-50 w-full min-h-screen">
         {/* Dashboard Header */}
         <div className="bg-white shadow-sm p-6 border-b">
            <div className="mx-auto max-w-7xl">
               <h1 className="font-bold text-gray-900 text-2xl">Welcome, {tenantName}</h1>
               <p className="mt-1 text-gray-600">{propertyAddress}</p>
            </div>
         </div>

         {/* Dashboard Content */}
         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
               <div className="bg-white shadow-sm p-2 rounded-lg">
                  <TabsList className="justify-start gap-2 grid grid-cols-4 w-full">
                     <TabsTrigger value="rent" className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Rent Status
                     </TabsTrigger>
                     <TabsTrigger value="request" className="flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        New Request
                     </TabsTrigger>
                     <TabsTrigger value="history" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Request History
                     </TabsTrigger>
                     <TabsTrigger value="messages" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Messages
                     </TabsTrigger>
                  </TabsList>
               </div>

               <TabsContent value="rent" className="space-y-6 mt-6">
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                     <RentStatusCard
                        dueDate={rentInfo.dueDate}
                        amount={rentInfo.amount}
                        status={rentInfo.status}
                        remainingDays={rentInfo.remainingDays}
                        percentagePaid={rentInfo.percentagePaid}
                        enablePayment={true}
                     />

                     <Card className="bg-white shadow-md p-6">
                        <h2 className="mb-4 font-bold text-xl">Property Information</h2>
                        <div className="space-y-4">
                           <div>
                              <h3 className="font-medium text-gray-500 text-sm">Property Manager</h3>
                              <p className="mt-1">Jane Smith</p>
                              <p className="text-gray-500 text-sm">jane.smith@property.com</p>
                              <p className="text-gray-500 text-sm">(555) 123-4567</p>
                           </div>

                           <div>
                              <h3 className="font-medium text-gray-500 text-sm">Lease Information</h3>
                              <p className="mt-1">Start Date: January 1, 2023</p>
                              <p className="text-gray-500 text-sm">End Date: December 31, 2023</p>
                              <p className="text-gray-500 text-sm">Monthly Rent: ZMW 1,200</p>
                              <Button
                                 variant="link"
                                 className="mt-2 p-0 h-auto text-blue-600 text-sm"
                                 onClick={() => setShowRatingDialog(true)}>
                                 Rate your landlord
                              </Button>
                           </div>

                           <div>
                              <h3 className="font-medium text-gray-500 text-sm">Emergency Contacts</h3>
                              <p className="mt-1">Maintenance: (555) 987-6543</p>
                              <p className="text-gray-500 text-sm">After Hours: (555) 789-0123</p>
                           </div>
                        </div>
                     </Card>
                  </div>
               </TabsContent>

               <TabsContent value="request" className="mt-6">
                  <MaintenanceRequestForm />
               </TabsContent>

               <TabsContent value="history" className="mt-6">
                  <RequestHistoryList />
               </TabsContent>

               <TabsContent value="messages" className="mt-6">
                  <div className="h-[600px]">
                     <MessageCenter />
                  </div>
               </TabsContent>
            </Tabs>
         </div>

         {/* Landlord Rating Dialog */}
         <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Rate Your Landlord</DialogTitle>
                  <DialogDescription>Please rate your experience with your landlord.</DialogDescription>
               </DialogHeader>
               <div className="space-y-4 py-4">
                  <div className="space-y-2">
                     <Label htmlFor="rating">Rating</Label>
                     <RatingStars rating={landlordRating} onRatingChange={setLandlordRating} />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="comment">Comments (Optional)</Label>
                     <Textarea
                        id="comment"
                        placeholder="Share your experience with your landlord..."
                        value={ratingComment}
                        onChange={e => setRatingComment(e.target.value)}
                     />
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => {
                        setShowRatingDialog(false);
                     }}>
                     Cancel
                  </Button>
                  <Button
                     onClick={() => {
                        console.log(`Rated landlord ${landlordRating} stars with comment: ${ratingComment}`);
                        setShowRatingDialog(false);
                        setLandlordRating(0);
                        setRatingComment("");
                        alert("Thank you for your feedback! Your rating has been submitted.");
                     }}>
                     Submit Rating
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default TenantDashboard;
