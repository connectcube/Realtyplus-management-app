import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  CreditCard,
  Building,
  Smartphone,
  User,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RentPayment {
  id: string;
  propertyName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paymentDate?: string;
}

interface Contractor {
  id: string;
  name: string;
  jobTitle: string;
  amount: number;
  status: "pending" | "paid";
  date: string;
  property: string;
}

interface RentTrackerProps {
  payments?: RentPayment[];
  contractors?: Contractor[];
  onSendReminder?: (paymentId: string) => void;
  onPayContractor?: (
    contractorId: string,
    method: string,
    details: any,
  ) => void;
}

const RentTracker = ({
  payments = [
    {
      id: "1",
      propertyName: "Sunset Apartments, Unit 101",
      amount: 1200,
      dueDate: "2023-05-01",
      status: "paid",
      paymentDate: "2023-04-28",
    },
    {
      id: "2",
      propertyName: "Oakwood Residences, Unit 205",
      amount: 950,
      dueDate: "2023-05-01",
      status: "pending",
    },
    {
      id: "3",
      propertyName: "Riverside Condos, Unit 310",
      amount: 1500,
      dueDate: "2023-04-15",
      status: "overdue",
    },
    {
      id: "4",
      propertyName: "Pine Street Homes, Unit 4B",
      amount: 1100,
      dueDate: "2023-05-01",
      status: "pending",
    },
  ],
  contractors = [
    {
      id: "c1",
      name: "Quick Fix Maintenance",
      jobTitle: "Fix Leaking Bathroom Sink",
      amount: 350,
      status: "pending",
      date: "2023-06-15",
      property: "Sunset Apartments, Unit 3B",
    },
    {
      id: "c2",
      name: "Cool Air Services",
      jobTitle: "AC Repair and Maintenance",
      amount: 520,
      status: "pending",
      date: "2023-06-14",
      property: "Oakwood Residences, Unit 12A",
    },
    {
      id: "c3",
      name: "Bright Electric Co.",
      jobTitle: "Ceiling Light Fixture Replacement",
      amount: 275,
      status: "paid",
      date: "2023-06-05",
      property: "Sunset Apartments, Unit 7D",
    },
  ],
  onSendReminder = (paymentId) =>
    console.log(`Sending reminder for payment ${paymentId}`),
  onPayContractor = (contractorId, method, details) =>
    console.log(`Paying contractor ${contractorId} via ${method}`, details),
}: RentTrackerProps) => {
  const [selectedContractor, setSelectedContractor] =
    useState<Contractor | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [mobileProvider, setMobileProvider] = useState("airtel");
  const [mobileNumber, setMobileNumber] = useState("");
  const [activeTab, setActiveTab] = useState("rent");
  // Calculate summary statistics
  const totalRent = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidRent = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingRent = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const overdueRent = payments
    .filter((payment) => payment.status === "overdue")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const collectionRate =
    totalRent > 0 ? Math.round((paidRent / totalRent) * 100) : 0;

  const getStatusBadge = (status: RentPayment["status"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-500">
            Paid
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", {
      style: "currency",
      currency: "ZMW",
    }).format(amount);
  };

  const handlePayContractor = () => {
    if (!selectedContractor) return;

    // Calculate commission (3.5%)
    const commission = selectedContractor.amount * 0.035;
    const totalAmount = selectedContractor.amount + commission;

    const paymentDetails = {
      contractorId: selectedContractor.id,
      contractorName: selectedContractor.name,
      jobTitle: selectedContractor.jobTitle,
      originalAmount: selectedContractor.amount,
      commission: commission,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      details:
        paymentMethod === "bank"
          ? { bankName, accountNumber }
          : { provider: mobileProvider, mobileNumber },
    };

    onPayContractor(selectedContractor.id, paymentMethod, paymentDetails);
    setIsPaymentDialogOpen(false);

    // In a real app, you would update the contractor status in the database
    alert(
      `Payment of ${formatCurrency(totalAmount)} (including ${formatCurrency(commission)} commission) sent to ${selectedContractor.name}`,
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="rent" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Rent Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="contractors" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Contractor Payments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rent">
          <h1 className="text-2xl font-bold mb-6">Rent Tracker</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Rent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRent)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Collected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {formatCurrency(paidRent)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">
                  {formatCurrency(pendingRent)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {formatCurrency(overdueRent)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Collection Progress */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Collection Progress</CardTitle>
              <CardDescription>
                Current rent collection rate: {collectionRate}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={collectionRate} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment List */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Overview of all tenant payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {payment.propertyName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{formatCurrency(payment.amount)}</span>
                        </div>
                      </div>
                      <div>{getStatusBadge(payment.status)}</div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        <span>
                          {payment.status === "paid" ? (
                            <span>
                              Paid on {formatDate(payment.paymentDate || "")}
                            </span>
                          ) : (
                            <span>Due {formatDate(payment.dueDate)}</span>
                          )}
                        </span>
                      </div>

                      {payment.status !== "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSendReminder(payment.id)}
                          className="flex items-center"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">
                Export Report
              </Button>
              <Button>View All Payments</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contractors">
          <h1 className="text-2xl font-bold mb-6">Contractor Payments</h1>

          {/* Contractor Payment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    contractors
                      .filter((c) => c.status === "pending")
                      .reduce((sum, c) => sum + c.amount, 0),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">
                  {contractors.filter((c) => c.status === "pending").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Paid This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {formatCurrency(
                    contractors
                      .filter((c) => c.status === "paid")
                      .reduce((sum, c) => sum + c.amount, 0),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contractor Payment List */}
          <Card>
            <CardHeader>
              <CardTitle>Contractor Payments</CardTitle>
              <CardDescription>
                Manage payments to contractors for completed work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractors.map((contractor) => (
                  <div key={contractor.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{contractor.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{formatCurrency(contractor.amount)}</span>
                          <span className="mx-2">•</span>
                          <span>Job: {contractor.jobTitle}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Date: {contractor.date}</span>
                          <span className="mx-2">•</span>
                          <span>Property: {contractor.property}</span>
                        </div>
                      </div>
                      <div>
                        {contractor.status === "pending" ? (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Pending Payment
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Paid
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm">
                        <span className="font-medium">Payment Details:</span>
                        <div className="text-gray-600 mt-1">
                          <div>Amount: {formatCurrency(contractor.amount)}</div>
                          <div>
                            RealtyPlus Commission (3.5%):{" "}
                            {formatCurrency(contractor.amount * 0.035)}
                          </div>
                          <div className="font-medium">
                            Total: {formatCurrency(contractor.amount * 1.035)}
                          </div>
                        </div>
                      </div>

                      {contractor.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedContractor(contractor);
                            setIsPaymentDialogOpen(true);
                          }}
                          className="flex items-center"
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">
                Export Report
              </Button>
              <Button>View All Contractors</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pay Contractor</DialogTitle>
            <DialogDescription>
              {selectedContractor && (
                <>
                  Pay {selectedContractor.name} for{" "}
                  {selectedContractor.jobTitle}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedContractor && (
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Contractor:</span>
                    <p className="font-medium">{selectedContractor.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Job:</span>
                    <p className="font-medium">{selectedContractor.jobTitle}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <p className="font-medium">
                      {formatCurrency(selectedContractor.amount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Commission (3.5%):</span>
                    <p className="font-medium">
                      {formatCurrency(selectedContractor.amount * 0.035)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Total Amount:</span>
                    <p className="font-medium text-lg">
                      {formatCurrency(selectedContractor.amount * 1.035)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
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
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePayContractor}>Process Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RentTracker;
