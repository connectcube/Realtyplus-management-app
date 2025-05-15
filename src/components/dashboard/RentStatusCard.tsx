import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Building,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Timestamp } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

interface RentStatusCardProps {
  dueDate?: Timestamp;
  endDate?: Timestamp;
  amount?: number;
  status?: 'paid' | 'due' | 'overdue' | 'partially_paid';
  paymentHistory?: PaymentHistory[];
  remainingDays?: number;
  percentagePaid?: number;
  enablePayment?: boolean;
  isLoading?: boolean;
}

const RentStatusCard = ({
  dueDate,
  endDate,
  amount = 0,
  status = 'due',
  paymentHistory = [
    { id: '1', date: '2023-05-01', amount: 1200, status: 'completed' },
    { id: '2', date: '2023-04-01', amount: 1200, status: 'completed' },
    { id: '3', date: '2023-03-01', amount: 1200, status: 'completed' },
  ],
  remainingDays = 5,
  percentagePaid = 0,
  enablePayment = false,
  isLoading = true,
}: RentStatusCardProps) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState('airtel');
  const [mobileNumber, setMobileNumber] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>(
    'newest'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>(
    'all'
  );

  const getStatusColor = () => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'due':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partially_paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'due':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'partially_paid':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  // Format date function
  const formatDate = (date: string | Timestamp | undefined) => {
    if (!date) return 'N/A';

    try {
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } else if (date instanceof Timestamp || (date && 'seconds' in date)) {
        // Handle Timestamp object
        return new Date(date.seconds * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } else {
        // Handle other date-like objects
        return new Date(date as any).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
    }).format(amount);
  };

  // Filter and sort payments
  const getFilteredAndSortedPayments = () => {
    if (!paymentHistory) return [];

    // First filter by status
    let filtered = [...paymentHistory];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Then sort
    switch (sortOrder) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'amount-high':
        return filtered.sort((a, b) => b.amount - a.amount);
      case 'amount-low':
        return filtered.sort((a, b) => a.amount - b.amount);
      default:
        return filtered;
    }
  };

  const filteredPayments = getFilteredAndSortedPayments();

  return (
    <Card className="bg-white shadow-md w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-bold text-xl">Rent Status</CardTitle>
          {isLoading ? (
            <Skeleton className="rounded-full w-20 h-6" />
          ) : (
            <Badge className={getStatusColor()}>
              <span className="flex items-center gap-1">
                {getStatusIcon()}
                {status.replace('_', ' ').toUpperCase()}
              </span>
            </Badge>
          )}
        </div>
        <CardDescription className="text-gray-500">
          {isLoading ? (
            <Skeleton className="w-40 h-4" />
          ) : (
            `Next payment due on ${dueDate ? formatDate(dueDate) : 'N/A'}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-gray-500 text-sm">Amount Due</p>
            {isLoading ? (
              <Skeleton className="w-24 h-8" />
            ) : (
              <p className="font-bold text-2xl">{formatCurrency(amount)}</p>
            )}
          </div>
          <div className="space-y-1 text-right">
            <p className="text-gray-500 text-sm">Due In</p>
            {isLoading ? (
              <Skeleton className="ml-auto w-16 h-6" />
            ) : (
              <p className="font-semibold text-lg">
                {remainingDays > 0 ? `${remainingDays} days` : 'Overdue'}
              </p>
            )}
          </div>
        </div>

        {status === 'partially_paid' && !isLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span>{percentagePaid}%</span>
            </div>
            <Progress value={percentagePaid} className="h-2" />
          </div>
        )}

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full h-2" />
          </div>
        )}

        {/* Recent Payment History Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Recent Payment History</h3>
            {!isLoading && paymentHistory.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="px-2 h-8 text-blue-600"
                onClick={() => setShowPaymentHistory(!showPaymentHistory)}
              >
                {showPaymentHistory ? (
                  <span className="flex items-center gap-1">
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <ChevronDown className="w-4 h-4" />
                    View All
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Always visible recent payments */}
          <div className="space-y-2">
            {isLoading ? (
              <>
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                  >
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                ))}
              </>
            ) : (
              paymentHistory.slice(0, 3).map(payment => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{formatDate(payment.date)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{formatCurrency(payment.amount)}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {payment.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : payment.status === 'pending' ? (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Status:{' '}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Expanded Payment History Section */}
          {showPaymentHistory && !isLoading && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Payment History</h3>
                <div className="flex gap-2">
                  {/* Filter by Status */}
                  <Select
                    value={statusFilter}
                    onValueChange={(value: any) => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <div className="flex items-center gap-1">
                        <Filter className="w-3 h-3" />
                        <SelectValue placeholder="Filter" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort Order */}
                  <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <div className="flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3" />
                        <SelectValue placeholder="Sort" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="amount-high">Amount (High-Low)</SelectItem>
                      <SelectItem value="amount-low">Amount (Low-High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filtered and Sorted Payments List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredPayments.length === 0 ? (
                  <p className="py-4 text-gray-500 text-center">
                    No payments match your filter criteria
                  </p>
                ) : (
                  filteredPayments.slice(0, 10).map(payment => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium text-sm">{formatDate(payment.date)}</span>
                          <p className="text-gray-500 text-xs">ID: {payment.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{formatCurrency(payment.amount)}</span>
                        <Badge
                          className={
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}

                {filteredPayments.length > 10 && (
                  <p className="mt-2 text-gray-500 text-sm text-center">
                    Showing 10 of {filteredPayments.length} payments
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        {isLoading ? (
          <>
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="flex-1 h-10" />
          </>
        ) : (
          <>
            <Button
              className="flex-1 gap-2"
              onClick={() => enablePayment && setShowPaymentDialog(true)}
              disabled={!enablePayment || status === 'paid'}
            >
              <CreditCard className="w-4 h-4" />
              Pay Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => setShowPaymentHistory(!showPaymentHistory)}
            >
              <DollarSign className="w-4 h-4" />
              {showPaymentHistory ? 'Hide History' : 'Payment History'}
            </Button>
          </>
        )}
      </CardFooter>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pay Rent</DialogTitle>
            <DialogDescription>
              Make your rent payment using your preferred payment method
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 mb-4 p-3 rounded-md">
              <div className="gap-2 grid grid-cols-2 text-sm">
                <div>
                  <span className="text-gray-500">Amount Due:</span>
                  <p className="font-medium">{formatCurrency(amount)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Due Date:</span>
                  <p className="font-medium">{formatDate(dueDate)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">
                    <div className="flex items-center">
                      <Building className="mr-2 w-4 h-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center">
                      <Smartphone className="mr-2 w-4 h-4" />
                      Mobile Money
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'bank' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    placeholder="Enter bank name"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile-provider">Mobile Provider</Label>
                  <Select value={mobileProvider} onValueChange={setMobileProvider}>
                    <SelectTrigger id="mobile-provider">
                      <SelectValue placeholder="Select mobile provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airtel">Airtel Money</SelectItem>
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile-number">Mobile Number</Label>
                  <Input
                    id="mobile-number"
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert(
                  `Payment of ${formatCurrency(amount)} processed via ${
                    paymentMethod === 'bank'
                      ? `Bank Transfer (${bankName}, ${accountNumber})`
                      : `Mobile Money (${mobileProvider}, ${mobileNumber})`
                  }`
                );
                setShowPaymentDialog(false);
              }}
            >
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RentStatusCard;
