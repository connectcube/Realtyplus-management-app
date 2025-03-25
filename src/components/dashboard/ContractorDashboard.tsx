import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import AssignedJobsList from "@/components/jobs/AssignedJobsList";
import BiddingOpportunities from "@/components/jobs/BiddingOpportunities";
import JobHistory from "@/components/jobs/JobHistory";
import MessageCenter from "@/components/communication/MessageCenter";
import {
  Bell,
  Briefcase,
  Calendar,
  Clock,
  MessageCircle,
  Settings,
  User,
  DollarSign,
  CreditCard,
  Building,
  Smartphone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Payment {
  id: string;
  jobTitle: string;
  amount: number;
  commission: number;
  netAmount: number;
  date: string;
  status: "pending" | "received";
  property: string;
  paymentMethod?: string;
}

interface ContractorDashboardProps {
  contractorName?: string;
  contractorAvatar?: string;
  notificationCount?: number;
  upcomingJobs?: number;
  completedJobs?: number;
  activeTab?: string;
  payments?: Payment[];
}

const ContractorDashboard = ({
  contractorName = "Mike Johnson",
  contractorAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  notificationCount = 3,
  upcomingJobs = 5,
  completedJobs = 42,
  activeTab = "assigned-jobs",
  payments = [
    {
      id: "p1",
      jobTitle: "Fix Leaking Bathroom Sink",
      amount: 350,
      commission: 12.25, // 3.5% of 350
      netAmount: 337.75,
      date: "2023-06-15",
      status: "pending",
      property: "Sunset Apartments, Unit 3B",
    },
    {
      id: "p2",
      jobTitle: "AC Repair and Maintenance",
      amount: 520,
      commission: 18.2, // 3.5% of 520
      netAmount: 501.8,
      date: "2023-06-14",
      status: "pending",
      property: "Oakwood Residences, Unit 12A",
    },
    {
      id: "p3",
      jobTitle: "Ceiling Light Fixture Replacement",
      amount: 275,
      commission: 9.63, // 3.5% of 275
      netAmount: 265.37,
      date: "2023-06-05",
      status: "received",
      property: "Sunset Apartments, Unit 7D",
      paymentMethod: "Bank Transfer",
    },
  ],
}: ContractorDashboardProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [mobileProvider, setMobileProvider] = useState("airtel");
  const [mobileNumber, setMobileNumber] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", {
      style: "currency",
      currency: "ZMW",
    }).format(amount);
  };

  const handleSetupPaymentMethod = () => {
    // In a real app, this would save the payment method to the database
    alert(
      `Payment method saved: ${
        paymentMethod === "bank"
          ? `Bank Transfer (${bankName}, ${accountNumber})`
          : `Mobile Money (${mobileProvider}, ${mobileNumber})`
      }`,
    );
    setIsPaymentDetailsOpen(false);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">RealtyPlus</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-6 w-6 cursor-pointer" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-black">
                  {notificationCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={contractorAvatar} alt={contractorName} />
                <AvatarFallback>{contractorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium hidden md:inline">
                {contractorName}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 p-4 md:p-6 flex flex-col">
        {/* Dashboard Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Contractor Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center gap-4 bg-white">
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Jobs</p>
                <p className="text-2xl font-bold">{upcomingJobs}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4 bg-white">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Jobs</p>
                <p className="text-2xl font-bold">{completedJobs}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4 bg-white">
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold">$2,450</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="mb-6 bg-white p-1 border rounded-lg">
              <TabsTrigger
                value="assigned-jobs"
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                <span>Assigned Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="bidding" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Bidding Opportunities</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Job History</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Messages</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Payments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assigned-jobs" className="mt-0">
              <AssignedJobsList />
            </TabsContent>

            <TabsContent value="bidding" className="mt-0">
              <BiddingOpportunities />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <JobHistory />
            </TabsContent>

            <TabsContent value="messages" className="mt-0">
              <MessageCenter userType="contractor" />
            </TabsContent>

            <TabsContent value="payments" className="mt-0">
              <Card className="p-6 bg-white">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Payment Management</CardTitle>
                  <CardDescription>
                    View and manage your payments from landlords
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Pending Payments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-amber-500">
                          {formatCurrency(
                            payments
                              .filter((p) => p.status === "pending")
                              .reduce((sum, p) => sum + p.amount, 0),
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Received This Month
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                          {formatCurrency(
                            payments
                              .filter((p) => p.status === "received")
                              .reduce((sum, p) => sum + p.netAmount, 0),
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Commission Paid
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                          {formatCurrency(
                            payments.reduce((sum, p) => sum + p.commission, 0),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Payment History</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPaymentDetailsOpen(true)}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Setup Payment Methods
                      </Button>
                    </div>

                    {payments.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {payment.jobTitle}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>
                                Gross: {formatCurrency(payment.amount)}
                              </span>
                              <span className="mx-2">•</span>
                              <span>
                                Net: {formatCurrency(payment.netAmount)}
                              </span>
                              <span className="mx-2">•</span>
                              <span>
                                Commission: {formatCurrency(payment.commission)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Date: {payment.date}</span>
                              <span className="mx-2">•</span>
                              <span>Property: {payment.property}</span>
                            </div>
                          </div>
                          <div>
                            {payment.status === "pending" ? (
                              <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-800"
                              >
                                Pending
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                Received
                              </Badge>
                            )}
                          </div>
                        </div>

                        {payment.status === "received" &&
                          payment.paymentMethod && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Received via:</span>{" "}
                              {payment.paymentMethod}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="px-0 pt-4 flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Export Statement
                  </Button>
                  <Button>View All Transactions</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <Card className="p-6 bg-white">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={contractorAvatar}
                        alt={contractorName}
                      />
                      <AvatarFallback className="text-2xl">
                        {contractorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="mt-4">
                      Change Photo
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{contractorName}</h3>
                      <p className="text-gray-500">Contractor</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p>mike.johnson@example.com</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p>(555) 123-4567</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Specialties
                        </p>
                        <p>Plumbing, Electrical, HVAC</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Member Since
                        </p>
                        <p>January 2022</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="text-lg font-medium mb-2">Settings</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Account Settings
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Bell className="h-4 w-4" />
                          Notification Preferences
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Payment Methods Dialog */}
      <Dialog
        open={isPaymentDetailsOpen}
        onOpenChange={setIsPaymentDetailsOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Setup Payment Methods</DialogTitle>
            <DialogDescription>
              Add your preferred payment methods to receive payments from
              landlords
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Preferred Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile Money
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "bank" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    placeholder="Enter bank name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile-provider">Mobile Provider</Label>
                  <Select
                    value={mobileProvider}
                    onValueChange={setMobileProvider}
                  >
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
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="font-medium mb-2">
                Note about RealtyPlus Commission:
              </p>
              <p className="text-gray-600">
                RealtyPlus charges a 3.5% commission on all payments received.
                This commission is automatically deducted from your payment.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDetailsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSetupPaymentMethod}>
              Save Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractorDashboard;
