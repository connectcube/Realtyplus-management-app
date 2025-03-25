import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  CalendarIcon,
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { format } from "date-fns";

interface RequestComment {
  id: string;
  author: string;
  authorType: "tenant" | "landlord" | "contractor";
  content: string;
  timestamp: Date;
  avatarUrl?: string;
}

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "emergency";
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  comments: RequestComment[];
  images?: string[];
}

interface RequestHistoryListProps {
  requests?: MaintenanceRequest[];
}

const RequestHistoryList = ({
  requests = defaultRequests,
}: RequestHistoryListProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [newComment, setNewComment] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);

  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((request) => request.status === activeTab);

  const handleAddComment = () => {
    if (!selectedRequest || !newComment.trim()) return;

    // In a real app, this would send the comment to an API
    console.log("Adding comment to request:", selectedRequest?.id, newComment);

    // Add the comment to the UI (in a real app this would come from the backend)
    const updatedRequests = requests.map((req) => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          comments: [
            ...req.comments,
            {
              id: `comment-${Date.now()}`,
              author: "You",
              authorType: "tenant",
              content: newComment,
              timestamp: new Date(),
              avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
            },
          ],
        };
      }
      return req;
    });

    // Update the UI
    setNewComment("");
    alert(
      "Comment added successfully! The landlord and contractor will be notified.",
    );
  };

  const getStatusColor = (status: MaintenanceRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: MaintenanceRequest["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: MaintenanceRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-1">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Maintenance Request History</h2>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          {format(request.createdAt, "MMM d, yyyy")}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.charAt(0).toUpperCase() +
                            request.priority.slice(1)}{" "}
                          Priority
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-700">{request.description}</p>

                    {request.images && request.images.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                        {request.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Request image ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}

                    {request.comments.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {request.comments.length} Comment
                            {request.comments.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <ScrollArea className="h-[100px] rounded-md border p-2">
                          <div className="space-y-3">
                            {request.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.avatarUrl} />
                                  <AvatarFallback>
                                    {comment.author.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                      {comment.author}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {format(
                                        comment.timestamp,
                                        "MMM d, h:mm a",
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={
                          selectedRequest?.id === request.id ? newComment : ""
                        }
                        onChange={(e) => {
                          setSelectedRequest(request);
                          setNewComment(e.target.value);
                        }}
                        className="resize-none"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={
                            !newComment.trim() ||
                            selectedRequest?.id !== request.id
                          }
                        >
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No maintenance requests found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Default mock data
const defaultRequests: MaintenanceRequest[] = [
  {
    id: "1",
    title: "Leaking Kitchen Faucet",
    description:
      "The kitchen faucet has been leaking for the past two days. Water is pooling under the sink.",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-16"),
    assignedTo: "John Plumber",
    comments: [
      {
        id: "c1",
        author: "Jane Landlord",
        authorType: "landlord",
        content:
          "I've assigned a plumber to look at this issue. They should contact you soon.",
        timestamp: new Date("2023-06-15T14:30:00"),
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      },
      {
        id: "c2",
        author: "John Plumber",
        authorType: "contractor",
        content:
          "I'll be there tomorrow between 1-3pm. Please ensure someone is home to let me in.",
        timestamp: new Date("2023-06-16T09:15:00"),
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&q=80",
      "https://images.unsplash.com/photo-1603380680632-fac32cb5e126?w=300&q=80",
    ],
  },
  {
    id: "2",
    title: "Broken Air Conditioning",
    description:
      "The AC unit in the living room is not cooling properly. It makes a loud noise when turned on.",
    status: "pending",
    priority: "high",
    createdAt: new Date("2023-06-18"),
    updatedAt: new Date("2023-06-18"),
    comments: [
      {
        id: "c3",
        author: "You",
        authorType: "tenant",
        content:
          "The temperature in the apartment is reaching 85°F. Please address this as soon as possible.",
        timestamp: new Date("2023-06-18T16:45:00"),
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1581275233124-e1e5b9df5f9d?w=300&q=80",
    ],
  },
  {
    id: "3",
    title: "Bathroom Tile Repair",
    description:
      "Several tiles in the shower are loose and one has fallen off completely.",
    status: "completed",
    priority: "low",
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-25"),
    assignedTo: "Mike's Tile Service",
    comments: [
      {
        id: "c4",
        author: "Jane Landlord",
        authorType: "landlord",
        content:
          "I've scheduled Mike's Tile Service to come fix this next week.",
        timestamp: new Date("2023-05-21T10:30:00"),
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      },
      {
        id: "c5",
        author: "Mike",
        authorType: "contractor",
        content:
          "Repair completed. I've replaced the loose tiles and regrouted the affected area.",
        timestamp: new Date("2023-05-25T15:20:00"),
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      },
      {
        id: "c6",
        author: "You",
        authorType: "tenant",
        content: "Thank you! The repair looks great.",
        timestamp: new Date("2023-05-25T18:05:00"),
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80",
    ],
  },
];

export default RequestHistoryList;
