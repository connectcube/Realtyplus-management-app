import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, UserPlus, Mail, Phone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RatingStars from '@/components/rating/RatingStars';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/zustand';
import { fireDataBase } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  Timestamp,
  where,
  query,
} from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

interface Tenant {
  id: string;
  full_name?: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  unit: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  status: 'active' | 'inactive' | 'pending';
}

interface TenantManagementProps {
  tenants?: Tenant[];
}
interface Property {
  title: string;
  lease: {
    startDate: Timestamp;
    endDate: Timestamp;
    monthlyRent: number;
  };
  units: number;
}
const TenantManagement = ({ tenants = [] }: TenantManagementProps) => {
  const { user, setUser } = useStore();
  console.log('User', user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [isEditTenantOpen, setIsEditTenantOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [tenantsList, setTenantsList] = useState<Tenant[]>(tenants);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    unit: '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tenant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [tenantToRate, setTenantToRate] = useState<Tenant | null>(null);
  const [tenantRating, setTenantRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        if (!user?.tenantRefs?.length) {
          setLoading(false);
          return;
        }

        const tenantsData = await Promise.all(
          user.tenantRefs.map(async tenantRef => {
            const snapshot = await getDoc(tenantRef);

            if (snapshot.exists()) {
              const tenantData = snapshot.data();

              // Get property details from propertyRef (single reference) or propertyRefs[0] (array)
              let propertyData = {};
              const propertyReference = tenantData.propertyRef || tenantData.propertyRefs?.[0];

              if (propertyReference) {
                const propertySnapshot = await getDoc(propertyReference);
                if (propertySnapshot.exists()) {
                  const propData = propertySnapshot.data() as Property;
                  console.log('OG data ', propData);
                  // Handle lease data with timestamps
                  const leaseStartDate = propData.lease?.startDate?.toDate?.()
                    ? propData.lease.startDate.toDate().toISOString().split('T')[0]
                    : '';

                  const leaseEndDate = propData.lease?.endDate?.toDate?.()
                    ? propData.lease.endDate.toDate().toISOString().split('T')[0]
                    : '';

                  propertyData = {
                    property: propData.title || '',
                    unit: propData.units || '',
                    leaseStart: leaseStartDate,
                    leaseEnd: leaseEndDate,
                    rentAmount: propData.lease?.monthlyRent || 0,
                  };
                }
              }
              console.log('transformed data ', propertyData);
              return { id: snapshot.id, ...tenantData, ...propertyData } as Tenant;
            }
            return null;
          })
        );

        setTenantsList(tenantsData.filter(Boolean) as Tenant[]);
        console.log(tenantsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setLoading(false);
      }
    };

    fetchTenants();
  }, [user]);

  const filteredTenants = tenantsList.filter(tenant => {
    const matchesSearch =
      (tenant.name || tenant.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant.property || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
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
  const handleDeleteTenant = (id: string) => {
    if (confirm('Are you sure you want to delete this tenant?')) {
      const tenant = tenantsList.find(t => t.id === id);
      if (tenant) {
        setTenantToRate(tenant);
        setShowRatingDialog(true);
      } else {
        setTenantsList(tenantsList.filter(tenant => tenant.id !== id));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === 'rentAmount' ? Number(value) : value,
    });
  };

  const handleSaveTenant = async () => {
    try {
      if (!selectedTenant) {
        // For new tenant
        const tenantsCollection = collection(fireDataBase, 'tenants');
        const newTenantData = {
          ...formData,
          status: 'pending' as const,
        };

        const docRef = await addDoc(tenantsCollection, newTenantData);
        const tenantRef = doc(fireDataBase, 'tenants', docRef.id);

        // Add tenant reference to user
        if (user?.uid) {
          const userRef = doc(fireDataBase, 'users', user.uid);
          await updateDoc(userRef, {
            tenantRefs: user.tenantRefs ? [...user.tenantRefs, tenantRef] : [tenantRef],
          });

          // Update local user state
          setUser({
            ...user,
            tenantRefs: user.tenantRefs ? [...user.tenantRefs, tenantRef] : [tenantRef],
          });
        }

        setTenantsList([...tenantsList, { id: docRef.id, ...newTenantData }]);
        setIsAddTenantOpen(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          property: '',
          unit: '',
          leaseStart: '',
          leaseEnd: '',
          rentAmount: 0,
        });
        alert(
          'New tenant added successfully! An invitation email has been sent to the tenant to complete registration.'
        );
      } else {
        // For editing existing tenant
        const tenantRef = doc(fireDataBase, 'tenants', selectedTenant.id);
        await updateDoc(tenantRef, formData);

        const updatedTenants = tenantsList.map(tenant =>
          tenant.id === selectedTenant.id ? { ...tenant, ...formData } : tenant
        );
        setTenantsList(updatedTenants);
        setIsEditTenantOpen(false);
        setSelectedTenant(null);
        alert('Tenant updated successfully!');
      }
    } catch (error) {
      console.error('Error saving tenant:', error);
      alert('Error saving tenant. Please try again.');
    }
  };

  const handleAddNewTenant = () => {
    setSelectedTenant(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      property: '',
      unit: '',
      leaseStart: '',
      leaseEnd: '',
      rentAmount: 0,
    });
    setIsAddTenantOpen(true);
  };

  const handleDeleteConfirmed = async (id: string) => {
    try {
      const tenantRef = doc(fireDataBase, 'tenants', id);
      await deleteDoc(tenantRef);
      setTenantsList(tenantsList.filter(tenant => tenant.id !== id));
      setShowRatingDialog(false);
      setTenantRating(0);
      setRatingComment('');
      alert('Tenant has been removed successfully.');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Error deleting tenant. Please try again.');
    }
  };
  const searchTenants = async (queryText: string) => {
    if (!queryText.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const tenantsCollection = collection(fireDataBase, 'tenants');
      const searchTerm = queryText;
      const endTerm = searchTerm + '\uf8ff';

      // Create separate queries for each field using lowercase fields
      const emailQuery = query(
        tenantsCollection,
        where('email', '>=', searchTerm),
        where('email', '<=', endTerm)
      );

      const firstNameQuery = query(
        tenantsCollection,
        where('firstName', '>=', searchTerm),
        where('firstName', '<=', endTerm)
      );

      const lastNameQuery = query(
        tenantsCollection,
        where('lastName', '>=', searchTerm),
        where('lastName', '<=', endTerm)
      );

      const fullNameQuery = query(
        tenantsCollection,
        where('full_name', '>=', searchTerm),
        where('full_name', '<=', endTerm)
      );

      // Execute all queries in parallel
      const [emailDocs, firstNameDocs, lastNameDocs, fullNameDocs] = await Promise.all([
        getDocs(emailQuery),
        getDocs(firstNameQuery),
        getDocs(lastNameQuery),
        getDocs(fullNameQuery),
      ]);

      // Combine results using a Map to avoid duplicates
      const tenantMap = new Map();

      [emailDocs, firstNameDocs, lastNameDocs, fullNameDocs].forEach(snapshot => {
        snapshot.forEach(doc => {
          if (!tenantMap.has(doc.id)) {
            tenantMap.set(doc.id, { id: doc.id, ...doc.data() } as Tenant);
          }
        });
      });

      setSearchResults(Array.from(tenantMap.values()));
    } catch (error) {
      console.error('Error searching tenants:', error);
      // If the lowercase fields don't exist, fall back to client-side filtering
      try {
        const snapshot = await getDocs(collection(fireDataBase, 'tenants'));
        const results: Tenant[] = [];
        const searchTermLower = queryText.toLowerCase();

        snapshot.forEach(doc => {
          const data = doc.data();
          const email = (data.email || '').toLowerCase();
          const firstName = (data.firstName || '').toLowerCase();
          const lastName = (data.lastName || '').toLowerCase();
          const fullName = (data.full_name || '').toLowerCase();
          const name = (data.name || '').toLowerCase();

          if (
            email.includes(searchTermLower) ||
            firstName.includes(searchTermLower) ||
            lastName.includes(searchTermLower) ||
            fullName.includes(searchTermLower) ||
            name.includes(searchTermLower)
          ) {
            results.push({ id: doc.id, ...data } as Tenant);
          }
        });

        setSearchResults(results);
      } catch (fallbackError) {
        console.error('Error in fallback search:', fallbackError);
      }
    } finally {
      setIsSearching(false);
    }
  };
  const handleSelectTenant = async (tenant: Tenant) => {
    if (!user?.uid) {
      alert('You must be logged in to add a tenant.');
      return;
    }

    try {
      const tenantRef = doc(fireDataBase, 'tenants', tenant.id);

      // Check if tenant is already in user's tenantRefs
      const isAlreadyAdded = user.tenantRefs?.some(ref => ref.path === `tenants/${tenant.id}`);

      if (isAlreadyAdded) {
        alert('This tenant is already added to your account.');
        return;
      }

      // Add tenant reference to user
      const userRef = doc(fireDataBase, 'users', user.uid);
      await updateDoc(userRef, {
        tenantRefs: user.tenantRefs ? [...user.tenantRefs, tenantRef] : [tenantRef],
      });

      // Update local user state
      setUser({
        ...user,
        tenantRefs: user.tenantRefs ? [...user.tenantRefs, tenantRef] : [tenantRef],
      });

      // Reset search
      setSearchQuery('');
      setSearchResults([]);
      setIsAddTenantOpen(false);

      alert('Tenant added successfully!');
    } catch (error) {
      console.error('Error adding tenant:', error);
      alert('Error adding tenant. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 w-full">
        <div className="flex justify-between items-center">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-36 h-10" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="w-1/3 h-10" />
          <Skeleton className="w-64 h-10" />
        </div>
        <div className="gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="w-32 h-6" />
                <div className="flex space-x-2">
                  <Skeleton className="rounded-full w-8 h-8" />
                  <Skeleton className="rounded-full w-8 h-8" />
                </div>
              </div>
              <Skeleton className="mt-1 w-48 h-4" />
              <Skeleton className="mt-2 w-16 h-4" />
              <div className="space-y-2 mt-4">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-24 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 w-full h-full">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="font-bold text-xl sm:text-2xl">Tenant Management</h1>
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
                Search for an existing tenant or fill in the details to add a new tenant.
              </DialogDescription>
            </DialogHeader>

            {/* Search section */}
            <div className="mb-4 pb-4 border-b">
              <div className="space-y-2">
                <Label htmlFor="tenantSearch">Search Existing Tenants</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="top-2.5 left-3 absolute w-4 h-4 text-muted-foreground" />
                    <Input
                      id="tenantSearch"
                      placeholder="Search by email, name..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => searchTenants(searchQuery)}
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="mt-4 border rounded-md max-h-60 overflow-y-auto">
                  <div className="bg-muted p-2 font-medium text-sm">Search Results</div>
                  <div className="divide-y">
                    {searchResults.map(tenant => (
                      <div
                        key={tenant.id}
                        className="flex justify-between items-center hover:bg-muted/50 p-3 cursor-pointer"
                        onClick={() => handleSelectTenant(tenant)}
                      >
                        <div>
                          <div className="font-medium">{tenant.full_name || tenant.name}</div>
                          <div className="text-muted-foreground text-sm">{tenant.email}</div>
                        </div>
                        <Button size="sm" variant="ghost">
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !isSearching && (
                <div className="bg-muted/20 mt-4 p-3 rounded-md text-muted-foreground text-center">
                  No tenants found. Fill in the details below to add a new tenant.
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddTenantOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveTenant}>Save Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="top-2.5 left-3 absolute w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList className="sm:flex sm:flex-row gap-1 sm:gap-0 grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="all">All Tenants</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map(tenant => (
          <Card key={tenant.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{tenant.full_name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => handleEditTenant(tenant)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
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
                    tenant.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : tenant.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tenant.status || 'inactive'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 w-4 h-4 text-muted-foreground" />
                  <span>{tenant.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 w-4 h-4 text-muted-foreground" />
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Home className="mr-2 w-4 h-4 text-muted-foreground" />
                  <span>
                    Lease: {new Date(tenant.leaseStart).toLocaleDateString()} -{' '}
                    {new Date(tenant.leaseEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <div className="flex justify-between items-center w-full">
                <div className="font-medium text-sm">ZMW {tenant.rentAmount || 0}/month</div>
                <Button variant="outline" size="sm" onClick={() => handleViewTenant(tenant)}>
                  View Details
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="flex flex-col justify-center items-center p-8 text-center">
          <div className="bg-muted mb-4 p-3 rounded-full">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No tenants found</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : 'Try adding a new tenant or changing your filters'}
          </p>
        </div>
      )}

      {/* View Tenant Details Dialog */}
      {selectedTenant && (
        <Dialog
          open={!!selectedTenant && !isEditTenantOpen}
          onOpenChange={open => {
            if (!open) setSelectedTenant(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tenant Details</DialogTitle>
            </DialogHeader>
            <div className="gap-6 grid grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium text-muted-foreground text-sm">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Name</p>
                    <p>{selectedTenant.full_name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p>{selectedTenant.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <p>{selectedTenant.phone}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-muted-foreground text-sm">
                  Lease Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Property</p>
                    <p>
                      {selectedTenant.property} - Unit {selectedTenant.unit}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Lease Period</p>
                    <p>
                      {new Date(selectedTenant.leaseStart).toLocaleDateString()} -{' '}
                      {new Date(selectedTenant.leaseEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Monthly Rent</p>
                    <p>ZMW {selectedTenant.rentAmount || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedTenant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : selectedTenant.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
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
            <DialogDescription>Update the tenant details below.</DialogDescription>
          </DialogHeader>
          <div className="gap-4 grid py-4">
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="font-medium text-sm">
                  Full Name
                </label>
                <Input id="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="font-medium text-sm">
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
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="phone" className="font-medium text-sm">
                  Phone Number
                </label>
                <Input id="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label htmlFor="property" className="font-medium text-sm">
                  Property
                </label>
                <Input id="property" value={formData.property} onChange={handleInputChange} />
              </div>
            </div>
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="unit" className="font-medium text-sm">
                  Unit
                </label>
                <Input id="unit" value={formData.unit} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label htmlFor="rentAmount" className="font-medium text-sm">
                  Monthly Rent
                </label>
                <Input
                  id="rentAmount"
                  type="number"
                  value={formData.rentAmount || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="leaseStart" className="font-medium text-sm">
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
                <label htmlFor="leaseEnd" className="font-medium text-sm">
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
              <p className="text-gray-500 text-sm">
                {tenantToRate?.property} - Unit {tenantToRate?.unit}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <RatingStars rating={tenantRating} onRatingChange={setTenantRating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this tenant..."
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (tenantToRate) handleDeleteConfirmed(tenantToRate.id);
              }}
            >
              Skip
            </Button>
            <Button
              onClick={() => {
                console.log(`Rated tenant ${tenantRating} stars with comment: ${ratingComment}`);
                if (tenantToRate) handleDeleteConfirmed(tenantToRate.id);
                alert('Thank you for your feedback! Tenant has been removed.');
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
