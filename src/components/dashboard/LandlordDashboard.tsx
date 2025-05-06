import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  Home,
  MessageSquare,
  Settings,
  Wrench,
  User,
} from "lucide-react";
import PropertyOverview from "@/components/property/PropertyOverview";
import TenantManagement from "@/components/tenant/TenantManagement";
import MaintenanceRequestManager from "@/components/maintenance/MaintenanceRequestManager";
import RentTracker from "@/components/payment/RentTracker";
import MessageCenter from "@/components/communication/MessageCenter";
import { useStore } from "@/lib/zustand";

interface LandlordDashboardProps {
  landlordName?: string;
  propertyCount?: number;
  tenantCount?: number;
  maintenanceCount?: number;
  unreadMessages?: number;
}

const LandlordDashboard = ({
  landlordName = "John Doe",
  propertyCount = 6,
  tenantCount = 24,
  maintenanceCount = 5,
  unreadMessages = 3,
}: LandlordDashboardProps) => {
  const [activeTab, setActiveTab] = useState("properties");
  const { user } = useStore();
  return (
    <div className="flex flex-col bg-gray-50 h-full min-h-screen">
      {/* Header */}
      <header className="bg-red-600 shadow-md p-4 text-white">
        <div className="flex justify-between items-center mx-auto container">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Home className="w-5 sm:w-6 h-5 sm:h-6" />
            <h1 className="font-bold text-lg sm:text-xl">RealtyPlus</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 cursor-pointer" />
              {(maintenanceCount > 0 || unreadMessages > 0) && (
                <span className="-top-1 -right-1 absolute flex justify-center items-center bg-yellow-400 rounded-full w-4 h-4 font-bold text-black text-xs">
                  {maintenanceCount + unreadMessages}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex justify-center items-center bg-red-700 rounded-full w-8 h-8">
                <User className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline capitilize">
                {user.userName}
              </span>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 mx-auto p-4 md:p-6 container">
        {/* Summary Cards */}
        <div className="gap-3 sm:gap-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mb-4 sm:mb-6">
          <Card className="bg-white">
            <CardContent className="flex justify-between items-center p-3 sm:p-4">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Properties</p>
                <p className="font-bold text-lg sm:text-2xl">
                  {user.properties.length}
                </p>
              </div>
              <div className="flex justify-center items-center bg-blue-100 rounded-full w-8 sm:w-10 h-8 sm:h-10">
                <Home className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <p className="text-gray-500 text-sm">Tenants</p>
                <p className="font-bold text-2xl">{user.tenants.length}</p>
              </div>
              <div className="flex justify-center items-center bg-green-100 rounded-full w-10 h-10">
                <User className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <p className="text-gray-500 text-sm">Maintenance</p>
                <p className="font-bold text-2xl">{user.maintenance.length}</p>
              </div>
              <div className="flex justify-center items-center bg-yellow-100 rounded-full w-10 h-10">
                <Wrench className="w-5 h-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <p className="text-gray-500 text-sm">Messages</p>
                <p className="font-bold text-2xl">
                  {user.notifications.messages.length}
                </p>
              </div>
              <div className="flex justify-center items-center bg-purple-100 rounded-full w-10 h-10">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-white shadow rounded-lg h-fit"
        >
          <TabsList className="flex-nowrap justify-start p-0 border-b rounded-t-lg w-full overflow-x-auto">
            <TabsTrigger
              value="properties"
              className="flex-shrink-0 data-[state=active]:bg-white px-3 sm:px-6 py-2 sm:py-3 border-transparent data-[state=active]:border-red-600 border-b-2 rounded-none"
            >
              <Home className="mr-1 sm:mr-2 w-4 h-4" />
              <span className="text-xs sm:text-sm">Properties</span>
            </TabsTrigger>
            <TabsTrigger
              value="tenants"
              className="flex-shrink-0 data-[state=active]:bg-white px-3 sm:px-6 py-2 sm:py-3 border-transparent data-[state=active]:border-red-600 border-b-2 rounded-none"
            >
              <User className="mr-1 sm:mr-2 w-4 h-4" />
              <span className="text-xs sm:text-sm">Tenants</span>
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="flex-shrink-0 data-[state=active]:bg-white px-3 sm:px-6 py-2 sm:py-3 border-transparent data-[state=active]:border-red-600 border-b-2 rounded-none"
            >
              <Wrench className="mr-1 sm:mr-2 w-4 h-4" />
              <span className="text-xs sm:text-sm">Maintenance</span>
            </TabsTrigger>
            <TabsTrigger
              value="rent"
              className="flex-shrink-0 data-[state=active]:bg-white px-3 sm:px-6 py-2 sm:py-3 border-transparent data-[state=active]:border-red-600 border-b-2 rounded-none"
            >
              <span className="mr-1 sm:mr-2">$</span>
              <span className="text-xs sm:text-sm">Rent Tracking</span>
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex-shrink-0 data-[state=active]:bg-white px-3 sm:px-6 py-2 sm:py-3 border-transparent data-[state=active]:border-red-600 border-b-2 rounded-none"
            >
              <MessageSquare className="mr-1 sm:mr-2 w-4 h-4" />
              <span className="text-xs sm:text-sm">Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="m-0 p-0">
            <PropertyOverview />
          </TabsContent>

          <TabsContent value="tenants" className="m-0 p-0">
            <TenantManagement />
          </TabsContent>

          <TabsContent value="maintenance" className="m-0 p-0">
            <MaintenanceRequestManager />
          </TabsContent>

          <TabsContent value="rent" className="m-0 p-0">
            <RentTracker />
          </TabsContent>

          <TabsContent value="messages" className="m-0 p-0">
            <MessageCenter userType="landlord" />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 border-t text-gray-500 text-sm text-center">
        <p>© 2025 RealtyPlus. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandlordDashboard;
