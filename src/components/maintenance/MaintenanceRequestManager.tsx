import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CheckCircle,
  Clock,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Wrench,
} from "lucide-react";
import MaintenanceRequestForm from "./MaintenanceRequestForm";

interface MaintenanceRequest {
  id: string;
  propertyName: string;
  tenantName: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "assigned" | "in-progress" | "completed";
  dateSubmitted: string;
  assignedTo?: string;
  images?: string[];
}

interface Contractor {
  id: string;
  name: string;
  expertise: string[];
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: "immediate" | "within-week" | "delayed";
}

interface MaintenanceRequestManagerProps {
  requests?: MaintenanceRequest[];
}

const MaintenanceRequestManager: React.FC<MaintenanceRequestManagerProps> = ({
  requests = [
    {
      id: "REQ-001",
      propertyName: "Sunset Apartments, Unit 3B",
      tenantName: "John Smith",
      description:
        "Leaking faucet in kitchen sink. Water is pooling under the sink and causing damage to the cabinet.",
      priority: "medium",
      status: "open",
      dateSubmitted: "2023-06-15",
    },
    {
      id: "REQ-002",
      propertyName: "Oakwood Residences, Unit 12A",
      tenantName: "Sarah Johnson",
      description:
        "AC not cooling properly. Temperature remains high despite setting to lowest.",
      priority: "high",
      status: "assigned",
      dateSubmitted: "2023-06-14",
      assignedTo: "Cool Air Services",
    },
    {
      id: "REQ-003",
      propertyName: "Maple Heights, Unit 5C",
      tenantName: "David Wilson",
      description: "Bathroom door handle broken. Cannot close door properly.",
      priority: "low",
      status: "in-progress",
      dateSubmitted: "2023-06-10",
      assignedTo: "Quick Fix Maintenance",
    },
    {
      id: "REQ-004",
      propertyName: "Sunset Apartments, Unit 7D",
      tenantName: "Emily Brown",
      description: "Ceiling light fixture not working in living room.",
      priority: "medium",
      status: "completed",
      dateSubmitted: "2023-06-05",
      assignedTo: "Bright Electric Co.",
    },
  ],
}) => {
  // Sample contractors data
  const contractors: Contractor[] = [
    {
      id: "CON-001",
      name: "Quick Fix Maintenance",
      expertise: ["general", "carpentry", "minor repairs"],
      yearsExperience: 5,
      rating: 4.2,
      reviewCount: 48,
      hourlyRate: 65,
      availability: "immediate",
    },
    {
      id: "CON-002",
      name: "Cool Air Services",
      expertise: ["HVAC", "air conditioning", "ventilation"],
      yearsExperience: 12,
      rating: 4.8,
      reviewCount: 156,
      hourlyRate: 95,
      availability: "within-week",
    },
    {
      id: "CON-003",
      name: "Bright Electric Co.",
      expertise: ["electrical", "lighting", "wiring"],
      yearsExperience: 8,
      rating: 4.5,
      reviewCount: 87,
      hourlyRate: 85,
      availability: "immediate",
    },
    {
      id: "CON-004",
      name: "Plumbing Professionals",
      expertise: ["plumbing", "water systems", "drainage"],
      yearsExperience: 15,
      rating: 4.7,
      reviewCount: 203,
      hourlyRate: 90,
      availability: "within-week",
    },
    {
      id: "CON-005",
      name: "Elite Home Repairs",
      expertise: ["general", "drywall", "painting", "flooring"],
      yearsExperience: 3,
      rating: 3.9,
      reviewCount: 27,
      hourlyRate: 55,
      availability: "immediate",
    },
    {
      id: "CON-006",
      name: "Locksmith Masters",
      expertise: ["locks", "security", "doors"],
      yearsExperience: 10,
      rating: 4.6,
      reviewCount: 112,
      hourlyRate: 75,
      availability: "delayed",
    },
  ];

  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [filteredContractors, setFilteredContractors] =
    useState<Contractor[]>(contractors);
  const [expertiseFilter, setExpertiseFilter] = useState<string>("");
  const [minExperience, setMinExperience] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [minReviews, setMinReviews] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [selectedContractor, setSelectedContractor] =
    useState<Contractor | null>(null);

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleAssignContractor = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsAssignDialogOpen(true);
    // Reset filters when opening dialog
    setFilteredContractors(contractors);
    setExpertiseFilter("");
    setMinExperience(0);
    setMinRating(0);
    setMinReviews(0);
    setAvailabilityFilter("");
    setSortBy("");
    setSelectedContractor(null);
  };

  const applyFilters = () => {
    let filtered = [...contractors];

    // Apply expertise filter
    if (expertiseFilter) {
      filtered = filtered.filter((c) =>
        c.expertise.some((e) =>
          e.toLowerCase().includes(expertiseFilter.toLowerCase()),
        ),
      );
    }

    // Apply years of experience filter
    if (minExperience > 0) {
      filtered = filtered.filter((c) => c.yearsExperience >= minExperience);
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter((c) => c.rating >= minRating);
    }

    // Apply review count filter
    if (minReviews > 0) {
      filtered = filtered.filter((c) => c.reviewCount >= minReviews);
    }

    // Apply availability filter
    if (availabilityFilter) {
      filtered = filtered.filter((c) => c.availability === availabilityFilter);
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case "rating-high":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "rating-low":
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case "experience-high":
          filtered.sort((a, b) => b.yearsExperience - a.yearsExperience);
          break;
        case "experience-low":
          filtered.sort((a, b) => a.yearsExperience - b.yearsExperience);
          break;
        case "reviews-high":
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case "price-low":
          filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
          break;
        case "price-high":
          filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
          break;
        default:
          break;
      }
    }

    setFilteredContractors(filtered);
  };

  const handleSelectContractor = (contractor: Contractor) => {
    setSelectedContractor(contractor);
  };

  const handleAssignAndNotify = () => {
    if (selectedRequest && selectedContractor) {
      // In a real app, this would update the database
      // For now, we'll just close the dialog
      setIsAssignDialogOpen(false);
      // You could show a success message here
      alert(
        `Assigned ${selectedContractor.name} to request ${selectedRequest.id}`,
      );
    } else {
      alert("Please select a contractor before assigning");
    }
  };

  const handleNewRequestSubmit = (data: any) => {
    // In a real app, this would add the request to the database
    console.log("New request submitted:", data);
    setIsNewRequestOpen(false);
    // You could show a success message here
    alert("Maintenance request submitted successfully!");
  };

  const getPriorityBadge = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (
    status: "open" | "assigned" | "in-progress" | "completed",
  ) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Open
          </Badge>
        );
      case "assigned":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Assigned
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (
    status: "open" | "assigned" | "in-progress" | "completed",
  ) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "assigned":
        return <PlusCircle className="h-4 w-4 text-blue-600" />;
      case "in-progress":
        return <Wrench className="h-4 w-4 text-purple-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Maintenance Request Manager</h1>
        <p className="text-gray-500">
          Manage and track maintenance requests from tenants
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full rounded-md border border-gray-300 pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Maintenance Request</DialogTitle>
                <DialogDescription>
                  Fill out the form to submit a new maintenance request
                </DialogDescription>
              </DialogHeader>
              <MaintenanceRequestForm onSubmit={handleNewRequestSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {request.propertyName}
                    </CardTitle>
                    <CardDescription>
                      Request ID: {request.id} • Tenant: {request.tenantName}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(request.priority)}
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{request.description}</p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Submitted on {request.dateSubmitted}</span>
                  {request.assignedTo && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Assigned to: {request.assignedTo}</span>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(request)}
                >
                  View Details
                </Button>
                {request.status === "open" && (
                  <Button
                    size="sm"
                    onClick={() => handleAssignContractor(request)}
                  >
                    Assign Contractor
                  </Button>
                )}
                {(request.status === "assigned" ||
                  request.status === "in-progress") && (
                  <Button size="sm">Update Status</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Other tab contents would filter the requests by status */}
        <TabsContent value="open" className="space-y-4">
          {requests
            .filter((r) => r.status === "open")
            .map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {request.propertyName}
                      </CardTitle>
                      <CardDescription>
                        Request ID: {request.id} • Tenant: {request.tenantName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(request.priority)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{request.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Submitted on {request.dateSubmitted}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAssignContractor(request)}
                  >
                    Assign Contractor
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          {requests
            .filter((r) => r.status === "assigned")
            .map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {request.propertyName}
                      </CardTitle>
                      <CardDescription>
                        Request ID: {request.id} • Tenant: {request.tenantName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(request.priority)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{request.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Submitted on {request.dateSubmitted}</span>
                    {request.assignedTo && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Assigned to: {request.assignedTo}</span>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Details
                  </Button>
                  <Button size="sm">Update Status</Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {requests
            .filter((r) => r.status === "in-progress")
            .map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {request.propertyName}
                      </CardTitle>
                      <CardDescription>
                        Request ID: {request.id} • Tenant: {request.tenantName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(request.priority)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{request.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Submitted on {request.dateSubmitted}</span>
                    {request.assignedTo && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Assigned to: {request.assignedTo}</span>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Details
                  </Button>
                  <Button size="sm">Update Status</Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {requests
            .filter((r) => r.status === "completed")
            .map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {request.propertyName}
                      </CardTitle>
                      <CardDescription>
                        Request ID: {request.id} • Tenant: {request.tenantName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(request.priority)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{request.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Submitted on {request.dateSubmitted}</span>
                    {request.assignedTo && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Assigned to: {request.assignedTo}</span>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Maintenance Request Details</DialogTitle>
            <DialogDescription>
              Request ID: {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Property
                  </h3>
                  <p>{selectedRequest.propertyName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tenant</h3>
                  <p>{selectedRequest.tenantName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date Submitted
                  </h3>
                  <p>{selectedRequest.dateSubmitted}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedRequest.status)}
                    <span>
                      {selectedRequest.status.charAt(0).toUpperCase() +
                        selectedRequest.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Priority
                  </h3>
                  <p>{getPriorityBadge(selectedRequest.priority)}</p>
                </div>
                {selectedRequest.assignedTo && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Assigned To
                    </h3>
                    <p>{selectedRequest.assignedTo}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Description
                </h3>
                <p className="mt-1">{selectedRequest.description}</p>
              </div>

              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Images</h3>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {selectedRequest.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Request ${selectedRequest.id} image ${index + 1}`}
                        className="h-24 w-full rounded-md object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            {selectedRequest?.status === "open" && (
              <Button
                onClick={() => {
                  setIsDetailsOpen(false);
                  handleAssignContractor(selectedRequest);
                }}
              >
                Assign Contractor
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Contractor Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Contractor</DialogTitle>
            <DialogDescription>
              Filter and select a contractor to handle this maintenance request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Request</h3>
              <p className="text-sm">{selectedRequest?.description}</p>
            </div>

            {/* Filtering Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter Contractors
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expertise Filter */}
                <div className="space-y-2">
                  <label
                    htmlFor="expertise"
                    className="text-xs font-medium text-gray-600"
                  >
                    Expertise
                  </label>
                  <Select
                    value={expertiseFilter}
                    onValueChange={setExpertiseFilter}
                  >
                    <SelectTrigger id="expertise">
                      <SelectValue placeholder="Any expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any expertise</SelectItem>
                      <SelectItem value="general">
                        General Maintenance
                      </SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="carpentry">Carpentry</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="flooring">Flooring</SelectItem>
                      <SelectItem value="locks">Locks & Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Years Experience Filter */}
                <div className="space-y-2">
                  <label
                    htmlFor="experience"
                    className="text-xs font-medium text-gray-600"
                  >
                    Minimum Years Experience
                  </label>
                  <Select
                    value={minExperience.toString()}
                    onValueChange={(val) => setMinExperience(Number(val))}
                  >
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Any experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any experience</SelectItem>
                      <SelectItem value="1">At least 1 year</SelectItem>
                      <SelectItem value="3">At least 3 years</SelectItem>
                      <SelectItem value="5">At least 5 years</SelectItem>
                      <SelectItem value="10">At least 10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <label
                    htmlFor="rating"
                    className="text-xs font-medium text-gray-600"
                  >
                    Minimum Rating
                  </label>
                  <Select
                    value={minRating.toString()}
                    onValueChange={(val) => setMinRating(Number(val))}
                  >
                    <SelectTrigger id="rating">
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="3.5">3.5+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Review Count Filter */}
                <div className="space-y-2">
                  <label
                    htmlFor="reviews"
                    className="text-xs font-medium text-gray-600"
                  >
                    Minimum Reviews
                  </label>
                  <Select
                    value={minReviews.toString()}
                    onValueChange={(val) => setMinReviews(Number(val))}
                  >
                    <SelectTrigger id="reviews">
                      <SelectValue placeholder="Any number of reviews" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any number</SelectItem>
                      <SelectItem value="10">10+ reviews</SelectItem>
                      <SelectItem value="50">50+ reviews</SelectItem>
                      <SelectItem value="100">100+ reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Filter */}
                <div className="space-y-2">
                  <label
                    htmlFor="availability"
                    className="text-xs font-medium text-gray-600"
                  >
                    Availability
                  </label>
                  <Select
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                  >
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Any availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any availability</SelectItem>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="within-week">Within a week</SelectItem>
                      <SelectItem value="delayed">
                        Delayed (1+ weeks)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label
                    htmlFor="sortBy"
                    className="text-xs font-medium text-gray-600"
                  >
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sortBy">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Default</SelectItem>
                      <SelectItem value="rating-high">
                        Highest Rating
                      </SelectItem>
                      <SelectItem value="experience-high">
                        Most Experience
                      </SelectItem>
                      <SelectItem value="reviews-high">Most Reviews</SelectItem>
                      <SelectItem value="price-low">Lowest Price</SelectItem>
                      <SelectItem value="price-high">Highest Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="mt-4 w-full"
                variant="outline"
                size="sm"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>

            {/* Contractor Selection */}
            <div>
              <h3 className="text-sm font-medium mb-3">
                Available Contractors ({filteredContractors.length})
              </h3>

              {filteredContractors.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-md">
                  <p className="text-gray-500">
                    No contractors match your filters
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setFilteredContractors(contractors);
                      setExpertiseFilter("");
                      setMinExperience(0);
                      setMinRating(0);
                      setMinReviews(0);
                      setAvailabilityFilter("");
                      setSortBy("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {filteredContractors.map((contractor) => (
                    <div
                      key={contractor.id}
                      className={`border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedContractor?.id === contractor.id ? "bg-blue-50 border-blue-300" : ""}`}
                      onClick={() => handleSelectContractor(contractor)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{contractor.name}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 text-yellow-400 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                              {contractor.rating.toFixed(1)}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{contractor.reviewCount} reviews</span>
                            <span className="mx-2">•</span>
                            <span>{contractor.yearsExperience} years</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {contractor.expertise.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            ${contractor.hourlyRate}/hr
                          </span>
                          <div className="mt-1 text-xs">
                            {contractor.availability === "immediate" && (
                              <span className="text-green-600">
                                Available now
                              </span>
                            )}
                            {contractor.availability === "within-week" && (
                              <span className="text-blue-600">
                                Available this week
                              </span>
                            )}
                            {contractor.availability === "delayed" && (
                              <span className="text-orange-600">
                                Available in 1+ weeks
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Select defaultValue={selectedRequest?.priority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes for Contractor
              </label>
              <textarea
                id="notes"
                className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add any specific instructions or details for the contractor..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignAndNotify}
              disabled={!selectedContractor}
            >
              Assign and Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceRequestManager;
