import React, { useEffect, useState } from "react";
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
import { useStore } from "@/lib/zustand";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { fireDataBase } from "@/lib/firebase";

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
  const { user } = useStore();
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredProperties =
    activeTab === "all"
      ? properties
      : properties.filter((property) => property.type === activeTab);

  const totalProperties = user.properties.length || 0;
  const totalUnits = properties.reduce(
    (sum, property) => sum + property.units,
    0
  );
  const occupancyRate =
    totalUnits > 0
      ? Math.round(
          (properties.reduce(
            (sum, property) => sum + property.occupiedUnits,
            0
          ) /
            totalUnits) *
            100
        )
      : 0;
  const totalRevenue = properties.reduce(
    (sum, property) => sum + property.monthlyRevenue,
    0
  );
  const totalMaintenanceRequests = properties.reduce(
    (sum, property) => sum + property.maintenanceRequests,
    0
  );

  return (
    <div className="bg-white shadow-sm p-6 rounded-lg w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-2xl">Property Overview</h2>
          <p className="text-muted-foreground">
            Manage and monitor your properties
          </p>
        </div>
        <Button onClick={() => setIsAddPropertyDialogOpen(true)}>
          <Plus className="mr-2 w-4 h-4" /> Add Property
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm">
                  Total Properties
                </p>
                <p className="font-bold text-2xl">{totalProperties}</p>
              </div>
              <Building className="opacity-80 w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm">Total Units</p>
                <p className="font-bold text-2xl">{totalUnits}</p>
              </div>
              <Home className="opacity-80 w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm">Occupancy Rate</p>
                <p className="font-bold text-2xl">{occupancyRate}%</p>
              </div>
              <Users className="opacity-80 w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm">Monthly Revenue</p>
                <p className="font-bold text-2xl">
                  ZMW {totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="opacity-80 w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm">
                  Maintenance Requests
                </p>
                <p className="font-bold text-2xl">{totalMaintenanceRequests}</p>
              </div>
              <Calendar className="opacity-80 w-8 h-8 text-primary" />
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
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Property Dialog */}
      <PropertyDialog
        setIsAddPropertyDialogOpen={setIsAddPropertyDialogOpen}
        isAddPropertyDialogOpen={isAddPropertyDialogOpen}
      />
    </div>
  );
};

interface PropertyCardProps {
  property: Property;
}

const PropertyDialog = ({
  setIsAddPropertyDialogOpen,
  isAddPropertyDialogOpen,
}) => {
  const { user, setUser } = useStore();
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "apartment",
    address: "",
    units: 1,
    image: "",
  });
  const [fetchedProperties, setFetchedProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "units" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!formData.name || !formData.address) {
        setError("Name and address are required");
        setLoading(false);
        return;
      }

      if (!user.uid) {
        setError("You must be logged in to add properties");
        setLoading(false);
        return;
      }

      // Create a new property object
      const newProperty = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        address: formData.address,
        units: formData.units,
        occupiedUnits: 0,
        monthlyRevenue: 0,
        maintenanceRequests: 0,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
        postedByDetails: {
          uid: user.uid,
          userName: user.userName,
        },
        createdAt: new Date().toISOString(),
      };

      // First, check if the user document exists in Firestore
      const userDocRef = doc(fireDataBase, user.role, user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Add the property to the user's properties array
        await updateDoc(userDocRef, {
          properties: arrayUnion(newProperty),
        });
        // Update local state
        setUser({
          properties: [...(user.properties || []), newProperty],
        });

        setIsAddPropertyDialogOpen(false);
        setFormData({
          name: "",
          type: "apartment",
          address: "",
          units: 1,
          image: "",
        });
      } else {
        setError(
          "User profile not found. Please complete your profile setup first."
        );
      }
    } catch (err) {
      console.error("Error adding property:", err);
      setError("Failed to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user's properties
  const fetchUserProperties = async () => {
    console.log(user);
    try {
      if (!user.uid) return;

      // Query properties where postedByDetails.uid matches current user's uid
      const propertiesQuery = query(
        collection(fireDataBase, "listings"),
        where("postedByDetails.uid", "==", user.uid)
      );

      const querySnapshot = await getDocs(propertiesQuery);
      const userProperties = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      // Update user state with fetched properties
      setFetchedProperties(userProperties);
      console.log("Fetched user properties:", userProperties);

      return userProperties;
    } catch (error) {
      console.error("Error fetching user properties:", error);
      return [];
    }
  };
  useEffect(() => {
    fetchUserProperties();
  }, [user.uid]);

  const handlePropertyClick = async (property) => {
    const userRef = doc(fireDataBase, `${user.role}s`, user.uid);
    await updateDoc(userRef, {
      properties: arrayUnion({
        title: property.title,
        propertyType: property.propertyType,
        image: property.images[property.coverPhotoIndex],
      }),
    });
    setFormData({
      title: "",
      propertyType: "apartment",
      address: "",
      units: 1,
      image: "",
    });

    setIsAddPropertyDialogOpen(false);
  };
  return (
    <Dialog
      open={isAddPropertyDialogOpen}
      onOpenChange={setIsAddPropertyDialogOpen}
    >
      <DialogContent className="max-w-[95vw] sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Enter the details of your new property. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">
            {error}
          </div>
        )}

        {fetchedProperties && fetchedProperties.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 font-medium text-sm">Your posted properties</h3>
            <div className="p-2 border border-input rounded-md max-h-[200px] overflow-y-auto">
              {fetchedProperties.map((property) => (
                <div key={property.uid} className="mb-2 last:mb-0">
                  <SimplePropertyCard
                    property={property}
                    onClick={() => handlePropertyClick(property)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="gap-4 grid py-4">
          <div className="items-center gap-2 grid grid-cols-1 sm:grid-cols-4">
            <Label htmlFor="name" className="sm:text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Property name"
              className="col-span-1 sm:col-span-3"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="items-center gap-2 grid grid-cols-1 sm:grid-cols-4">
            <Label htmlFor="type" className="sm:text-right">
              Type
            </Label>
            <select
              id="type"
              className="flex col-span-1 sm:col-span-3 bg-background file:bg-transparent disabled:opacity-50 px-3 py-2 border border-input file:border-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full h-10 file:font-medium placeholder:text-muted-foreground text-sm file:text-sm disabled:cursor-not-allowed"
              value={formData.propertyType}
              onChange={handleChange}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="items-center gap-2 grid grid-cols-1 sm:grid-cols-4">
            <Label htmlFor="address" className="sm:text-right">
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="Full address"
              className="col-span-1 sm:col-span-3"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="items-center gap-2 grid grid-cols-1 sm:grid-cols-4">
            <Label htmlFor="units" className="sm:text-right">
              Units
            </Label>
            <Input
              id="units"
              type="number"
              min="1"
              value={formData.units}
              onChange={handleChange}
              className="col-span-1 sm:col-span-3"
            />
          </div>
          <div className="items-center gap-2 grid grid-cols-1 sm:grid-cols-4">
            <Label htmlFor="image" className="sm:text-right">
              Image URL
            </Label>
            <Input
              id="image"
              placeholder="Property image URL"
              className="col-span-1 sm:col-span-3"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter className="sm:flex-row flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddPropertyDialogOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Saving..." : "Save Property"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const SimplePropertyCard = ({ property, onClick }) => {
  return (
    <div className="flex items-center gap-3 hover:bg-accent/10 p-2 border border-border rounded-md transition-colors">
      {/* Cover Image - Square thumbnail */}
      <div className="flex-shrink-0 rounded-md w-16 h-16 overflow-hidden">
        <img
          src={
            property.image ||
            property.images?.[property.coverPhotoIndex] ||
            "https://via.placeholder.com/150"
          }
          alt={property.name || property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/150?text=No+Image";
          }}
        />
      </div>

      {/* Property Name */}
      <div className="flex-grow overflow-hidden">
        <h4 className="font-medium text-sm truncate">
          {property.name || property.title}
        </h4>
        <p className="text-muted-foreground text-xs truncate">
          {property.type || property.propertyType}
        </p>
      </div>
      <button onClick={onClick}>Add this </button>
    </div>
  );
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={property.image || property.images[property.coverPhotoIndex]}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{property.title}</CardTitle>
          <Badge variant={getBadgeVariant(property.propertyType)}>
            {property.propertyType}
          </Badge>
        </div>
        <CardDescription className="flex items-center">
          <MapPin className="mr-1 w-4 h-4" /> {property.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="gap-2 grid grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Units</p>
            <p className="font-medium">
              {property.occupiedUnits || 0}/{property.units || 1}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Occupancy</p>
            <p className="font-medium">
              {property.units > 0
                ? Math.round(
                    (property.occupiedUnits || 0 / property.units || 1) * 100
                  )
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly Revenue</p>
            <p className="font-medium">ZMW {property.monthlyRevenue || 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Maintenance</p>
            <p className="font-medium">
              {property.maintenanceRequests || 0} requests
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Edit className="mr-1 w-4 h-4" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-destructive/10 text-destructive"
        >
          <Trash2 className="mr-1 w-4 h-4" /> Delete
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
