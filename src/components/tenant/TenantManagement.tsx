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
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredTenants = tenants.filter((tenant) => {
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

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenant Management</h1>
        <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
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
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input id="phone" placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="property" className="text-sm font-medium">
                    Property
                  </label>
                  <Input id="property" placeholder="Sunset Apartments" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="unit" className="text-sm font-medium">
                    Unit
                  </label>
                  <Input id="unit" placeholder="101" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="rentAmount" className="text-sm font-medium">
                    Monthly Rent
                  </label>
                  <Input id="rentAmount" type="number" placeholder="1200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="leaseStart" className="text-sm font-medium">
                    Lease Start Date
                  </label>
                  <Input id="leaseStart" type="date" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="leaseEnd" className="text-sm font-medium">
                    Lease End Date
                  </label>
                  <Input id="leaseEnd" type="date" />
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
              <Button>Save Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
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
          className="w-auto"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="all">All Tenants</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{tenant.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
                  ${tenant.rentAmount}/month
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

      {selectedTenant && (
        <Dialog
          open={!!selectedTenant}
          onOpenChange={() => setSelectedTenant(null)}
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
                    <p>${selectedTenant.rentAmount}</p>
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
              <Button variant="outline" className="flex items-center gap-2">
                <Edit size={16} />
                Edit Tenant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TenantManagement;
