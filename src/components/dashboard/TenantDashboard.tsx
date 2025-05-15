import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import RentStatusCard from './RentStatusCard';
import MaintenanceRequestForm from '../maintenance/MaintenanceRequestForm';
import RequestHistoryList from '../maintenance/RequestHistoryList';
import MessageCenter from '../communication/MessageCenter';
import { Home, Wrench, FileText, MessageCircle, ArrowUpDown } from 'lucide-react';
import RatingStars from '@/components/rating/RatingStars';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/zustand';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';

interface TenantDashboardProps {
  tenantName?: string;
  propertyAddress?: string;
  rentInfo?: {
    dueDate: string;
    amount: number;
    status: 'paid' | 'due' | 'overdue' | 'partially_paid';
    remainingDays: number;
    percentagePaid: number;
  };
}
interface PAYMENT {
  id: string;
  date: Date;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  isSuccessful: boolean;
  extraCharges: number;
  dueDate: Timestamp;
  paymentDate: Timestamp;
}
interface PropertyData {
  address?: string;
  title?: string;
  image?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  postedByDetails?: {
    uid: string;
    userName?: string;
    email?: string;
    phone?: string;
  };
  payments: PAYMENT[];
  manager?: {
    name: string;
    email: string;
    phone: string;
  };
  lease?: {
    startDate: Timestamp;
    endDate: Timestamp;
    monthlyRent: number;
  };
  emergency?: {
    maintenance: string;
    afterHours: string;
  };
}

const TenantDashboard = ({
  tenantName = 'Loading...',
  propertyAddress = 'Loading address...',
  rentInfo = {
    dueDate: 'Loading...',
    amount: 0,
    status: 'due' as const,
    remainingDays: 0,
    percentagePaid: 0,
  },
}: TenantDashboardProps) => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('rent');
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [landlordRating, setLandlordRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [landlordDetails, setLandlordDetails] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>(
    'newest'
  );
  const [filteredPayments, setFilteredPayments] = useState<PAYMENT[]>([]);
  console.log(user);
  useEffect(() => {
    const fetchPropertyData = async () => {
      console.log('Starting fetchPropertyData with user:', user);

      try {
        console.log('Attempting to fetch property with propertyRef:', user.propertyRef);
        // For tenants, we only use the first property reference
        const propertyDoc = await getDoc(user.propertyRef);
        console.log('Property document exists:', propertyDoc.exists());
        if (propertyDoc.exists()) {
          const propertyData = propertyDoc.data() as PropertyData;
          console.log('Retrieved property data:', propertyData);
          setProperty(propertyData);
          // Initialize filtered payments
          if (propertyData.payments && propertyData.payments.length > 0) {
            console.log('Found payments:', propertyData.payments);
            setFilteredPayments(sortPayments(propertyData.payments, 'newest'));
          } else {
            console.log('No payments found in property data');
          }
          if (propertyData.postedByDetails?.uid) {
            console.log('Fetching landlord details with UID:', propertyData.postedByDetails.uid);
            const landlordDoc = await getDoc(
              doc(fireDataBase, 'users', propertyData.postedByDetails.uid)
            );
            console.log('Landlord document exists:', landlordDoc.exists());
            if (landlordDoc.exists()) {
              const landlordData = landlordDoc.data();
              console.log('Retrieved landlord data:', landlordData);
              setLandlordDetails(landlordData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        console.log('Finished loading property data');
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [user]);

  // Function to sort payments based on selected order
  const sortPayments = (payments: PAYMENT[], order: string) => {
    if (!payments) return [];

    const paymentsCopy = [...payments];

    switch (order) {
      case 'newest':
        return paymentsCopy.sort((a, b) => b.dueDate.seconds - a.dueDate.seconds);
      case 'oldest':
        return paymentsCopy.sort((a, b) => a.dueDate.seconds - b.dueDate.seconds);
      case 'amount-high':
        return paymentsCopy.sort((a, b) => b.amount - a.amount);
      case 'amount-low':
        return paymentsCopy.sort((a, b) => a.amount - b.amount);
      default:
        return paymentsCopy;
    }
  };

  // Update filtered payments when sort order changes
  useEffect(() => {
    if (property?.payments) {
      setFilteredPayments(sortPayments(property.payments, sortOrder));
    }
  }, [sortOrder, property?.payments]);

  // Format date from timestamp
  // Format date from timestamp
  const formatDate = (timestamp?: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return 'Not available';
    const formattedDate = new Date(timestamp.seconds * 1000).toLocaleDateString();
    return formattedDate;
  };

  // Convert payments to the format expected by RentStatusCard
  const convertToPaymentHistory = (payments: PAYMENT[]) => {
    return payments.map(payment => ({
      id: payment.id,
      date: formatDate(payment.dueDate),
      amount: payment.amount,
      status: payment.isSuccessful ? ('completed' as const) : ('failed' as const),
    }));
  };
  // Calculate remaining days between now and a target date
  const calculateRemainingDays = (targetDate: Timestamp | undefined) => {
    if (!targetDate) return 0;

    const now = new Date();
    const target = new Date(targetDate.seconds * 1000);

    // Reset hours to compare just dates
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="bg-gray-50 w-full min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm p-6 border-b">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-bold text-gray-900 text-2xl">
            Welcome, {user?.firstName || tenantName}
          </h1>
          <p className="mt-1 text-gray-600">{property?.address || propertyAddress}</p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white shadow-sm p-2 rounded-lg">
            <TabsList className="justify-start gap-2 grid grid-cols-4 w-full">
              <TabsTrigger value="rent" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Rent Status
              </TabsTrigger>
              <TabsTrigger value="request" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                New Request
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Request History
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Messages
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="rent" className="space-y-6 mt-6">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <RentStatusCard
                dueDate={loading ? undefined : property?.payments?.[0]?.dueDate}
                amount={loading ? 0 : property?.lease?.monthlyRent || rentInfo.amount}
                status={loading ? 'due' : property?.payments?.[0]?.isSuccessful ? 'paid' : 'due'}
                remainingDays={
                  loading ? 0 : calculateRemainingDays(property?.payments?.[0]?.dueDate)
                }
                percentagePaid={loading ? 0 : property?.payments?.[0]?.isSuccessful ? 100 : 0}
                enablePayment={!loading}
                paymentHistory={
                  loading
                    ? []
                    : property?.payments
                    ? convertToPaymentHistory(filteredPayments.slice(0, 3))
                    : undefined
                }
                isLoading={loading}
              />

              <Card className="bg-white shadow-md p-6">
                <h2 className="mb-4 font-bold text-xl">Property Information</h2>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="rounded-md w-full h-[200px]" />
                    <div className="space-y-2">
                      <Skeleton className="w-3/4 h-4" />
                      <Skeleton className="w-1/2 h-4" />
                      <Skeleton className="w-2/3 h-4" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="w-3/4 h-4" />
                      <Skeleton className="w-1/2 h-4" />
                      <Skeleton className="w-2/3 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {!loading && property && (
                      <PropertyDetailsCard property={property} isLoading={loading} />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-500 text-sm">Property Manager</h3>
                      <p className="mt-1">
                        {landlordDetails?.userName ||
                          property?.postedByDetails?.userName ||
                          'Jane Smith'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {landlordDetails?.email ||
                          property?.manager?.email ||
                          'jane.smith@property.com'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {landlordDetails?.phone || property?.manager?.phone || '(555) 123-4567'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 text-sm">Lease Information</h3>
                      <p className="mt-1">
                        Start Date: {formatDate(property?.lease?.startDate) || 'January 1, 2023'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        End Date: {formatDate(property?.lease?.endDate) || 'December 31, 2023'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Monthly Rent: ZMW {property?.lease?.monthlyRent || 1200}
                      </p>
                      <Button
                        variant="link"
                        className="mt-2 p-0 h-auto text-blue-600 text-sm"
                        onClick={() => setShowRatingDialog(true)}
                      >
                        Rate your landlord
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 text-sm">Emergency Contacts</h3>
                      <p className="mt-1">
                        Maintenance: {property?.emergency?.maintenance || '(555) 987-6543'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        After Hours: {property?.emergency?.afterHours || '(555) 789-0123'}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="request" className="mt-6">
            <MaintenanceRequestForm />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <RequestHistoryList />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <div className="h-[600px]">
              <MessageCenter />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Landlord Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Landlord</DialogTitle>
            <DialogDescription>Please rate your experience with your landlord.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <RatingStars rating={landlordRating} onRatingChange={setLandlordRating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with your landlord..."
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRatingDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log(
                  `Rated landlord ${landlordRating} stars with comment: ${ratingComment}`
                );
                setShowRatingDialog(false);
                setLandlordRating(0);
                setRatingComment('');
                alert('Thank you for your feedback! Your rating has been submitted.');
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

// Create a PropertyDetailsCard component
const PropertyDetailsCard = ({
  property,
  isLoading,
}: {
  property: PropertyData | null;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="w-full h-48" />
        <div className="space-y-3 p-4">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-full h-4" />
          <div className="flex gap-4 mt-3">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      </Card>
    );
  }

  if (!property) return null;

  return (
    <Card className="overflow-hidden">
      {property.image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={property.image}
            alt={property.title || 'Property'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{property.title || 'Your Property'}</h3>
        <p className="mt-1 text-gray-500 text-sm">{property.address}</p>

        <div className="flex gap-4 mt-3">
          {property.bedrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>
                {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
              </span>
            </div>
          )}
          {property.bathrooms !== undefined && (
            <div className="flex items-center gap-1">
              <span>🚿</span>
              <span>
                {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
              </span>
            </div>
          )}
          {property.area !== undefined && (
            <div className="flex items-center gap-1">
              <span>📏</span>
              <span>{property.area} m²</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TenantDashboard;
