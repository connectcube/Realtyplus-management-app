import React, { useState } from "react";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatingStars from "@/components/rating/RatingStars";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  unit: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  status: "active" | "inactive" | "pending";
}

interface TenantManagementProps {
  tenants?: Tenant[];
}

const defaultTenants: Tenant[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    property: "Sunset Apartments",
    unit: "101",
    leaseStart: "2023-01-01",
    leaseEnd: "2024-01-01",
    rentAmount: 1200,
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    property: "Sunset Apartments",
    unit: "202",
    leaseStart: "2023-03-15",
    leaseEnd: "2024-03-15",
    rentAmount: 1350,
    status: "active",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "(555) 456-7890",
    property: "Lakeside Condos",
    unit: "3B",
    leaseStart: "2023-05-01",
    leaseEnd: "2024-05-01",
    rentAmount: 1500,
    status: "pending",
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    phone: "(555) 234-5678",
    property: "Parkview Heights",
    unit: "15D",
    leaseStart: "2022-11-01",
    leaseEnd: "2023-11-01",
    rentAmount: 1650,
    status: "inactive",
  },
];

const TenantManagement = ({
  tenants = defaultTenants,
}: TenantManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [isEditTenantOpen, setIsEditTenantOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [tenantsList, setTenantsList] = useState<Tenant[]>(tenants);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    unit: "",
    leaseStart: "",
    leaseEnd: "",
    rentAmount: 0,
  });

  const filteredTenants = tenantsList.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && tenant.status === activeTab;
  });

  const handleViewTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      property: tenant.property,
      unit: tenant.unit,
      leaseStart: tenant.leaseStart,
      leaseEnd: tenant.leaseEnd,
      rentAmount: tenant.rentAmount,
    });
    setIsEditTenantOpen(true);
  };

  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [tenantToRate, setTenantToRate] = useState<Tenant | null>(null);
  const [tenantRating, setTenantRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  const handleDeleteTenant = (id: string) => {
    if (confirm("Are you sure you want to delete this tenant?")) {
      const tenant = tenantsList.find((t) => t.id === id);
      if (tenant) {
        setTenantToRate(tenant);
        setShowRatingDialog(true);
      } else {
        setTenantsList(tenantsList.filter((tenant) => tenant.id !== id));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "rentAmount" ? Number(value) : value,
    });
  };

  const handleSaveTenant = () => {
    // For new tenant
    if (!selectedTenant) {
      const newTenant: Tenant = {
        id: `${tenantsList.length + 1}`,
        ...formData,
        status: "pending",
      };
      setTenantsList([...tenantsList, newTenant]);
      setIsAddTenantOpen(false);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        property: "",
        unit: "",
        leaseStart: "",
        leaseEnd: "",
        rentAmount: 0,
      });
      alert(
        "New tenant added successfully! An invitation email has been sent to the tenant to complete registration.",
      );
      console.log("New tenant added:", newTenant);
    } else {
      // For editing existing tenant
      const updatedTenants = tenantsList.map((tenant) =>
        tenant.id === selectedTenant.id ? { ...tenant, ...formData } : tenant,
      );
      setTenantsList(updatedTenants);
      setIsEditTenantOpen(false);
      setSelectedTenant(null);
      alert("Tenant updated successfully!");
    }
  };

  const handleAddNewTenant = () => {
    setSelectedTenant(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      property: "",
      unit: "",
      leaseStart: "",
      leaseEnd: "",
      rentAmount: 0,
    });
    setIsAddTenantOpen(true);
  };

  return (
    <div className="w-full h-full bg-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Tenant Management</h1>
        <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 w-full sm:w-auto"
              onClick={handleAddNewTenant}
            >
              <UserPlus size={16} />
              Add New Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
              <DialogDescription>
                Fill in the tenant details below to add a new tenant to your
                property.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="property" className="text-sm font-medium">
                    Property
                  </label>
                  <Input
                    id="property"
                    placeholder="Sunset Apartments"
                    value={formData.property}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="unit" className="text-sm font-medium">
                    Unit
                  </label>
                  <Input
                    id="unit"
                    placeholder="101"
                    value={formData.unit}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="rentAmount" className="text-sm font-medium">
                    Monthly Rent
                  </label>
                  <Input
                    id="rentAmount"
                    type="number"
                    placeholder="1200"
                    value={formData.rentAmount || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="leaseStart" className="text-sm font-medium">
                    Lease Start Date
                  </label>
                  <Input
                    id="leaseStart"
                    type="date"
                    value={formData.leaseStart}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="leaseEnd" className="text-sm font-medium">
                    Lease End Date
                  </label>
                  <Input
                    id="leaseEnd"
                    type="date"
                    value={formData.leaseEnd}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddTenantOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveTenant}>Save Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs
          defaultValue="all"
          className="w-full sm:w-auto"
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:flex-row gap-1 sm:gap-0">
            <TabsTrigger value="all">All Tenants</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{tenant.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditTenant(tenant)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteTenant(tenant.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {tenant.property} - Unit {tenant.unit}
              </CardDescription>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tenant.status === "active"
                      ? "bg-green-100 text-green-800"
                      : tenant.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {tenant.status.charAt(0).toUpperCase() +
                    tenant.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{tenant.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    Lease: {new Date(tenant.leaseStart).toLocaleDateString()} -{" "}
                    {new Date(tenant.leaseEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm font-medium">
                  ZMW {tenant.rentAmount.toLocaleString()}/month
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewTenant(tenant)}
                >
                  View Details
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No tenants found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "Try adding a new tenant or changing your filters"}
          </p>
        </div>
      )}

      {/* View Tenant Details Dialog */}
      {selectedTenant && (
        <Dialog
          open={!!selectedTenant && !isEditTenantOpen}
          onOpenChange={(open) => {
            if (!open) setSelectedTenant(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tenant Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p>{selectedTenant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{selectedTenant.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{selectedTenant.phone}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Lease Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Property</p>
                    <p>
                      {selectedTenant.property} - Unit {selectedTenant.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lease Period</p>
                    <p>
                      {new Date(selectedTenant.leaseStart).toLocaleDateString()}{" "}
                      - {new Date(selectedTenant.leaseEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Monthly Rent</p>
                    <p>ZMW {selectedTenant.rentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedTenant.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedTenant.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedTenant.status.charAt(0).toUpperCase() +
                        selectedTenant.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setSelectedTenant(null)}>
                Close
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedTenant(selectedTenant);
                  handleEditTenant(selectedTenant);
                }}
              >
                <Edit size={16} />
                Edit Tenant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Tenant Dialog */}
      <Dialog open={isEditTenantOpen} onOpenChange={setIsEditTenantOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update the tenant details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="property" className="text-sm font-medium">
                  Property
                </label>
                <Input
                  id="property"
                  value={formData.property}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="rentAmount" className="text-sm font-medium">
                  Monthly Rent
                </label>
                <Input
                  id="rentAmount"
                  type="number"
                  value={formData.rentAmount || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="leaseStart" className="text-sm font-medium">
                  Lease Start Date
                </label>
                <Input
                  id="leaseStart"
                  type="date"
                  value={formData.leaseStart}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="leaseEnd" className="text-sm font-medium">
                  Lease End Date
                </label>
                <Input
                  id="leaseEnd"
                  type="date"
                  value={formData.leaseEnd}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditTenantOpen(false);
                setSelectedTenant(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTenant}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tenant Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Tenant</DialogTitle>
            <DialogDescription>
              Please rate your experience with this tenant before removing them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tenant: {tenantToRate?.name}</Label>
              <p className="text-sm text-gray-500">
                {tenantToRate?.property} - Unit {tenantToRate?.unit}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <RatingStars
                rating={tenantRating}
                onRatingChange={setTenantRating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this tenant..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRatingDialog(false);
                setTenantsList(
                  tenantsList.filter(
                    (tenant) => tenant.id !== tenantToRate?.id,
                  ),
                );
              }}
            >
              Skip
            </Button>
            <Button
              onClick={() => {
                console.log(
                  `Rated tenant ${tenantRating} stars with comment: ${ratingComment}`,
                );
                setShowRatingDialog(false);
                setTenantRating(0);
                setRatingComment("");
                setTenantsList(
                  tenantsList.filter(
                    (tenant) => tenant.id !== tenantToRate?.id,
                  ),
                );
                alert("Thank you for your feedback! Tenant has been removed.");
              }}
            >
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantManagement;
