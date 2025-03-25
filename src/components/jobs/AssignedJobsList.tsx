import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Camera,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  MoreHorizontal,
  Wrench,
  X,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  address: string;
  status: "pending" | "in_progress" | "completed" | "declined";
  date: string;
  priority: "low" | "medium" | "high";
  images?: string[];
}

interface AssignedJobsListProps {
  jobs?: Job[];
}

const AssignedJobsList = ({ jobs = defaultJobs }: AssignedJobsListProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobStatus, setJobStatus] = useState<Record<string, string>>({});

  const handleStatusChange = (jobId: string, newStatus: string) => {
    setJobStatus((prev) => ({
      ...prev,
      [jobId]: newStatus,
    }));

    // Log the status change (in a real app, this would update the database)
    console.log(`Job ${jobId} status changed to ${newStatus}`);

    // Notify the user
    if (newStatus === "completed") {
      alert("Job marked as complete. The landlord has been notified.");
    } else if (newStatus === "in_progress") {
      alert("Job accepted. The landlord and tenant have been notified.");
    } else if (newStatus === "declined") {
      alert("Job declined. The landlord has been notified.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "declined":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Declined
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            Low
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-700"
          >
            Medium
          </Badge>
        );
      case "high":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            High
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Assigned Jobs</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort
          </Button>
        </div>
      </div>

      <Dialog>
        {jobs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No jobs assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <div className="flex gap-1">
                      {getPriorityBadge(job.priority)}
                      {getStatusBadge(jobStatus[job.id] || job.status)}
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" /> {job.date}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" /> {job.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <div className="flex gap-2">
                    {(jobStatus[job.id] || job.status) === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() =>
                            handleStatusChange(job.id, "in_progress")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(job.id, "declined")}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {(jobStatus[job.id] || job.status) === "in_progress" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleStatusChange(job.id, "completed")}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {selectedJob && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
              <div className="flex gap-2 mt-2">
                {getPriorityBadge(selectedJob.priority)}
                {getStatusBadge(
                  jobStatus[selectedJob.id] || selectedJob.status,
                )}
              </div>
              <DialogDescription className="flex items-center gap-1 mt-1">
                <Clock className="h-4 w-4" /> {selectedJob.date}
              </DialogDescription>
              <DialogDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {selectedJob.address}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Description
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.images && selectedJob.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Camera className="h-4 w-4" /> Images
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedJob.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Job image ${index + 1}`}
                        className="rounded-md object-cover h-24 w-full"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                  <Wrench className="h-4 w-4" /> Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(jobStatus[selectedJob.id] || selectedJob.status) ===
                    "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() =>
                          handleStatusChange(selectedJob.id, "in_progress")
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Accept Job
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() =>
                          handleStatusChange(selectedJob.id, "declined")
                        }
                      >
                        <X className="h-4 w-4 mr-1" /> Decline Job
                      </Button>
                    </>
                  )}
                  {(jobStatus[selectedJob.id] || selectedJob.status) ===
                    "in_progress" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Camera className="h-4 w-4 mr-1" /> Upload Photos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() =>
                          handleStatusChange(selectedJob.id, "completed")
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Mark as
                        Complete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm">
                Contact Landlord
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

// Default mock data
const defaultJobs: Job[] = [
  {
    id: "1",
    title: "Fix Leaking Bathroom Sink",
    description:
      "The bathroom sink in unit 3B has been leaking for the past week. Water is pooling under the cabinet and causing damage to the wood. Needs immediate attention.",
    address: "123 Main St, Apt 3B, Cityville",
    status: "pending",
    date: "2023-06-15",
    priority: "high",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
      "https://images.unsplash.com/photo-1552242718-c5360894aecd?w=400&q=80",
    ],
  },
  {
    id: "2",
    title: "Replace Kitchen Faucet",
    description:
      "The kitchen faucet needs to be replaced. Current one is old and constantly dripping even when turned off completely.",
    address: "456 Oak Ave, Unit 12, Townsville",
    status: "in_progress",
    date: "2023-06-18",
    priority: "medium",
  },
  {
    id: "3",
    title: "HVAC Maintenance",
    description:
      "Regular scheduled maintenance for the HVAC system. Check filters, clean ducts, and ensure proper functioning before summer.",
    address: "789 Pine Rd, Building C, Villagetown",
    status: "pending",
    date: "2023-06-20",
    priority: "low",
  },
  {
    id: "4",
    title: "Repair Broken Window",
    description:
      "Window in the living room has a crack and needs to be replaced. Current damage poses security risk.",
    address: "101 Elm St, Suite 5, Hamletville",
    status: "pending",
    date: "2023-06-16",
    priority: "high",
    images: [
      "https://images.unsplash.com/photo-1610398752800-146f269dfcc8?w=400&q=80",
    ],
  },
  {
    id: "5",
    title: "Paint Bedroom Walls",
    description:
      "Repaint the master bedroom walls. Current paint is peeling and needs fresh coat. Tenant has selected light blue color.",
    address: "202 Maple Dr, Apt 7D, Boroughtown",
    status: "completed",
    date: "2023-06-10",
    priority: "medium",
  },
];

export default AssignedJobsList;
