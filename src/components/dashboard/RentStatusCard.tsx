import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

interface RentStatusCardProps {
  dueDate?: string;
  amount?: number;
  status?: "paid" | "due" | "overdue" | "partially_paid";
  paymentHistory?: PaymentHistory[];
  remainingDays?: number;
  percentagePaid?: number;
}

const RentStatusCard = ({
  dueDate = "2023-06-15",
  amount = 1200,
  status = "due",
  paymentHistory = [
    { id: "1", date: "2023-05-01", amount: 1200, status: "completed" },
    { id: "2", date: "2023-04-01", amount: 1200, status: "completed" },
    { id: "3", date: "2023-03-01", amount: 1200, status: "completed" },
  ],
  remainingDays = 5,
  percentagePaid = 0,
}: RentStatusCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "due":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "partially_paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "due":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "partially_paid":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
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
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Rent Status</CardTitle>
          <Badge className={getStatusColor()}>
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              {status.replace("_", " ").toUpperCase()}
            </span>
          </Badge>
        </div>
        <CardDescription className="text-gray-500">
          Next payment due on {formatDate(dueDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Amount Due</p>
            <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-gray-500">Due In</p>
            <p className="text-lg font-semibold">
              {remainingDays > 0 ? `${remainingDays} days` : "Overdue"}
            </p>
          </div>
        </div>

        {status === "partially_paid" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span>{percentagePaid}%</span>
            </div>
            <Progress value={percentagePaid} className="h-2" />
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Recent Payment History</h3>
          <div className="space-y-2">
            {paymentHistory.slice(0, 3).map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(payment.date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {formatCurrency(payment.amount)}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {payment.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : payment.status === "pending" ? (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Status:{" "}
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button className="flex-1 gap-2">
          <CreditCard className="h-4 w-4" />
          Pay Now
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <DollarSign className="h-4 w-4" />
          Payment History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RentStatusCard;
