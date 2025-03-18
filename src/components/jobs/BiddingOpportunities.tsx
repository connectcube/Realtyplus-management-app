import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  DollarSign,
  Home,
  Wrench,
  Hammer,
} from "lucide-react";

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
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<BidOpportunity | null>(null);
  const [bidFormOpen, setBidFormOpen] = useState(false);
  const [bidFormData, setBidFormData] = useState<BidFormData>({
    amount: "",
    estimatedHours: "",
    availableDate: undefined,
    notes: "",
  });
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for bidding opportunities
  const mockOpportunities: BidOpportunity[] = [
    {
      id: "1",
      title: "Leaking Bathroom Faucet",
      property: "Sunset Apartments, Unit 203",
      description:
        "The bathroom sink faucet is leaking and needs repair or replacement.",
      category: "Plumbing",
      priority: "medium",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: "open",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: "2",
      title: "HVAC System Maintenance",
      property: "Oakwood Heights, Unit 105",
      description:
        "Annual maintenance check for the HVAC system required before summer.",
      category: "HVAC",
      priority: "low",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "open",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
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
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "4",
      title: "Kitchen Cabinet Repair",
      property: "Maple Grove Apartments, Unit 301",
      description:
        "Several kitchen cabinet doors are loose and need to be fixed.",
      category: "Carpentry",
      priority: "medium",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: "open",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: "5",
      title: "Electrical Outlet Replacement",
      property: "Sunset Apartments, Unit 105",
      description:
        "Two electrical outlets in the bedroom are not working and need replacement.",
      category: "Electrical",
      priority: "high",
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      status: "closed",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  ];

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return opp.status === "open";
    if (activeTab === "high")
      return opp.priority === "high" && opp.status === "open";
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
      notes: "",
    });
    setBidFormOpen(false);
  };

  const getPriorityBadge = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Low
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Medium
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
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
        return <Wrench className="h-4 w-4 mr-1" />;
      case "hvac":
        return <Clock className="h-4 w-4 mr-1" />;
      case "electrical":
        return <Hammer className="h-4 w-4 mr-1" />;
      default:
        return <Home className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Bidding Opportunities
        </h2>
        <p className="text-gray-600">
          View and bid on available maintenance requests
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Opportunities</TabsTrigger>
          <TabsTrigger value="open">Open Bids</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredOpportunities.map((opportunity) => (
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
          {filteredOpportunities.map((opportunity) => (
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
          {filteredOpportunities.map((opportunity) => (
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
        onOpenChange={(open) => {
          if (!open) setSelectedOpportunity(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          {selectedOpportunity && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedOpportunity.title}</DialogTitle>
                <DialogDescription className="flex items-center text-sm text-gray-500">
                  <Home className="h-4 w-4 mr-1" />
                  {selectedOpportunity.property}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getCategoryIcon(selectedOpportunity.category)}
                    <span className="text-sm font-medium">
                      {selectedOpportunity.category}
                    </span>
                  </div>
                  {getPriorityBadge(selectedOpportunity.priority)}
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-1">Description</h4>
                  <p className="text-sm text-gray-600">
                    {selectedOpportunity.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Deadline</h4>
                    <p className="text-sm text-gray-600">
                      {format(selectedOpportunity.deadline, "PPP")}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Status</h4>
                    <Badge
                      variant={
                        selectedOpportunity.status === "open"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedOpportunity.status.charAt(0).toUpperCase() +
                        selectedOpportunity.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedOpportunity(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => setBidFormOpen(true)}
                  disabled={selectedOpportunity.status !== "open"}
                >
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
                <DialogTitle>
                  Submit Bid for {selectedOpportunity.title}
                </DialogTitle>
                <DialogDescription>
                  Enter your bid details for this maintenance request.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="amount" className="text-sm font-medium">
                        Bid Amount ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="amount"
                          placeholder="0.00"
                          className="pl-8"
                          value={bidFormData.amount}
                          onChange={(e) =>
                            setBidFormData({
                              ...bidFormData,
                              amount: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="hours" className="text-sm font-medium">
                        Estimated Hours
                      </label>
                      <Input
                        id="hours"
                        placeholder="0"
                        value={bidFormData.estimatedHours}
                        onChange={(e) =>
                          setBidFormData({
                            ...bidFormData,
                            estimatedHours: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium">
                      Available Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bidFormData.availableDate ? (
                            format(bidFormData.availableDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bidFormData.availableDate}
                          onSelect={(date) =>
                            setBidFormData({
                              ...bidFormData,
                              availableDate: date,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Additional Notes
                    </label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional information about your bid..."
                      className="min-h-[100px]"
                      value={bidFormData.notes}
                      onChange={(e) =>
                        setBidFormData({
                          ...bidFormData,
                          notes: e.target.value,
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

const OpportunityCard = ({
  opportunity,
  onViewDetails,
  onBidNow,
  getPriorityBadge,
  getCategoryIcon,
}: OpportunityCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{opportunity.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Home className="h-4 w-4 mr-1" />
              {opportunity.property}
            </CardDescription>
          </div>
          {getPriorityBadge(opportunity.priority)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          {getCategoryIcon(opportunity.category)}
          <span>{opportunity.category}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {opportunity.description}
        </p>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span>Due: {format(opportunity.deadline, "MMM d, yyyy")}</span>
          </div>
          <Badge
            variant={opportunity.status === "open" ? "default" : "secondary"}
          >
            {opportunity.status.charAt(0).toUpperCase() +
              opportunity.status.slice(1)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
          <Button
            size="sm"
            onClick={onBidNow}
            disabled={opportunity.status !== "open"}
          >
            Submit Bid
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BiddingOpportunities;
