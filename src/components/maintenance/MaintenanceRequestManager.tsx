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
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleAssignContractor = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsAssignDialogOpen(true);
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
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Request
          </Button>
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
                {/* Same card content as above */}
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          {requests
            .filter((r) => r.status === "assigned")
            .map((request) => (
              <Card key={request.id} className="overflow-hidden">
                {/* Same card content as above */}
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {requests
            .filter((r) => r.status === "in-progress")
            .map((request) => (
              <Card key={request.id} className="overflow-hidden">
                {/* Same card content as above */}
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {requests
            .filter((r) => r.status === "completed")
            .map((request) => (
              <Card key={request.id} className="overflow-hidden">
                {/* Same card content as above */}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Contractor</DialogTitle>
            <DialogDescription>
              Select a contractor to handle this maintenance request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Request</h3>
              <p className="text-sm">{selectedRequest?.description}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="contractor" className="text-sm font-medium">
                Contractor
              </label>
              <Select>
                <SelectTrigger id="contractor">
                  <SelectValue placeholder="Select a contractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick-fix">
                    Quick Fix Maintenance
                  </SelectItem>
                  <SelectItem value="cool-air">Cool Air Services</SelectItem>
                  <SelectItem value="bright-electric">
                    Bright Electric Co.
                  </SelectItem>
                  <SelectItem value="plumbing-pros">
                    Plumbing Professionals
                  </SelectItem>
                </SelectContent>
              </Select>
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
            <Button onClick={() => setIsAssignDialogOpen(false)}>
              Assign and Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceRequestManager;
