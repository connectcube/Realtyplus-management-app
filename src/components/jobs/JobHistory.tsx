import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  Star,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  ThumbsUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

interface JobHistoryProps {
  completedJobs?: CompletedJob[];
}

interface CompletedJob {
  id: string;
  title: string;
  description: string;
  property: string;
  address: string;
  completedDate: string;
  duration: string;
  payment: number;
  rating: number;
  feedback?: string;
  client: {
    name: string;
    avatar?: string;
  };
  images?: string[];
}

const JobHistory = ({
  completedJobs = defaultCompletedJobs,
}: JobHistoryProps) => {
  return (
    <div className="w-full h-full bg-white p-4 sm:p-6 rounded-lg">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Job History</h2>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="rated">Highly Rated</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {completedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {completedJobs
            .sort(
              (a, b) =>
                new Date(b.completedDate).getTime() -
                new Date(a.completedDate).getTime(),
            )
            .slice(0, 3)
            .map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </TabsContent>

        <TabsContent value="rated" className="space-y-4">
          {completedJobs
            .filter((job) => job.rating >= 4)
            .map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const JobCard = ({ job }: { job: CompletedJob }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-base sm:text-lg">{job.title}</CardTitle>
            <CardDescription className="flex items-center mt-1 text-xs sm:text-sm">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500" />
              {job.property} - {job.address}
            </CardDescription>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
            <Badge variant="outline" className="mb-0 sm:mb-2">
              Completed
            </Badge>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${i < job.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          {job.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{job.completedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{job.duration}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">ZMW {job.payment.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{job.rating}/5 Rating</span>
          </div>
        </div>

        {job.feedback && (
          <div className="mb-4">
            <Separator className="my-2" />
            <div className="flex items-start mt-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={job.client.avatar} alt={job.client.name} />
                <AvatarFallback>{job.client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{job.client.name}</p>
                <p className="text-sm text-gray-600 italic">"{job.feedback}"</p>
              </div>
            </div>
          </div>
        )}

        {job.images && job.images.length > 0 && (
          <div>
            <Separator className="my-2" />
            <p className="text-xs sm:text-sm font-medium mb-2">Work Photos</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {job.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Work photo ${index + 1}`}
                  className="h-16 sm:h-20 w-full object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const defaultCompletedJobs: CompletedJob[] = [
  {
    id: "1",
    title: "Bathroom Plumbing Repair",
    description:
      "Fixed leaking sink and replaced faulty shower head in master bathroom.",
    property: "Oakwood Apartments",
    address: "123 Main St, Apt 4B",
    completedDate: "2023-05-15",
    duration: "2 hours",
    payment: 150.0,
    rating: 5,
    feedback:
      "Excellent work! Fixed everything quickly and left the area spotless.",
    client: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&q=80",
      "https://images.unsplash.com/photo-1631735237308-a35e3a3dbc36?w=500&q=80",
    ],
  },
  {
    id: "2",
    title: "HVAC Maintenance",
    description:
      "Seasonal maintenance on central air conditioning system. Replaced filters and cleaned ducts.",
    property: "Sunset Villas",
    address: "789 Park Ave, Unit 12",
    completedDate: "2023-04-22",
    duration: "3 hours",
    payment: 225.0,
    rating: 4,
    feedback: "Good service, system is working much better now.",
    client: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
  },
  {
    id: "3",
    title: "Kitchen Sink Replacement",
    description:
      "Removed old damaged sink and installed new stainless steel sink with garbage disposal.",
    property: "Riverfront Condos",
    address: "456 Water St, #303",
    completedDate: "2023-03-10",
    duration: "4 hours",
    payment: 350.0,
    rating: 5,
    feedback: "Fantastic job! The new sink looks great and works perfectly.",
    client: {
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    images: [
      "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=500&q=80",
      "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=500&q=80",
    ],
  },
  {
    id: "4",
    title: "Electrical Panel Upgrade",
    description:
      "Upgraded electrical panel from 100A to 200A service to accommodate modern appliances.",
    property: "Highland Homes",
    address: "222 Hill Rd",
    completedDate: "2023-02-18",
    duration: "6 hours",
    payment: 850.0,
    rating: 5,
    client: {
      name: "Robert Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
  },
  {
    id: "5",
    title: "Window Replacement",
    description:
      "Replaced 3 broken windows in living room with energy-efficient double-pane windows.",
    property: "Meadow Gardens",
    address: "567 Flower St, Apt 7C",
    completedDate: "2023-01-25",
    duration: "5 hours",
    payment: 675.0,
    rating: 3,
    feedback:
      "Windows look good but there was some delay in getting the job done.",
    client: {
      name: "Jennifer Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
    },
  },
];

export default JobHistory;
