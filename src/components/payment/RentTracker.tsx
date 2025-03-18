import React from "react";
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
} from "lucide-react";

interface RentPayment {
  id: string;
  propertyName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paymentDate?: string;
}

interface RentTrackerProps {
  payments?: RentPayment[];
  onSendReminder?: (paymentId: string) => void;
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
  onSendReminder = (paymentId) =>
    console.log(`Sending reminder for payment ${paymentId}`),
}: RentTrackerProps) => {
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h1 className="text-2xl font-bold mb-6">Rent Tracker</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rent</CardTitle>
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
                    <h3 className="font-semibold">{payment.propertyName}</h3>
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
    </div>
  );
};

export default RentTracker;
