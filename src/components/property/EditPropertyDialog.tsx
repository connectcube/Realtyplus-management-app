import {fireDataBase, fireStorage} from "@/lib/firebase";
import {useStore} from "@/lib/zustand";
import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";

import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import UserSelector from "../user-selector/UserSelector";
import {Loader2} from "lucide-react";
import {Button} from "../ui/button";

const EditPropertyDialog = ({property, isOpen, onOpenChange, onPropertyUpdated}) => {
   const {user, setUser} = useStore();
   const [formData, setFormData] = useState({
      name: property.title || property.name || "",
      type: property.propertyType || property.type || "apartment",
      address: property.address || "",
      units: property.units || 1,
      occupiedUnits: property.occupiedUnits || 0,
      monthlyRevenue: property.monthlyRevenue || 0,
      image: property.image || ""
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [selectedUsers, setSelectedUsers] = useState(property.tenants || []);
   const [imageUploading, setImageUploading] = useState(false);
   const [uploadedImageRef, setUploadedImageRef] = useState(null);
   const [originalImageUrl, setOriginalImageUrl] = useState(property.image || "");

   // Initialize form data when property changes
   useEffect(() => {
      setFormData({
         name: property.title || property.name || "",
         type: property.propertyType || property.type || "apartment",
         address: property.address || "",
         units: property.units || 1,
         occupiedUnits: property.occupiedUnits || 0,
         monthlyRevenue: property.monthlyRevenue || 0,
         image: property.image || ""
      });
      setSelectedUsers(property.tenants || []);
      setOriginalImageUrl(property.image || "");
   }, [property]);

   const handleChange = e => {
      const {id, value} = e.target;
      setFormData(prev => ({
         ...prev,
         [id]: ["units", "occupiedUnits", "monthlyRevenue"].includes(id) ? parseInt(value) : value
      }));
   };

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

   const handleDialogClose = async () => {
      // Check if we have an uploaded image that needs to be deleted
      if (uploadedImageRef && formData.image !== originalImageUrl) {
         try {
            // Delete the image from Firebase Storage
            await deleteObject(uploadedImageRef);
            console.log("Uploaded image deleted successfully");
         } catch (error) {
            console.error("Error deleting uploaded image:", error);
         }
      }

      // Reset form data to original property values
      setFormData({
         name: property.title || property.name || "",
         type: property.propertyType || property.type || "apartment",
         address: property.address || "",
         units: property.units || 1,
         occupiedUnits: property.occupiedUnits || 0,
         monthlyRevenue: property.monthlyRevenue || 0,
         image: property.image || ""
      });

      // Reset uploaded image reference
      setUploadedImageRef(null);

      // Close the dialog
      onOpenChange(false);
   };
   const handleSubmit = async () => {
      setLoading(true); // Set loading to true at the beginning

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

      try {
         // Create a new property object
         const updatedProperty = {
            ...property,
            title: formData.name,
            type: formData.type,
            address: formData.address,
            units: formData.units,
            occupiedUnits: formData.occupiedUnits,
            monthlyRevenue: formData.monthlyRevenue,
            image: formData.image
         };

         // Update the property in Firestore
         const propertyRef = doc(fireDataBase, "listings-managementApp", property.uid);
         await updateDoc(propertyRef, updatedProperty);

         // Update tenant references if there are selected users
         if (selectedUsers.length > 0) {
            // Add tenant UIDs to property document
            await updateDoc(propertyRef, {
               tenants: arrayUnion(...selectedUsers.map(user => user.uid))
            });

            // Update each tenant document with a reference to this property
            for (const tenant of selectedUsers) {
               if (tenant.uid) {
                  const tenantDocRef = doc(fireDataBase, "tenants", tenant.uid);
                  const tenantDocSnap = await getDoc(tenantDocRef);

                  if (tenantDocSnap.exists()) {
                     // Update tenant document with property reference
                     await updateDoc(tenantDocRef, {
                        propertyRef: propertyRef
                     });
                  }
               }
            }
         }

         onPropertyUpdated(updatedProperty);
         onOpenChange(false);
      } catch (error) {
         setError("Failed to update property. Please try again.");
         console.error("Error updating property:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Dialog
         open={isOpen}
         onOpenChange={open => {
            if (!open) {
               handleDialogClose();
            } else {
               onOpenChange(true);
            }
         }}>
         <DialogContent className="bg-white max-w-[95vw] sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Edit Property</DialogTitle>
               <DialogDescription>Update the details of your property. Click save when you're done.</DialogDescription>
            </DialogHeader>
            {error && <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">{error}</div>}

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
                  <Label htmlFor="occupiedUnits" className="sm:text-right">
                     Occupied Units
                  </Label>
                  <Input
                     id="occupiedUnits"
                     type="number"
                     min="0"
                     max={formData.units}
                     value={formData.occupiedUnits}
                     onChange={handleChange}
                     className="col-span-1 sm:col-span-3"
                  />
               </div>
               <div className="items-center gap-2 grid grid-cols-1 sm:grid-cols-4">
                  <Label htmlFor="monthlyRevenue" className="sm:text-right">
                     Monthly Revenue
                  </Label>
                  <Input
                     id="monthlyRevenue"
                     type="number"
                     min="0"
                     value={formData.monthlyRevenue}
                     onChange={handleChange}
                     className="col-span-1 sm:col-span-3"
                  />
               </div>
               <div className="items-center gap-2 grid grid-cols-1 sm:grid-cols-4">
                  <Label htmlFor="tenants" className="sm:text-right">
                     Link Tenants
                  </Label>
                  <UserSelector onUserSelect={setSelectedUsers} selectedUsers={selectedUsers} />
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
                     "Save Changes"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
export default EditPropertyDialog;
