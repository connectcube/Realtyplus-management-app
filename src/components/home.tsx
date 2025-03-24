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
    <div className="w-screen h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="bg-red-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">RealtyPlus</CardTitle>
          <CardDescription className="text-white/90">
            Connecting landlords, tenants, and contractors
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-slate-700 text-lg">
            A comprehensive solution for managing properties, maintenance
            requests, and payments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Button
              onClick={() => navigate("/tenant")}
              className="h-24 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Tenant Portal
            </Button>
            <Button
              onClick={() => navigate("/landlord")}
              className="h-24 text-lg bg-green-600 hover:bg-green-700"
            >
              Landlord Portal
            </Button>
            <Button
              onClick={() => navigate("/contractor")}
              className="h-24 text-lg bg-amber-600 hover:bg-amber-700"
            >
              Contractor Portal
            </Button>
          </div>

          <div className="mt-6 text-center text-slate-500">
            <p>Please select your user type to continue</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;
