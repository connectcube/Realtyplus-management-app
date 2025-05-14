import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {Badge} from "@/components/ui/badge";
import {Building, Home, Plus, MapPin, Users, DollarSign, Calendar, Edit, Trash2, Loader2} from "lucide-react";
import {useStore} from "@/lib/zustand";
import {addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, query, updateDoc, where} from "firebase/firestore";
import {auth, fireDataBase, fireStorage} from "@/lib/firebase";
import {onAuthStateChanged} from "firebase/auth";
import UserSelector from "../user-selector/UserSelector";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import PropertyCard from "./PropertyCard";
interface Property {
   uid: string;
   title: string;
   name: string;
   address: string;
   propertyType: "apartment" | "house" | "condo" | "commercial";
   units: number;
   occupiedUnits: number;
   monthlyRevenue: number;
   maintenanceRequests: number;
   images: [string];
   image: string;
   coverPhotoIndex: number;
}
interface PropertyOverviewProps {
   properties?: Property[];
}
const PropertyOverview = ({properties = defaultProperties}: PropertyOverviewProps) => {
   const {user, setUser} = useStore();
   const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);
   const [activeTab, setActiveTab] = useState("all");
   const [isLoading, setIsLoading] = useState(true);
   const [userProperties, setUserProperties] = useState<Property[]>([]);
   const [authChecked, setAuthChecked] = useState(false);
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, currentUser => {
         setAuthChecked(true);
         if (!currentUser) {
            setIsLoading(false);
         }
      });
      return () => unsubscribe();
   }, []);
   const handlePropertyUpdated = updatedProperty => {
      // Update the userProperties state with the updated property
      setUserProperties(prevProperties => prevProperties.map(prop => (prop.uid === updatedProperty.uid ? updatedProperty : prop)));
   };
   useEffect(() => {
      const fetchProperties = async () => {
         if (!user.uid || !user.propertyRefs || user.propertyRefs.length === 0) {
            setIsLoading(false);
            return;
         }

         try {
            const propertyPromises = user.propertyRefs.map(async propertyRef => {
               const propertySnap = await getDoc(propertyRef);
               if (propertySnap.exists()) {
                  return {
                     uid: propertySnap.id,
                     ...propertySnap.data()
                  };
               }
               return null;
            });

            const fetchedProperties = (await Promise.all(propertyPromises)).filter(Boolean);
            setUserProperties(fetchedProperties as Property[]);
         } catch (error) {
            console.error("Error fetching properties:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchProperties();
   }, [user.uid, user.propertyRefs]);

   const displayProperties = userProperties.length > 0 ? userProperties : properties;

   const filteredProperties =
      activeTab === "all" ? displayProperties : displayProperties.filter(property => property.propertyType === activeTab);

   const totalProperties = userProperties.length || 0;
   const totalUnits = displayProperties.reduce((sum, property) => sum + (property.units || 0), 0);
   const occupancyRate =
      totalUnits > 0
         ? Math.round((displayProperties.reduce((sum, property) => sum + (property.occupiedUnits || 0), 0) / totalUnits) * 100)
         : 0;
   const totalRevenue = displayProperties.reduce((sum, property) => sum + (property.monthlyRevenue || 0), 0);
   const totalMaintenanceRequests = displayProperties.reduce((sum, property) => sum + (property.maintenanceRequests || 0), 0);

   if (isLoading) {
      return (
         <div className="flex justify-center items-center p-6 w-full h-full">
            <div className="text-center">
               <Loader2 className="mx-auto w-8 h-8 text-primary animate-spin" />
               <p className="mt-2 text-muted-foreground">Loading properties...</p>
            </div>
         </div>
      );
   }

   if (!user.uid && authChecked) {
      return (
         <div className="bg-white shadow-sm p-6 rounded-lg w-full h-full">
            <div className="py-8 text-center">
               <h2 className="mb-2 font-bold text-xl">Login Required</h2>
               <p className="mb-4 text-muted-foreground">Please log in to view and manage your properties.</p>
               <Button>Go to Login</Button>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-white shadow-sm p-6 rounded-lg w-full h-full">
         <div className="flex justify-between items-center mb-6">
            <div>
               <h2 className="font-bold text-2xl">Property Overview</h2>
               <p className="text-muted-foreground">Manage and monitor your properties</p>
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
                        <p className="text-muted-foreground text-sm">Total Properties</p>
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
                        <p className="font-bold text-2xl">ZMW {totalRevenue.toLocaleString()}</p>
                     </div>
                     <DollarSign className="opacity-80 w-8 h-8 text-primary" />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                     <div>
                        <p className="text-muted-foreground text-sm">Maintenance Requests</p>
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
               {filteredProperties.length === 0 ? (
                  <div className="py-8 text-center">
                     <p className="text-muted-foreground">No properties found.</p>
                     <Button variant="outline" className="mt-4" onClick={() => setIsAddPropertyDialogOpen(true)}>
                        <Plus className="mr-2 w-4 h-4" /> Add Your First Property
                     </Button>
                  </div>
               ) : (
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                     {filteredProperties.map(property => (
                        <PropertyCard key={property.uid} property={property} onPropertyUpdated={handlePropertyUpdated} />
                     ))}
                  </div>
               )}
            </TabsContent>
         </Tabs>

         {/* Add Property Dialog */}
         <PropertyDialog
            setIsAddPropertyDialogOpen={setIsAddPropertyDialogOpen}
            isAddPropertyDialogOpen={isAddPropertyDialogOpen}
            onPropertyAdded={newProperty => {
               setUserProperties([...userProperties, newProperty]);
            }}
         />
      </div>
   );
};

const PropertyDialog = ({setIsAddPropertyDialogOpen, isAddPropertyDialogOpen, onPropertyAdded}) => {
   const {user, setUser} = useStore();
   const [formData, setFormData] = useState({
      name: "",
      type: "apartment",
      address: "",
      units: 1,
      image: ""
   });
   const [fetchedProperties, setFetchedProperties] = useState([]);
   const [loading, setLoading] = useState(false);
   const [fetchLoading, setFetchLoading] = useState(false);
   const [error, setError] = useState("");
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [imageUploading, setImageUploading] = useState(false);
   const [uploadedImageRef, setUploadedImageRef] = useState(null);
   const [selectedTenant, setSelectedTenant] = useState(null);
   const handleImageUpload = async e => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         setImageUploading(true);

         // Create a reference to the storage location
         const storageRef = ref(fireStorage, `management-app/listings-image/${user.uid}/${Date.now()}-${file.name}`);

         // Upload the file
         await uploadBytes(storageRef, file);

         // Store the reference for potential deletion
         setUploadedImageRef(storageRef);

         // Get the download URL
         const downloadURL = await getDownloadURL(storageRef);

         // Update form data with the download URL
         setFormData(prev => ({
            ...prev,
            image: downloadURL
         }));
      } catch (error) {
         console.error("Error uploading image:", error);
         setError("Failed to upload image. Please try again.");
      } finally {
         setImageUploading(false);
      }
   };

   const handleChange = e => {
      const {id, value} = e.target;
      setFormData(prev => ({
         ...prev,
         [id]: id === "units" ? parseInt(value) : value
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
            propertyType: formData.type,
            address: formData.address,
            units: formData.units,
            occupiedUnits: 0,
            monthlyRevenue: 0,
            maintenanceRequests: 0,
            image: formData.image || "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
            postedByDetails: {
               uid: user.uid,
               userName: user.userName,
               role: user.role
            },
            tenant: selectedTenant, // Store single tenant
            createdAt: new Date().toISOString()
         };

         // First, check if the user document exists in Firestore
         const userDocRef = doc(fireDataBase, user.role, user.uid);
         const userDoc = await getDoc(userDocRef);

         if (userDoc.exists()) {
            // 1. Add the property to the listings-managementApp collection
            const listingRef = await addDoc(collection(fireDataBase, "listings-managementApp"), newProperty);

            // 2. Add the property reference to the user's properties array
            await updateDoc(userDocRef, {
               propertyRefs: arrayUnion(listingRef)
            });

            // 3. Update tenant document with property reference if tenant is selected
            if (selectedTenant && selectedTenant.uid) {
               const tenantDocRef = doc(fireDataBase, "tenants", selectedTenant.uid);
               const tenantDoc = await getDoc(tenantDocRef);

               if (tenantDoc.exists()) {
                  await updateDoc(tenantDocRef, {
                     propertyRef: listingRef
                  });
               }
            }

            // Update local state
            const updatedProperties = [...(user.properties || []), newProperty];
            setUser({
               properties: updatedProperties
            });

            // Notify parent component
            if (onPropertyAdded) {
               onPropertyAdded(newProperty);
            }

            setIsAddPropertyDialogOpen(false);
            setFormData({
               name: "",
               type: "apartment",
               address: "",
               units: 1,
               image: ""
            });
         } else {
            setError("User profile not found. Please complete your profile setup first.");
         }
      } catch (err) {
         console.error("Error adding property:", err);
         setError("Failed to add property. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   const fetchUserProperties = async () => {
      try {
         if (!user.uid) return;

         setFetchLoading(true);

         // Query properties where postedByDetails.uid matches current user's uid
         const propertiesQuery = query(collection(fireDataBase, "listings"), where("postedByDetails.uid", "==", user.uid));

         // Create a real-time listener with onSnapshot instead of getDocs
         const unsubscribe = onSnapshot(
            propertiesQuery,
            querySnapshot => {
               const userProperties = querySnapshot.docs.map(doc => ({
                  uid: doc.id,
                  ...doc.data()
               }));

               // Update user state with fetched properties
               setFetchedProperties(userProperties);
               setFetchLoading(false);
            },
            error => {
               console.error("Error in properties listener:", error);
               setFetchLoading(false);
            }
         );

         // Return the unsubscribe function so we can clean up the listener when needed
         return unsubscribe;
      } catch (error) {
         console.error("Error setting up properties listener:", error);
         setFetchLoading(false);
         return () => {}; // Return empty function as fallback
      }
   };

   useEffect(() => {
      fetchUserProperties();
   }, [user.uid]);

   const handlePropertyClick = async property => {
      try {
         setLoading(true);

         if (!user.uid || !user.role) {
            setError("You must be logged in to add properties");
            return;
         }
         console.log(user);
         const userRef = doc(fireDataBase, user.role, user.uid);

         const newProperty = {
            id: Date.now().toString(),
            name: property.title || property.name,
            propertyType: property.propertyType || property.type,
            address: property.address || "",
            units: property.units || 1,
            occupiedUnits: 0,
            monthlyRevenue: 0,
            maintenanceRequests: 0,
            image: property.images?.[property.coverPhotoIndex] || property.image || "",
            postedByDetails: {
               uid: user.uid,
               userName: user.userName
            },
            createdAt: new Date().toISOString()
         };

         await updateDoc(userRef, {
            properties: arrayUnion(newProperty)
         });

         // Update local state
         const updatedProperties = [...(user.properties || []), newProperty];
         setUser({
            properties: updatedProperties
         });

         // Notify parent component
         if (onPropertyAdded) {
            onPropertyAdded(newProperty);
         }

         setFormData({
            name: "",
            type: "apartment",
            address: "",
            units: 1,
            image: ""
         });

         setIsAddPropertyDialogOpen(false);
      } catch (err) {
         console.error("Error adding existing property:", err);
         setError("Failed to add property. Please try again.");
      } finally {
         setLoading(false);
      }
   };
   const handleDialogClose = async () => {
      // Check if we have an uploaded image that needs to be deleted
      if (uploadedImageRef && formData.image) {
         try {
            // Delete the image from Firebase Storage
            await deleteObject(uploadedImageRef);
            console.log("Uploaded image deleted successfully");
         } catch (error) {
            console.error("Error deleting uploaded image:", error);
         }
      }

      // Reset form data
      setFormData({
         name: "",
         type: "apartment",
         address: "",
         units: 1,
         image: ""
      });

      // Reset uploaded image reference
      setUploadedImageRef(null);

      // Close the dialog
      setIsAddPropertyDialogOpen(false);
   };
   return (
      <Dialog
         open={isAddPropertyDialogOpen}
         onOpenChange={open => {
            if (!open) {
               handleDialogClose();
            } else {
               setIsAddPropertyDialogOpen(true);
            }
         }}>
         <DialogContent className="max-w-[95vw] sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Add New Property</DialogTitle>
               <DialogDescription>Enter the details of your new property. Click save when you're done.</DialogDescription>
            </DialogHeader>
            {error && <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">{error}</div>}

            {fetchLoading ? (
               <div className="flex justify-center items-center py-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="ml-2">Loading your properties...</span>
               </div>
            ) : (
               fetchedProperties &&
               fetchedProperties.length > 0 && (
                  <div className="mb-4">
                     <h3 className="mb-2 font-medium text-sm">Your posted properties</h3>
                     <div className="p-2 border border-input rounded-md max-h-[200px] overflow-y-auto">
                        {fetchedProperties.map(property => (
                           <div key={property.uid} className="mb-2 last:mb-0">
                              <SimplePropertyCard property={property} onClick={() => handlePropertyClick(property)} />
                           </div>
                        ))}
                     </div>
                  </div>
               )
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
                     value={formData.name}
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
                     value={formData.type}
                     onChange={handleChange}>
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
                  <Label htmlFor="tenant" className="sm:text-right">
                     Link Tenant
                  </Label>
                  <UserSelector
                     onUserSelect={users => setSelectedTenant(users.length > 0 ? users[0] : null)}
                     selectedUsers={selectedTenant ? [selectedTenant] : []}
                  />
               </div>

               <div className="items-center gap-2 grid grid-cols-1 sm:grid-cols-4">
                  <Label htmlFor="image" className="sm:text-right">
                     Property Image
                  </Label>
                  <div className="space-y-2 col-span-1 sm:col-span-3">
                     <div className="flex items-center gap-2">
                        <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                        {imageUploading && (
                           <div className="flex items-center">
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              <span className="text-xs">Uploading...</span>
                           </div>
                        )}
                     </div>
                     {formData.image && (
                        <div className="mt-2">
                           <div className="relative rounded-md w-full max-w-[200px] h-[100px] overflow-hidden">
                              <img src={formData.image} alt="Property preview" className="w-full h-full object-cover" />
                           </div>
                        </div>
                     )}
                     <Input
                        id="image"
                        placeholder="Or enter image URL manually"
                        className="mt-2"
                        value={formData.image}
                        onChange={handleChange}
                     />
                  </div>
               </div>
            </div>
            <DialogFooter className="sm:flex-row flex-col gap-2">
               <Button variant="outline" onClick={handleDialogClose} disabled={loading} className="w-full sm:w-auto">
                  Cancel
               </Button>
               <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                     <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Saving...
                     </>
                  ) : (
                     "Save Property"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

const SimplePropertyCard = ({property, onClick}) => {
   return (
      <div className="flex items-center gap-3 hover:bg-accent/10 p-2 border border-border rounded-md transition-colors">
         {/* Cover Image - Square thumbnail */}
         <div className="flex-shrink-0 rounded-md w-16 h-16 overflow-hidden">
            <img
               src={property.image || property.images?.[property.coverPhotoIndex] || "https://via.placeholder.com/150"}
               alt={property.name || property.title}
               className="w-full h-full object-cover"
               onError={e => {
                  e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
               }}
            />
         </div>

         {/* Property Name */}
         <div className="flex-grow overflow-hidden">
            <h4 className="font-medium text-sm truncate">{property.title || ""}</h4>
            <p className="text-muted-foreground text-xs truncate">{property.propertyType || ""}</p>
         </div>
         <Button size="sm" variant="outline" onClick={onClick}>
            Add
         </Button>
      </div>
   );
};

const defaultProperties: Property[] = [
   {
      uid: "1",
      title: "Sunset Apartments",
      name: "",
      address: "123 Main St, Anytown, CA 90210",
      propertyType: "apartment",
      units: 24,
      occupiedUnits: 22,
      monthlyRevenue: 28500,
      maintenanceRequests: 3,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      images: [""],
      coverPhotoIndex: 0
   }
];

export default PropertyOverview;
