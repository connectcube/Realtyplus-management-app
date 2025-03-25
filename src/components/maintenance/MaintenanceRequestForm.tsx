import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form schema validation
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(10, { message: "Please provide a detailed description" }),
  priority: z.string(),
  location: z.string(),
});

interface MaintenanceRequestFormProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

const MaintenanceRequestForm = ({
  onSubmit = () => {},
  isLoading = false,
}: MaintenanceRequestFormProps) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      location: "",
    },
  });

  // Handle photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos]);

      // Create preview URLs for the photos
      const newPreviewUrls = newPhotos.map((photo) =>
        URL.createObjectURL(photo),
      );
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls]);
    }
  };

  // Remove a photo
  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    const updatedPreviewUrls = [...photoPreviewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviewUrls[index]);

    updatedPhotos.splice(index, 1);
    updatedPreviewUrls.splice(index, 1);

    setPhotos(updatedPhotos);
    setPhotoPreviewUrls(updatedPreviewUrls);
  };

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real implementation, you would include the photos in the submission
    console.log("Maintenance request submitted:", { ...values, photos });
    alert(
      "Maintenance request submitted successfully! Your landlord will be notified.",
    );
    onSubmit({ ...values });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader>
        <CardTitle>Submit Maintenance Request</CardTitle>
        <CardDescription>
          Please provide details about the issue that needs attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Leaking Faucet in Kitchen"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief title for your maintenance request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe the issue in detail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include relevant details such as when the issue started and
                    any troubleshooting you've tried.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Not Urgent</SelectItem>
                        <SelectItem value="medium">
                          Medium - Needs Attention
                        </SelectItem>
                        <SelectItem value="high">
                          High - Urgent Issue
                        </SelectItem>
                        <SelectItem value="emergency">
                          Emergency - Immediate Attention
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the urgency level of this request.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Kitchen, Bathroom, Bedroom"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify where the issue is located.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div>
                <FormLabel className="block mb-2">Photos</FormLabel>
                <FormDescription className="mb-4">
                  Upload photos of the issue to help us better understand the
                  problem.
                </FormDescription>

                <div className="flex flex-wrap gap-4 mt-2">
                  {photoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Uploaded photo ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pt-6 flex justify-end space-x-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceRequestForm;
