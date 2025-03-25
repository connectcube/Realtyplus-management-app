import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="bg-red-600 text-white rounded-t-lg">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            RealtyPlus
          </CardTitle>
          <CardDescription className="text-white/90 text-sm sm:text-base">
            Connecting landlords, tenants, and contractors
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <p className="text-slate-700 text-base sm:text-lg">
            A comprehensive solution for managing properties, maintenance
            requests, and payments.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <Button
              onClick={() => navigate("/tenant")}
              className="h-16 sm:h-24 text-base sm:text-lg bg-blue-600 hover:bg-blue-700"
            >
              Tenant Portal
            </Button>
            <Button
              onClick={() => navigate("/landlord")}
              className="h-16 sm:h-24 text-base sm:text-lg bg-green-600 hover:bg-green-700"
            >
              Landlord Portal
            </Button>
            <Button
              onClick={() => navigate("/contractor")}
              className="h-16 sm:h-24 text-base sm:text-lg bg-amber-600 hover:bg-amber-700"
            >
              Contractor Portal
            </Button>
          </div>

          <div className="mt-4 sm:mt-6 text-center text-slate-500">
            <p>Please select your user type to continue</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;
