import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Home,
  Plus,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  type: "apartment" | "house" | "condo" | "commercial";
  units: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  maintenanceRequests: number;
  image: string;
}

interface PropertyOverviewProps {
  properties?: Property[];
}

const PropertyOverview = ({
  properties = defaultProperties,
}: PropertyOverviewProps) => {
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const filteredProperties =
    activeTab === "all"
      ? properties
      : properties.filter((property) => property.type === activeTab);

  const totalProperties = properties.length;
  const totalUnits = properties.reduce(
    (sum, property) => sum + property.units,
    0,
  );
  const occupancyRate =
    totalUnits > 0
      ? Math.round(
          (properties.reduce(
            (sum, property) => sum + property.occupiedUnits,
            0,
          ) /
            totalUnits) *
            100,
        )
      : 0;
  const totalRevenue = properties.reduce(
    (sum, property) => sum + property.monthlyRevenue,
    0,
  );
  const totalMaintenanceRequests = properties.reduce(
    (sum, property) => sum + property.maintenanceRequests,
    0,
  );

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Property Overview</h2>
          <p className="text-muted-foreground">
            Manage and monitor your properties
          </p>
        </div>
        <Button onClick={() => setIsAddPropertyDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Properties
                </p>
                <p className="text-2xl font-bold">{totalProperties}</p>
              </div>
              <Building className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-2xl font-bold">{totalUnits}</p>
              </div>
              <Home className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold">{occupancyRate}%</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  ZMW {totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Maintenance Requests
                </p>
                <p className="text-2xl font-bold">{totalMaintenanceRequests}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Listing */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="apartment">Apartments</TabsTrigger>
          <TabsTrigger value="house">Houses</TabsTrigger>
          <TabsTrigger value="condo">Condos</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Property Dialog */}
      <Dialog
        open={isAddPropertyDialogOpen}
        onOpenChange={setIsAddPropertyDialogOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>
              Enter the details of your new property. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Property name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <select
                id="type"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Textarea
                id="address"
                placeholder="Full address"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="units" className="text-right">
                Units
              </Label>
              <Input
                id="units"
                type="number"
                min="1"
                defaultValue="1"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                placeholder="Property image URL"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddPropertyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAddPropertyDialogOpen(false)}>
              Save Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{property.name}</CardTitle>
          <Badge variant={getBadgeVariant(property.type)}>
            {property.type}
          </Badge>
        </div>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" /> {property.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Units</p>
            <p className="font-medium">
              {property.occupiedUnits}/{property.units}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Occupancy</p>
            <p className="font-medium">
              {property.units > 0
                ? Math.round((property.occupiedUnits / property.units) * 100)
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly Revenue</p>
            <p className="font-medium">
              ZMW {property.monthlyRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Maintenance</p>
            <p className="font-medium">
              {property.maintenanceRequests} requests
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

const getBadgeVariant = (type: Property["type"]) => {
  switch (type) {
    case "apartment":
      return "default";
    case "house":
      return "secondary";
    case "condo":
      return "outline";
    case "commercial":
      return "destructive";
    default:
      return "default";
  }
};

const defaultProperties: Property[] = [
  {
    id: "1",
    name: "Sunset Apartments",
    address: "123 Main St, Anytown, CA 90210",
    type: "apartment",
    units: 24,
    occupiedUnits: 22,
    monthlyRevenue: 28500,
    maintenanceRequests: 3,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: "2",
    name: "Lakeside Condos",
    address: "456 Lake Ave, Waterfront, FL 33101",
    type: "condo",
    units: 12,
    occupiedUnits: 10,
    monthlyRevenue: 18000,
    maintenanceRequests: 1,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
  {
    id: "3",
    name: "Downtown Office Building",
    address: "789 Business Blvd, Metro City, NY 10001",
    type: "commercial",
    units: 8,
    occupiedUnits: 6,
    monthlyRevenue: 42000,
    maintenanceRequests: 2,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    id: "4",
    name: "Greenview Homes",
    address: "321 Park Lane, Greenville, TX 75401",
    type: "house",
    units: 5,
    occupiedUnits: 5,
    monthlyRevenue: 12500,
    maintenanceRequests: 0,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  },
  {
    id: "5",
    name: "Riverfront Apartments",
    address: "555 River Rd, Riverside, OR 97201",
    type: "apartment",
    units: 18,
    occupiedUnits: 15,
    monthlyRevenue: 22500,
    maintenanceRequests: 4,
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
  },
  {
    id: "6",
    name: "Mountain View Cabins",
    address: "888 Mountain Pass, Highland, CO 80461",
    type: "house",
    units: 8,
    occupiedUnits: 6,
    monthlyRevenue: 16000,
    maintenanceRequests: 2,
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
  },
];

export default PropertyOverview;
