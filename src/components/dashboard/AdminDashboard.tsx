import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Building,
  Home,
  Users,
  Wrench,
  CreditCard,
  MessageSquare,
  Settings,
  Shield,
  UserX,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
  History,
  Search,
  Filter,
  Trash2,
  Ban,
  Clock,
  Info,
  Bell,
  Lock,
  Unlock,
  UserPlus,
  UserCog,
  ShieldCheck,
  KeyRound,
  UserCheck,
} from "lucide-react";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [userFilter, setUserFilter] = useState("all");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState("admin");
  const [adminPermissions, setAdminPermissions] = useState<
    Record<string, boolean>
  >({
    viewUsers: true,
    manageUsers: false,
    viewProperties: true,
    manageProperties: false,
    viewMaintenance: true,
    manageMaintenance: false,
    viewPayments: true,
    managePayments: false,
    viewReports: true,
    manageReports: false,
    viewTrustSafety: true,
    manageTrustSafety: false,
    viewAuditLog: false,
    manageAdmins: false,
  });
  const [adminFilter, setAdminFilter] = useState("all");

  // Mock admin users data
  const mockAdmins = [
    {
      id: 1,
      name: "Jane Doe",
      email: "jane.doe@realtyplus.com",
      role: "super_admin",
      status: "active",
      lastActive: "2023-10-28",
      permissions: {
        viewUsers: true,
        manageUsers: true,
        viewProperties: true,
        manageProperties: true,
        viewMaintenance: true,
        manageMaintenance: true,
        viewPayments: true,
        managePayments: true,
        viewReports: true,
        manageReports: true,
        viewTrustSafety: true,
        manageTrustSafety: true,
        viewAuditLog: true,
        manageAdmins: true,
      },
    },
    {
      id: 2,
      name: "Mike Smith",
      email: "mike.smith@realtyplus.com",
      role: "admin",
      status: "active",
      lastActive: "2023-10-27",
      permissions: {
        viewUsers: true,
        manageUsers: true,
        viewProperties: true,
        manageProperties: true,
        viewMaintenance: true,
        manageMaintenance: true,
        viewPayments: true,
        managePayments: false,
        viewReports: true,
        manageReports: false,
        viewTrustSafety: false,
        manageTrustSafety: false,
        viewAuditLog: false,
        manageAdmins: false,
      },
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex.j@realtyplus.com",
      role: "support_admin",
      status: "active",
      lastActive: "2023-10-26",
      permissions: {
        viewUsers: true,
        manageUsers: false,
        viewProperties: true,
        manageProperties: false,
        viewMaintenance: true,
        manageMaintenance: true,
        viewPayments: false,
        managePayments: false,
        viewReports: true,
        manageReports: false,
        viewTrustSafety: false,
        manageTrustSafety: false,
        viewAuditLog: false,
        manageAdmins: false,
      },
    },
  ];

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Properties",
      value: "156",
      icon: <Building className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Active Tenants",
      value: "432",
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Landlords",
      value: "87",
      icon: <Home className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Contractors",
      value: "43",
      icon: <Wrench className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Open Maintenance",
      value: "28",
      icon: <Wrench className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Monthly Revenue",
      value: "$48,250",
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Refunds Processed",
      value: "12",
      icon: <RefreshCcw className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Trust Score",
      value: "4.8/5",
      icon: <Shield className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "New Tenant",
      description: "Sarah Johnson registered as a tenant",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "Maintenance",
      description: "Plumbing request #1242 marked as complete",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "Payment",
      description: "Rent payment received from Unit 303",
      time: "5 hours ago",
    },
    {
      id: 4,
      type: "New Property",
      description: "Sunset Apartments added by landlord Mark Davis",
      time: "Yesterday",
    },
    {
      id: 5,
      type: "Support",
      description: "New support ticket #458 opened",
      time: "Yesterday",
    },
    {
      id: 6,
      type: "Refund",
      description: "$250 refund processed for tenant Emily Chen",
      time: "Yesterday",
    },
    {
      id: 7,
      type: "Account Action",
      description: "Contractor account for John Smith suspended",
      time: "2 days ago",
    },
  ];

  // Mock user data
  const mockUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      type: "tenant",
      status: "active",
      joinDate: "2023-05-15",
      lastActive: "2023-10-28",
      propertyId: "APT-303",
      paymentHistory: [
        { id: 1, amount: 1200, date: "2023-10-01", status: "completed" },
        { id: 2, amount: 1200, date: "2023-09-01", status: "completed" },
      ],
    },
    {
      id: 2,
      name: "Mark Davis",
      email: "mark.d@example.com",
      type: "landlord",
      status: "active",
      joinDate: "2022-11-10",
      lastActive: "2023-10-27",
      properties: ["Sunset Apartments", "Oakwood Heights"],
      tenants: 12,
    },
    {
      id: 3,
      name: "John Smith",
      email: "john.s@example.com",
      type: "contractor",
      status: "suspended",
      joinDate: "2023-01-22",
      lastActive: "2023-10-20",
      specialties: ["Plumbing", "Electrical"],
      completedJobs: 28,
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.c@example.com",
      type: "tenant",
      status: "active",
      joinDate: "2023-03-05",
      lastActive: "2023-10-28",
      propertyId: "APT-105",
      paymentHistory: [
        { id: 3, amount: 950, date: "2023-10-01", status: "completed" },
        { id: 4, amount: 950, date: "2023-09-01", status: "completed" },
        { id: 5, amount: 250, date: "2023-08-15", status: "refunded" },
      ],
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert.w@example.com",
      type: "landlord",
      status: "active",
      joinDate: "2022-08-17",
      lastActive: "2023-10-26",
      properties: ["Riverfront Condos"],
      tenants: 8,
    },
  ];

  // Mock audit log data
  const auditLogs = [
    {
      id: 1,
      action: "User Account Deleted",
      performedBy: "Admin (Jane Doe)",
      affectedUser: "Thomas Brown (Contractor)",
      timestamp: "2023-10-27 14:32:15",
      reason: "Multiple complaints from tenants",
      ipAddress: "192.168.1.45",
    },
    {
      id: 2,
      action: "Refund Processed",
      performedBy: "Admin (Jane Doe)",
      affectedUser: "Emily Chen (Tenant)",
      timestamp: "2023-10-26 11:15:22",
      details: "$250 refund for maintenance delay",
      ipAddress: "192.168.1.45",
    },
    {
      id: 3,
      action: "User Status Changed",
      performedBy: "Admin (Mike Smith)",
      affectedUser: "John Smith (Contractor)",
      timestamp: "2023-10-25 09:45:10",
      details: "Status changed from active to suspended",
      reason: "Failed to complete assigned jobs",
      ipAddress: "192.168.1.50",
    },
    {
      id: 4,
      action: "Payment Dispute Resolved",
      performedBy: "Admin (Jane Doe)",
      affectedUser: "Sarah Johnson (Tenant)",
      timestamp: "2023-10-24 16:20:35",
      details: "Dispute resolved in favor of tenant",
      ipAddress: "192.168.1.45",
    },
    {
      id: 5,
      action: "Privacy Settings Updated",
      performedBy: "Admin (Mike Smith)",
      details: "Updated platform-wide privacy settings",
      timestamp: "2023-10-23 13:10:05",
      ipAddress: "192.168.1.50",
    },
  ];

  // Function to handle user deletion
  const handleDeleteUser = (user: any) => {
    console.log(`Deleting user: ${user.name} (${user.type})`);
    // In a real implementation, this would call an API to delete the user
    // and then update the UI accordingly
  };

  // Function to handle refund processing
  const handleProcessRefund = () => {
    if (!selectedUser || !refundAmount || !refundReason) return;

    console.log(
      `Processing refund of ${refundAmount} for ${selectedUser.name}`,
    );
    console.log(`Reason: ${refundReason}`);
    // In a real implementation, this would call an API to process the refund
    // and then update the UI accordingly

    // Reset form
    setRefundAmount("");
    setRefundReason("");
    setSelectedUser(null);
  };

  // Function to handle admin creation
  const handleCreateAdmin = () => {
    if (!adminName || !adminEmail || !adminPassword) return;

    console.log(`Creating new admin: ${adminName} (${adminEmail})`);
    console.log(`Role: ${adminRole}`);
    console.log(`Permissions:`, adminPermissions);
    // In a real implementation, this would call an API to create the admin
    // and then update the UI accordingly

    // Reset form
    setAdminName("");
    setAdminEmail("");
    setAdminPassword("");
    setAdminRole("admin");
    setAdminPermissions({
      viewUsers: true,
      manageUsers: false,
      viewProperties: true,
      manageProperties: false,
      viewMaintenance: true,
      manageMaintenance: false,
      viewPayments: true,
      managePayments: false,
      viewReports: true,
      manageReports: false,
      viewTrustSafety: true,
      manageTrustSafety: false,
      viewAuditLog: false,
      manageAdmins: false,
    });
  };

  // Function to handle admin deletion
  const handleDeleteAdmin = (admin: any) => {
    console.log(`Deleting admin: ${admin.name} (${admin.email})`);
    // In a real implementation, this would call an API to delete the admin
    // and then update the UI accordingly
  };

  // Function to toggle a permission
  const togglePermission = (permission: string) => {
    setAdminPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-600" />
          <h1 className="text-lg font-semibold">RealtyPlus Admin</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Support
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Platform Overview</h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select defaultValue="today">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="trust">Trust & Safety</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="admins">Admin Management</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>
                  Recent activity across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 rounded-lg border p-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                        {activity.type === "New Tenant" && (
                          <Users className="h-5 w-5" />
                        )}
                        {activity.type === "Maintenance" && (
                          <Wrench className="h-5 w-5" />
                        )}
                        {activity.type === "Payment" && (
                          <CreditCard className="h-5 w-5" />
                        )}
                        {activity.type === "New Property" && (
                          <Building className="h-5 w-5" />
                        )}
                        {activity.type === "Support" && (
                          <MessageSquare className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{activity.type}</h3>
                          <span className="text-xs text-muted-foreground">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex h-full items-center justify-center">
                    <BarChart className="h-16 w-16 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Revenue chart visualization
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Platform performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Server Uptime</span>
                      <span className="text-sm text-green-600">99.98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        API Response Time
                      </span>
                      <span className="text-sm text-green-600">124ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Load</span>
                      <span className="text-sm text-green-600">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage Usage</span>
                      <span className="text-sm text-yellow-600">72%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Active Sessions
                      </span>
                      <span className="text-sm">187</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>
                  Manage all properties in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Property management interface would be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage all users in the system
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="w-64 pl-8"
                    />
                  </div>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="tenant">Tenants</SelectItem>
                      <SelectItem value="landlord">Landlords</SelectItem>
                      <SelectItem value="contractor">Contractors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-start justify-between gap-4 rounded-lg border p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                          {user.type === "tenant" && (
                            <Users className="h-5 w-5" />
                          )}
                          {user.type === "landlord" && (
                            <Home className="h-5 w-5" />
                          )}
                          {user.type === "contractor" && (
                            <Wrench className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {user.type.charAt(0).toUpperCase() +
                                user.type.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Joined: {user.joinDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about {user.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Name</Label>
                                  <p className="font-medium">{user.name}</p>
                                </div>
                                <div>
                                  <Label className="text-xs">Email</Label>
                                  <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                  <Label className="text-xs">User Type</Label>
                                  <p className="font-medium">
                                    {user.type.charAt(0).toUpperCase() +
                                      user.type.slice(1)}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs">Status</Label>
                                  <p className="font-medium">{user.status}</p>
                                </div>
                                <div>
                                  <Label className="text-xs">Join Date</Label>
                                  <p className="font-medium">{user.joinDate}</p>
                                </div>
                                <div>
                                  <Label className="text-xs">Last Active</Label>
                                  <p className="font-medium">
                                    {user.lastActive}
                                  </p>
                                </div>
                              </div>

                              {user.type === "tenant" && (
                                <div>
                                  <Label className="text-xs">Property ID</Label>
                                  <p className="font-medium">
                                    {user.propertyId}
                                  </p>

                                  <Label className="mt-4 text-xs">
                                    Payment History
                                  </Label>
                                  <div className="mt-2 space-y-2">
                                    {user.paymentHistory.map((payment) => (
                                      <div
                                        key={payment.id}
                                        className="flex items-center justify-between rounded border p-2 text-sm"
                                      >
                                        <span>{payment.date}</span>
                                        <span>${payment.amount}</span>
                                        <Badge
                                          variant={
                                            payment.status === "refunded"
                                              ? "outline"
                                              : "default"
                                          }
                                          className="text-xs"
                                        >
                                          {payment.status}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {user.type === "landlord" && (
                                <div>
                                  <Label className="text-xs">Properties</Label>
                                  <div className="mt-2 space-y-1">
                                    {user.properties.map((property, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="mr-1"
                                      >
                                        {property}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="mt-4">
                                    <Label className="text-xs">
                                      Total Tenants
                                    </Label>
                                    <p className="font-medium">
                                      {user.tenants}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {user.type === "contractor" && (
                                <div>
                                  <Label className="text-xs">Specialties</Label>
                                  <div className="mt-2 space-y-1">
                                    {user.specialties.map(
                                      (specialty, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="mr-1"
                                        >
                                          {specialty}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                  <div className="mt-4">
                                    <Label className="text-xs">
                                      Completed Jobs
                                    </Label>
                                    <p className="font-medium">
                                      {user.completedJobs}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              {user.type === "tenant" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline">
                                      <RefreshCcw className="mr-2 h-4 w-4" />
                                      Process Refund
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Process Refund</DialogTitle>
                                      <DialogDescription>
                                        Issue a refund to {user.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div>
                                        <Label htmlFor="refund-amount">
                                          Refund Amount ($)
                                        </Label>
                                        <Input
                                          id="refund-amount"
                                          type="number"
                                          value={refundAmount}
                                          onChange={(e) =>
                                            setRefundAmount(e.target.value)
                                          }
                                          placeholder="0.00"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="refund-reason">
                                          Reason for Refund
                                        </Label>
                                        <Textarea
                                          id="refund-reason"
                                          value={refundReason}
                                          onChange={(e) =>
                                            setRefundReason(e.target.value)
                                          }
                                          placeholder="Explain why this refund is being processed"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={handleProcessRefund}
                                        disabled={
                                          !refundAmount || !refundReason
                                        }
                                      >
                                        Process Refund
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive">
                                    <UserX className="mr-2 h-4 w-4" />
                                    Delete Account
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete User Account
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete{" "}
                                      {user.name}'s account? This action cannot
                                      be undone and all associated data will be
                                      permanently removed.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete User Account
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.name}'s
                                account? This action cannot be undone and all
                                associated data will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Overview</CardTitle>
                <CardDescription>
                  Monitor all maintenance requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Maintenance management interface would be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Processing</CardTitle>
                <CardDescription>
                  Monitor all financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Recent Transactions
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 gap-4 border-b bg-slate-50 p-4 font-medium">
                      <div>Transaction ID</div>
                      <div>User</div>
                      <div>Type</div>
                      <div>Amount</div>
                      <div>Date</div>
                      <div>Actions</div>
                    </div>

                    <div className="divide-y">
                      <div className="grid grid-cols-6 gap-4 p-4">
                        <div className="text-sm font-medium">TRX-38291</div>
                        <div className="text-sm">Sarah Johnson</div>
                        <div>
                          <Badge>Rent Payment</Badge>
                        </div>
                        <div className="text-sm">$1,200.00</div>
                        <div className="text-sm text-muted-foreground">
                          Oct 1, 2023
                        </div>
                        <div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Refund
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Process Refund</DialogTitle>
                                <DialogDescription>
                                  Issue a refund for transaction TRX-38291
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Transaction ID</Label>
                                    <p className="font-medium">TRX-38291</p>
                                  </div>
                                  <div>
                                    <Label>Original Amount</Label>
                                    <p className="font-medium">$1,200.00</p>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="refund-amount">
                                    Refund Amount ($)
                                  </Label>
                                  <Input
                                    id="refund-amount"
                                    type="number"
                                    placeholder="0.00"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="refund-reason">
                                    Reason for Refund
                                  </Label>
                                  <Textarea
                                    id="refund-reason"
                                    placeholder="Explain why this refund is being processed"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button>Process Refund</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-4 p-4">
                        <div className="text-sm font-medium">TRX-38290</div>
                        <div className="text-sm">Emily Chen</div>
                        <div>
                          <Badge>Rent Payment</Badge>
                        </div>
                        <div className="text-sm">$950.00</div>
                        <div className="text-sm text-muted-foreground">
                          Oct 1, 2023
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refund
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-4 p-4">
                        <div className="text-sm font-medium">TRX-38289</div>
                        <div className="text-sm">Emily Chen</div>
                        <div>
                          <Badge variant="outline">Refund</Badge>
                        </div>
                        <div className="text-sm text-red-500">-$250.00</div>
                        <div className="text-sm text-muted-foreground">
                          Aug 15, 2023
                        </div>
                        <div>
                          <Button variant="outline" size="sm" disabled>
                            <Info className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
                <CardDescription>
                  Generate and view system reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Reporting interface would be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trust" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Trust & Safety Controls</CardTitle>
                  <CardDescription>
                    Manage platform safety settings and policies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-y-2">
                      <div>
                        <h4 className="font-medium">ID Verification</h4>
                        <p className="text-sm text-muted-foreground">
                          Require ID verification for new users
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-y-2">
                      <div>
                        <h4 className="font-medium">Background Checks</h4>
                        <p className="text-sm text-muted-foreground">
                          Require background checks for contractors
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-y-2">
                      <div>
                        <h4 className="font-medium">Payment Protection</h4>
                        <p className="text-sm text-muted-foreground">
                          Hold payments in escrow until service completion
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-y-2">
                      <div>
                        <h4 className="font-medium">Dispute Resolution</h4>
                        <p className="text-sm text-muted-foreground">
                          Enable automated dispute resolution system
                        </p>
                      </div>
                      <Switch checked={false} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-y-2">
                      <div>
                        <h4 className="font-medium">Content Moderation</h4>
                        <p className="text-sm text-muted-foreground">
                          Auto-flag inappropriate content in messages
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Update Safety Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flagged Content</CardTitle>
                  <CardDescription>
                    Review and moderate flagged content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <h4 className="font-medium">Inappropriate Message</h4>
                        </div>
                        <Badge variant="outline">Pending Review</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Message from John Smith to Sarah Johnson flagged for
                        potential harassment
                      </p>
                      <div className="mt-4 flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Ban className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <h4 className="font-medium">Property Listing</h4>
                        </div>
                        <Badge variant="outline">Pending Review</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Property listing by Mark Davis flagged for potential
                        misleading information
                      </p>
                      <div className="mt-4 flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Ban className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Flagged Content
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Trust Metrics</CardTitle>
                  <CardDescription>
                    Platform trust and safety performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">User Satisfaction</h4>
                        <Badge className="bg-green-600">94%</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Based on post-interaction surveys
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Dispute Resolution</h4>
                        <Badge className="bg-amber-500">87%</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Percentage of disputes resolved amicably
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Content Moderation</h4>
                        <Badge className="bg-green-600">99.2%</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Accuracy of content moderation system
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Verification Rate</h4>
                        <Badge className="bg-green-600">96%</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Users with verified identities
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Response Time</h4>
                        <Badge className="bg-green-600">1.2h</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Average time to respond to safety reports
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Fraud Prevention</h4>
                        <Badge className="bg-green-600">99.7%</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Success rate in preventing fraudulent activity
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Audit Log</CardTitle>
                  <CardDescription>
                    Complete record of all administrative actions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export Log
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 rounded-lg border p-4"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                          {log.action.includes("Deleted") && (
                            <Trash2 className="h-5 w-5 text-red-500" />
                          )}
                          {log.action.includes("Refund") && (
                            <RefreshCcw className="h-5 w-5 text-blue-500" />
                          )}
                          {log.action.includes("Status") && (
                            <UserX className="h-5 w-5 text-amber-500" />
                          )}
                          {log.action.includes("Dispute") && (
                            <MessageSquare className="h-5 w-5 text-green-500" />
                          )}
                          {log.action.includes("Privacy") && (
                            <Lock className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{log.action}</h3>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {log.timestamp}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Performed by: {log.performedBy}
                          </p>
                          {log.affectedUser && (
                            <p className="text-sm text-muted-foreground">
                              Affected user: {log.affectedUser}
                            </p>
                          )}
                          {log.details && (
                            <p className="text-sm text-muted-foreground">
                              Details: {log.details}
                            </p>
                          )}
                          {log.reason && (
                            <p className="text-sm text-muted-foreground">
                              Reason: {log.reason}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              IP: {log.ipAddress}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Accounts</CardTitle>
                  <CardDescription>
                    Manage administrator accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search admins..."
                        className="w-64 pl-8"
                      />
                    </div>
                    <Select value={adminFilter} onValueChange={setAdminFilter}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Admins</SelectItem>
                        <SelectItem value="super_admin">
                          Super Admins
                        </SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                        <SelectItem value="support_admin">
                          Support Admins
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {mockAdmins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-start justify-between gap-4 rounded-lg border p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                            {admin.role === "super_admin" && (
                              <ShieldCheck className="h-5 w-5 text-red-600" />
                            )}
                            {admin.role === "admin" && (
                              <UserCog className="h-5 w-5 text-blue-600" />
                            )}
                            {admin.role === "support_admin" && (
                              <UserCheck className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{admin.name}</h3>
                              <Badge
                                variant={
                                  admin.status === "active"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {admin.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {admin.email}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${admin.role === "super_admin" ? "bg-red-50" : admin.role === "admin" ? "bg-blue-50" : "bg-green-50"}`}
                              >
                                {admin.role === "super_admin"
                                  ? "Super Admin"
                                  : admin.role === "admin"
                                    ? "Admin"
                                    : "Support Admin"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Last active: {admin.lastActive}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-1 h-4 w-4" />
                                Permissions
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Admin Permissions</DialogTitle>
                                <DialogDescription>
                                  View permissions for {admin.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <h4 className="font-medium mb-2">
                                  Access Permissions
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="view-users"
                                      checked={admin.permissions.viewUsers}
                                      disabled
                                    />
                                    <Label htmlFor="view-users">
                                      View Users
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="manage-users"
                                      checked={admin.permissions.manageUsers}
                                      disabled
                                    />
                                    <Label htmlFor="manage-users">
                                      Manage Users
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="view-properties"
                                      checked={admin.permissions.viewProperties}
                                      disabled
                                    />
                                    <Label htmlFor="view-properties">
                                      View Properties
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="manage-properties"
                                      checked={
                                        admin.permissions.manageProperties
                                      }
                                      disabled
                                    />
                                    <Label htmlFor="manage-properties">
                                      Manage Properties
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="view-maintenance"
                                      checked={
                                        admin.permissions.viewMaintenance
                                      }
                                      disabled
                                    />
                                    <Label htmlFor="view-maintenance">
                                      View Maintenance
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="manage-maintenance"
                                      checked={
                                        admin.permissions.manageMaintenance
                                      }
                                      disabled
                                    />
                                    <Label htmlFor="manage-maintenance">
                                      Manage Maintenance
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="view-payments"
                                      checked={admin.permissions.viewPayments}
                                      disabled
                                    />
                                    <Label htmlFor="view-payments">
                                      View Payments
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="manage-payments"
                                      checked={admin.permissions.managePayments}
                                      disabled
                                    />
                                    <Label htmlFor="manage-payments">
                                      Manage Payments
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="view-reports"
                                      checked={admin.permissions.viewReports}
                                      disabled
                                    />
                                    <Label htmlFor="view-reports">
                                      View Reports
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="manage-reports"
                                      checked={admin.permissions.manageReports}
                                      disabled
                                    />
                                    <Label htmlFor="manage-reports">
                                      Manage Reports
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="view-trust"
                                      checked={
                                        admin.permissions.viewTrustSafety
                                      }
                                      disabled
                                    />
                                    <Label htmlFor="view-trust">
                                      View Trust & Safety
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="manage-trust"
                                      checked={
                                        admin.permissions.manageTrustSafety
                                      }
                                      disabled
                                    />
                                    <Label htmlFor="manage-trust">
                                      Manage Trust & Safety
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="view-audit"
                                      checked={admin.permissions.viewAuditLog}
                                      disabled
                                    />
                                    <Label htmlFor="view-audit">
                                      View Audit Log
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="manage-admins"
                                      checked={admin.permissions.manageAdmins}
                                      disabled
                                    />
                                    <Label htmlFor="manage-admins">
                                      Manage Admins
                                    </Label>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                {admin.role !== "super_admin" && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline">
                                        <UserCog className="mr-2 h-4 w-4" />
                                        Edit Permissions
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Edit Admin Permissions
                                        </DialogTitle>
                                        <DialogDescription>
                                          Modify permissions for {admin.name}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="py-4">
                                        <h4 className="font-medium mb-2">
                                          Access Permissions
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-view-users"
                                              defaultChecked={
                                                admin.permissions.viewUsers
                                              }
                                            />
                                            <Label htmlFor="edit-view-users">
                                              View Users
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-manage-users"
                                              defaultChecked={
                                                admin.permissions.manageUsers
                                              }
                                            />
                                            <Label htmlFor="edit-manage-users">
                                              Manage Users
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-view-properties"
                                              defaultChecked={
                                                admin.permissions.viewProperties
                                              }
                                            />
                                            <Label htmlFor="edit-view-properties">
                                              View Properties
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-manage-properties"
                                              defaultChecked={
                                                admin.permissions
                                                  .manageProperties
                                              }
                                            />
                                            <Label htmlFor="edit-manage-properties">
                                              Manage Properties
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-view-maintenance"
                                              defaultChecked={
                                                admin.permissions
                                                  .viewMaintenance
                                              }
                                            />
                                            <Label htmlFor="edit-view-maintenance">
                                              View Maintenance
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-manage-maintenance"
                                              defaultChecked={
                                                admin.permissions
                                                  .manageMaintenance
                                              }
                                            />
                                            <Label htmlFor="edit-manage-maintenance">
                                              Manage Maintenance
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-view-payments"
                                              defaultChecked={
                                                admin.permissions.viewPayments
                                              }
                                            />
                                            <Label htmlFor="edit-view-payments">
                                              View Payments
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-manage-payments"
                                              defaultChecked={
                                                admin.permissions.managePayments
                                              }
                                            />
                                            <Label htmlFor="edit-manage-payments">
                                              Manage Payments
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-view-reports"
                                              defaultChecked={
                                                admin.permissions.viewReports
                                              }
                                            />
                                            <Label htmlFor="edit-view-reports">
                                              View Reports
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-manage-reports"
                                              defaultChecked={
                                                admin.permissions.manageReports
                                              }
                                            />
                                            <Label htmlFor="edit-manage-reports">
                                              Manage Reports
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-view-trust"
                                              defaultChecked={
                                                admin.permissions
                                                  .viewTrustSafety
                                              }
                                            />
                                            <Label htmlFor="edit-view-trust">
                                              View Trust & Safety
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-manage-trust"
                                              defaultChecked={
                                                admin.permissions
                                                  .manageTrustSafety
                                              }
                                            />
                                            <Label htmlFor="edit-manage-trust">
                                              Manage Trust & Safety
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-view-audit"
                                              defaultChecked={
                                                admin.permissions.viewAuditLog
                                              }
                                            />
                                            <Label htmlFor="edit-view-audit">
                                              View Audit Log
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="edit-manage-admins"
                                              defaultChecked={
                                                admin.permissions.manageAdmins
                                              }
                                            />
                                            <Label htmlFor="edit-manage-admins">
                                              Manage Admins
                                            </Label>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button>Save Permissions</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                      <UserX className="mr-2 h-4 w-4" />
                                      Delete Admin
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Admin Account
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete{" "}
                                        {admin.name}'s admin account? This
                                        action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteAdmin(admin)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Admin Account
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {admin.name}'s
                                  admin account? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAdmin(admin)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Create New Admin</CardTitle>
                  <CardDescription>
                    Add a new administrator with custom permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="admin-name">Full Name</Label>
                      <Input
                        id="admin-name"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="john.doe@realtyplus.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-role">Admin Role</Label>
                      <Select value={adminRole} onValueChange={setAdminRole}>
                        <SelectTrigger id="admin-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="support_admin">
                            Support Admin
                          </SelectItem>
                          <SelectItem value="super_admin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Permissions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view-users"
                            checked={adminPermissions.viewUsers}
                            onCheckedChange={() =>
                              togglePermission("viewUsers")
                            }
                          />
                          <Label htmlFor="view-users">View Users</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage-users"
                            checked={adminPermissions.manageUsers}
                            onCheckedChange={() =>
                              togglePermission("manageUsers")
                            }
                          />
                          <Label htmlFor="manage-users">Manage Users</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view-properties"
                            checked={adminPermissions.viewProperties}
                            onCheckedChange={() =>
                              togglePermission("viewProperties")
                            }
                          />
                          <Label htmlFor="view-properties">
                            View Properties
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage-properties"
                            checked={adminPermissions.manageProperties}
                            onCheckedChange={() =>
                              togglePermission("manageProperties")
                            }
                          />
                          <Label htmlFor="manage-properties">
                            Manage Properties
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view-maintenance"
                            checked={adminPermissions.viewMaintenance}
                            onCheckedChange={() =>
                              togglePermission("viewMaintenance")
                            }
                          />
                          <Label htmlFor="view-maintenance">
                            View Maintenance
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage-maintenance"
                            checked={adminPermissions.manageMaintenance}
                            onCheckedChange={() =>
                              togglePermission("manageMaintenance")
                            }
                          />
                          <Label htmlFor="manage-maintenance">
                            Manage Maintenance
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view-payments"
                            checked={adminPermissions.viewPayments}
                            onCheckedChange={() =>
                              togglePermission("viewPayments")
                            }
                          />
                          <Label htmlFor="view-payments">View Payments</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage-payments"
                            checked={adminPermissions.managePayments}
                            onCheckedChange={() =>
                              togglePermission("managePayments")
                            }
                          />
                          <Label htmlFor="manage-payments">
                            Manage Payments
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view-reports"
                            checked={adminPermissions.viewReports}
                            onCheckedChange={() =>
                              togglePermission("viewReports")
                            }
                          />
                          <Label htmlFor="view-reports">View Reports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage-reports"
                            checked={adminPermissions.manageReports}
                            onCheckedChange={() =>
                              togglePermission("manageReports")
                            }
                          />
                          <Label htmlFor="manage-reports">Manage Reports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view-trust"
                            checked={adminPermissions.viewTrustSafety}
                            onCheckedChange={() =>
                              togglePermission("viewTrustSafety")
                            }
                          />
                          <Label htmlFor="view-trust">
                            View Trust & Safety
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage-trust"
                            checked={adminPermissions.manageTrustSafety}
                            onCheckedChange={() =>
                              togglePermission("manageTrustSafety")
                            }
                          />
                          <Label htmlFor="manage-trust">
                            Manage Trust & Safety
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view-audit"
                            checked={adminPermissions.viewAuditLog}
                            onCheckedChange={() =>
                              togglePermission("viewAuditLog")
                            }
                          />
                          <Label htmlFor="view-audit">View Audit Log</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage-admins"
                            checked={adminPermissions.manageAdmins}
                            onCheckedChange={() =>
                              togglePermission("manageAdmins")
                            }
                          />
                          <Label htmlFor="manage-admins">Manage Admins</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleCreateAdmin}
                    disabled={!adminName || !adminEmail || !adminPassword}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Admin Account
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Admin Role Permissions</CardTitle>
                  <CardDescription>
                    Default permission sets for different admin roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission</TableHead>
                        <TableHead>Super Admin</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Support Admin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          View Users
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Manage Users
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          View Properties
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Manage Properties
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          View Maintenance
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Manage Maintenance
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          View Payments
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Manage Payments
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          View Trust & Safety
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Manage Trust & Safety
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          View Audit Log
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Manage Admins
                        </TableCell>
                        <TableCell>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                        <TableCell>
                          <Ban className="h-4 w-4 text-red-500" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
