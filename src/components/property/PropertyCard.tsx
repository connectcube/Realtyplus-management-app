import {Edit, Loader2, MapPin, Trash2} from "lucide-react";
import {Badge} from "../ui/badge";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Button} from "../ui/button";
import {useStore} from "@/lib/zustand";
import {useState} from "react";
import {fireDataBase} from "@/lib/firebase";
import {deleteDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import EditPropertyDialog from "./EditPropertyDialog";
const getBadgeVariant = (type: Property["propertyType"]) => {
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
interface Property {
   id: string;
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
interface PropertyCardProps {
   property: Property;
   onPropertyUpdated?: (updatedProperty: any) => void;
}
const PropertyCard = ({property, onPropertyUpdated}: PropertyCardProps) => {
   const {user, setUser} = useStore();
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
         return;
      }

      try {
         setIsDeleting(true);

         if (!user.uid || !user.role) {
            alert("You must be logged in to delete properties");
            setIsDeleting(false);
            return;
         }

         // Get the user document reference
         const userDocRef = doc(fireDataBase, user.role, user.uid);

         // Get the current user document
         const userDoc = await getDoc(userDocRef);

         if (userDoc.exists()) {
            // Check if we have propertyRefs in the user document
            const propertyRefs = userDoc.data().propertyRefs || [];

            // Find the property reference that matches this property
            const propertyRef = propertyRefs.find(
               ref => (ref.path && ref.path.includes(property.id)) || (ref.id && ref.id === property.id)
            );

            if (propertyRef) {
               // Get the document reference to the property in listings-managementApp
               const listingDocRef =
                  typeof propertyRef === "object" && propertyRef.path
                     ? doc(fireDataBase, propertyRef.path)
                     : doc(fireDataBase, "listings-managementApp", propertyRef.id || propertyRef);

               // Delete the property document
               await deleteDoc(listingDocRef);

               // Remove the property reference from the user document
               const updatedPropertyRefs = propertyRefs.filter(
                  ref => !(ref.path && ref.path.includes(property.id)) && !(ref.id && ref.id === property.id) && ref !== propertyRef
               );

               await updateDoc(userDocRef, {
                  propertyRefs: updatedPropertyRefs
               });

               // Update local state
               const updatedProperties = user.properties.filter(p => p.id !== property.id);
               setUser({
                  properties: updatedProperties
               });

               // Notify any listeners
               if (onPropertyUpdated) {
                  onPropertyUpdated(null); // Passing null to indicate deletion
               }
            } else {
               alert("Property reference not found in your account");
            }
         } else {
            alert("User profile not found");
         }
      } catch (error) {
         console.error("Error deleting property:", error);
         alert("Failed to delete property. Please try again.");
      } finally {
         setIsDeleting(false);
      }
   };

   return (
      <Card className="overflow-hidden">
         <div className="h-48 overflow-hidden">
            <img
               src={property.image || (property.images && property.images[property.coverPhotoIndex])}
               alt={property.title}
               className="w-full h-full object-cover hover:scale-105 transition-transform"
               onError={e => {
                  e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image";
               }}
            />
         </div>
         <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
               <CardTitle className="text-xl">{property.title || ""}</CardTitle>
               <Badge variant={getBadgeVariant(property.propertyType)}>{property.propertyType}</Badge>
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
                     {property.units > 0 ? Math.round(((property.occupiedUnits || 0) / (property.units || 1)) * 100) : 0}%
                  </p>
               </div>
               <div>
                  <p className="text-muted-foreground">Monthly Revenue</p>
                  <p className="font-medium">ZMW {property.monthlyRevenue || 0}</p>
               </div>
               <div>
                  <p className="text-muted-foreground">Maintenance</p>
                  <p className="font-medium">{property.maintenanceRequests || 0} requests</p>
               </div>
            </div>
         </CardContent>
         <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
               <Edit className="mr-1 w-4 h-4" /> Edit
            </Button>
            <Button
               variant="outline"
               size="sm"
               className="hover:bg-destructive/10 text-destructive"
               onClick={handleDelete}
               disabled={isDeleting}>
               {isDeleting ? (
                  <>
                     <Loader2 className="mr-1 w-4 h-4 animate-spin" /> Deleting...
                  </>
               ) : (
                  <>
                     <Trash2 className="mr-1 w-4 h-4" /> Delete
                  </>
               )}
            </Button>
         </CardFooter>

         {/* Edit Property Dialog */}
         <EditPropertyDialog
            property={property}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onPropertyUpdated={updatedProperty => {
               if (onPropertyUpdated) {
                  onPropertyUpdated(updatedProperty);
               }
            }}
         />
      </Card>
   );
};
export default PropertyCard;
