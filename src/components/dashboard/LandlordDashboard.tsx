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

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Home className="h-6 w-6" />
            <h1 className="text-xl font-bold">RealtyPlus</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-5 w-5 cursor-pointer" />
              {(maintenanceCount > 0 || unreadMessages > 0) && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-black font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {maintenanceCount + unreadMessages}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-red-700 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <span>{landlordName}</span>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Properties</p>
                <p className="text-2xl font-bold">{propertyCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tenants</p>
                <p className="text-2xl font-bold">{tenantCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Maintenance</p>
                <p className="text-2xl font-bold">{maintenanceCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Messages</p>
                <p className="text-2xl font-bold">{unreadMessages}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-white rounded-lg shadow"
        >
          <TabsList className="w-full justify-start border-b p-0 rounded-t-lg">
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 px-6 py-3"
            >
              <Home className="h-4 w-4 mr-2" />
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="tenants"
              className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 px-6 py-3"
            >
              <User className="h-4 w-4 mr-2" />
              Tenants
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 px-6 py-3"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger
              value="rent"
              className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 px-6 py-3"
            >
              <span className="mr-2">$</span>
              Rent Tracking
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 px-6 py-3"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="p-0 m-0">
            <PropertyOverview />
          </TabsContent>

          <TabsContent value="tenants" className="p-0 m-0">
            <TenantManagement />
          </TabsContent>

          <TabsContent value="maintenance" className="p-0 m-0">
            <MaintenanceRequestManager />
          </TabsContent>

          <TabsContent value="rent" className="p-0 m-0">
            <RentTracker />
          </TabsContent>

          <TabsContent value="messages" className="p-0 m-0">
            <MessageCenter userType="landlord" />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t p-4 text-center text-sm text-gray-500">
        <p>© 2025 RealtyPlus. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandlordDashboard;
