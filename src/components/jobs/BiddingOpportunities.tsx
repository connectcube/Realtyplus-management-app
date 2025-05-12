import React, {useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {Badge} from "../ui/badge";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";

import {Calendar} from "../ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {format} from "date-fns";
import {CalendarIcon, Clock, DollarSign, Home, Wrench, Hammer} from "lucide-react";

interface BidOpportunity {
   id: string;
   title: string;
   property: string;
   description: string;
   category: string;
   priority: "low" | "medium" | "high";
   deadline: Date;
   status: "open" | "closed";
   createdAt: Date;
}

interface BidFormData {
   amount: string;
   estimatedHours: string;
   availableDate: Date | undefined;
   notes: string;
}

const BiddingOpportunities = () => {
   const [selectedOpportunity, setSelectedOpportunity] = useState<BidOpportunity | null>(null);
   const [bidFormOpen, setBidFormOpen] = useState(false);
   const [bidFormData, setBidFormData] = useState<BidFormData>({
      amount: "",
      estimatedHours: "",
      availableDate: undefined,
      notes: ""
   });
   const [activeTab, setActiveTab] = useState("all");

   // Mock data for bidding opportunities
   const mockOpportunities: BidOpportunity[] = [
      {
         id: "1",
         title: "Leaking Bathroom Faucet",
         property: "Sunset Apartments, Unit 203",
         description: "The bathroom sink faucet is leaking and needs repair or replacement.",
         category: "Plumbing",
         priority: "medium",
         deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
         status: "open",
         createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
         id: "2",
         title: "HVAC System Maintenance",
         property: "Oakwood Heights, Unit 105",
         description: "Annual maintenance check for the HVAC system required before summer.",
         category: "HVAC",
         priority: "low",
         deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
         status: "open",
         createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
         id: "3",
         title: "Broken Window Replacement",
         property: "Riverside Condos, Unit 412",
         description: "Living room window is cracked and needs to be replaced.",
         category: "Windows",
         priority: "high",
         deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
         status: "open",
         createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
         id: "4",
         title: "Kitchen Cabinet Repair",
         property: "Maple Grove Apartments, Unit 301",
         description: "Several kitchen cabinet doors are loose and need to be fixed.",
         category: "Carpentry",
         priority: "medium",
         deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
         status: "open",
         createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
         id: "5",
         title: "Electrical Outlet Replacement",
         property: "Sunset Apartments, Unit 105",
         description: "Two electrical outlets in the bedroom are not working and need replacement.",
         category: "Electrical",
         priority: "high",
         deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
         status: "closed",
         createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      }
   ];

   const filteredOpportunities = mockOpportunities.filter(opp => {
      if (activeTab === "all") return true;
      if (activeTab === "open") return opp.status === "open";
      if (activeTab === "high") return opp.priority === "high" && opp.status === "open";
      return false;
   });

   const handleBidSubmit = () => {
      // In a real app, this would send the bid to the backend
      console.log("Submitting bid for opportunity:", selectedOpportunity?.id);
      console.log("Bid details:", bidFormData);

      // Reset form and close dialog
      setBidFormData({
         amount: "",
         estimatedHours: "",
         availableDate: undefined,
         notes: ""
      });
      setBidFormOpen(false);

      // Notify the user
      alert("Your bid has been submitted successfully! The landlord will be notified and will contact you if your bid is accepted.");
   };

   const getPriorityBadge = (priority: "low" | "medium" | "high") => {
      switch (priority) {
         case "low":
            return (
               <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  Low
               </Badge>
            );
         case "medium":
            return (
               <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                  Medium
               </Badge>
            );
         case "high":
            return (
               <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
                  High
               </Badge>
            );
         default:
            return null;
      }
   };

   const getCategoryIcon = (category: string) => {
      switch (category.toLowerCase()) {
         case "plumbing":
            return <Wrench className="mr-1 w-4 h-4" />;
         case "hvac":
            return <Clock className="mr-1 w-4 h-4" />;
         case "electrical":
            return <Hammer className="mr-1 w-4 h-4" />;
         default:
            return <Home className="mr-1 w-4 h-4" />;
      }
   };

   return (
      <div className="bg-white p-6 w-full h-full">
         <div className="mb-6">
            <h2 className="font-bold text-gray-800 text-2xl">Bidding Opportunities</h2>
            <p className="text-gray-600">View and bid on available maintenance requests</p>
         </div>

         <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
               <TabsTrigger value="all">All Opportunities</TabsTrigger>
               <TabsTrigger value="open">Open Bids</TabsTrigger>
               <TabsTrigger value="high">High Priority</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
               {filteredOpportunities.map(opportunity => (
                  <OpportunityCard
                     key={opportunity.id}
                     opportunity={opportunity}
                     onViewDetails={() => setSelectedOpportunity(opportunity)}
                     onBidNow={() => {
                        setSelectedOpportunity(opportunity);
                        setBidFormOpen(true);
                     }}
                     getPriorityBadge={getPriorityBadge}
                     getCategoryIcon={getCategoryIcon}
                  />
               ))}
            </TabsContent>

            <TabsContent value="open" className="space-y-4">
               {filteredOpportunities.map(opportunity => (
                  <OpportunityCard
                     key={opportunity.id}
                     opportunity={opportunity}
                     onViewDetails={() => setSelectedOpportunity(opportunity)}
                     onBidNow={() => {
                        setSelectedOpportunity(opportunity);
                        setBidFormOpen(true);
                     }}
                     getPriorityBadge={getPriorityBadge}
                     getCategoryIcon={getCategoryIcon}
                  />
               ))}
            </TabsContent>

            <TabsContent value="high" className="space-y-4">
               {filteredOpportunities.map(opportunity => (
                  <OpportunityCard
                     key={opportunity.id}
                     opportunity={opportunity}
                     onViewDetails={() => setSelectedOpportunity(opportunity)}
                     onBidNow={() => {
                        setSelectedOpportunity(opportunity);
                        setBidFormOpen(true);
                     }}
                     getPriorityBadge={getPriorityBadge}
                     getCategoryIcon={getCategoryIcon}
                  />
               ))}
            </TabsContent>
         </Tabs>

         {/* Opportunity Details Dialog */}
         <Dialog
            open={!!selectedOpportunity && !bidFormOpen}
            onOpenChange={open => {
               if (!open) setSelectedOpportunity(null);
            }}>
            <DialogContent className="sm:max-w-[500px]">
               {selectedOpportunity && (
                  <>
                     <DialogHeader>
                        <DialogTitle>{selectedOpportunity.title}</DialogTitle>
                        <DialogDescription className="flex items-center text-gray-500 text-sm">
                           <Home className="mr-1 w-4 h-4" />
                           {selectedOpportunity.property}
                        </DialogDescription>
                     </DialogHeader>
                     <div className="py-4">
                        <div className="flex justify-between items-center mb-2">
                           <div className="flex items-center">
                              {getCategoryIcon(selectedOpportunity.category)}
                              <span className="font-medium text-sm">{selectedOpportunity.category}</span>
                           </div>
                           {getPriorityBadge(selectedOpportunity.priority)}
                        </div>

                        <div className="mb-4">
                           <h4 className="mb-1 font-semibold text-sm">Description</h4>
                           <p className="text-gray-600 text-sm">{selectedOpportunity.description}</p>
                        </div>

                        <div className="gap-4 grid grid-cols-2 mb-4">
                           <div>
                              <h4 className="mb-1 font-semibold text-sm">Deadline</h4>
                              <p className="text-gray-600 text-sm">{format(selectedOpportunity.deadline, "PPP")}</p>
                           </div>
                           <div>
                              <h4 className="mb-1 font-semibold text-sm">Status</h4>
                              <Badge variant={selectedOpportunity.status === "open" ? "default" : "secondary"}>
                                 {selectedOpportunity.status.charAt(0).toUpperCase() + selectedOpportunity.status.slice(1)}
                              </Badge>
                           </div>
                        </div>
                     </div>
                     <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedOpportunity(null)}>
                           Close
                        </Button>
                        <Button onClick={() => setBidFormOpen(true)} disabled={selectedOpportunity.status !== "open"}>
                           Submit Bid
                        </Button>
                     </DialogFooter>
                  </>
               )}
            </DialogContent>
         </Dialog>

         {/* Bid Submission Form Dialog */}
         <Dialog open={bidFormOpen} onOpenChange={setBidFormOpen}>
            <DialogContent className="sm:max-w-[500px]">
               {selectedOpportunity && (
                  <>
                     <DialogHeader>
                        <DialogTitle>Submit Bid for {selectedOpportunity.title}</DialogTitle>
                        <DialogDescription>Enter your bid details for this maintenance request.</DialogDescription>
                     </DialogHeader>
                     <div className="py-4">
                        <div className="gap-4 grid">
                           <div className="gap-4 grid grid-cols-2">
                              <div className="space-y-2">
                                 <label htmlFor="amount" className="font-medium text-sm">
                                    Bid Amount ($)
                                 </label>
                                 <div className="relative">
                                    <DollarSign className="top-2.5 left-2 absolute w-4 h-4 text-gray-500" />
                                    <Input
                                       id="amount"
                                       placeholder="0.00"
                                       className="pl-8"
                                       value={bidFormData.amount}
                                       onChange={e =>
                                          setBidFormData({
                                             ...bidFormData,
                                             amount: e.target.value
                                          })
                                       }
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label htmlFor="hours" className="font-medium text-sm">
                                    Estimated Hours
                                 </label>
                                 <Input
                                    id="hours"
                                    placeholder="0"
                                    value={bidFormData.estimatedHours}
                                    onChange={e =>
                                       setBidFormData({
                                          ...bidFormData,
                                          estimatedHours: e.target.value
                                       })
                                    }
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label htmlFor="date" className="font-medium text-sm">
                                 Available Start Date
                              </label>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button variant="outline" className="justify-start w-full font-normal text-left">
                                       <CalendarIcon className="mr-2 w-4 h-4" />
                                       {bidFormData.availableDate ? format(bidFormData.availableDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="p-0 w-auto">
                                    <Calendar
                                       mode="single"
                                       selected={bidFormData.availableDate}
                                       onSelect={date =>
                                          setBidFormData({
                                             ...bidFormData,
                                             availableDate: date
                                          })
                                       }
                                       initialFocus
                                    />
                                 </PopoverContent>
                              </Popover>
                           </div>

                           <div className="space-y-2">
                              <label htmlFor="notes" className="font-medium text-sm">
                                 Additional Notes
                              </label>
                              <Textarea
                                 id="notes"
                                 placeholder="Add any additional information about your bid..."
                                 className="min-h-[100px]"
                                 value={bidFormData.notes}
                                 onChange={e =>
                                    setBidFormData({
                                       ...bidFormData,
                                       notes: e.target.value
                                    })
                                 }
                              />
                           </div>
                        </div>
                     </div>
                     <DialogFooter>
                        <Button variant="outline" onClick={() => setBidFormOpen(false)}>
                           Cancel
                        </Button>
                        <Button onClick={handleBidSubmit}>Submit Bid</Button>
                     </DialogFooter>
                  </>
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
};

interface OpportunityCardProps {
   opportunity: BidOpportunity;
   onViewDetails: () => void;
   onBidNow: () => void;
   getPriorityBadge: (priority: "low" | "medium" | "high") => React.ReactNode;
   getCategoryIcon: (category: string) => React.ReactNode;
}

const OpportunityCard = ({opportunity, onViewDetails, onBidNow, getPriorityBadge, getCategoryIcon}: OpportunityCardProps) => {
   return (
      <Card className="w-full">
         <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
               <div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                     <Home className="mr-1 w-4 h-4" />
                     {opportunity.property}
                  </CardDescription>
               </div>
               {getPriorityBadge(opportunity.priority)}
            </div>
         </CardHeader>
         <CardContent className="pb-2">
            <div className="flex items-center mb-2 text-gray-500 text-sm">
               {getCategoryIcon(opportunity.category)}
               <span>{opportunity.category}</span>
            </div>
            <p className="mb-2 text-gray-600 text-sm line-clamp-2">{opportunity.description}</p>
            <div className="flex justify-between text-sm">
               <div className="flex items-center">
                  <CalendarIcon className="mr-1 w-4 h-4 text-gray-500" />
                  <span>Due: {format(opportunity.deadline, "MMM d, yyyy")}</span>
               </div>
               <Badge variant={opportunity.status === "open" ? "default" : "secondary"}>
                  {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
               </Badge>
            </div>
         </CardContent>
         <CardFooter className="pt-2">
            <div className="flex justify-between w-full">
               <Button variant="outline" size="sm" onClick={onViewDetails}>
                  View Details
               </Button>
               <Button size="sm" onClick={onBidNow} disabled={opportunity.status !== "open"}>
                  Submit Bid
               </Button>
            </div>
         </CardFooter>
      </Card>
   );
};

export default BiddingOpportunities;
