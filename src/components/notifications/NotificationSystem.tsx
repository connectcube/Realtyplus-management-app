import React, { useState } from "react";
import { Bell, Check, X, Info, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../ui/toast";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationSystemProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onActionClick?: (id: string) => void;
}

const NotificationSystem = ({
  notifications = [
    {
      id: "1",
      title: "New Maintenance Request",
      description: "Apartment 3B has reported a leaking faucet in the kitchen.",
      type: "info",
      timestamp: new Date(),
      read: false,
      actionLabel: "View",
    },
    {
      id: "2",
      title: "Payment Received",
      description:
        "Rent payment for Apartment 2A has been processed successfully.",
      type: "success",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: "3",
      title: "Maintenance Complete",
      description: "The repair for Apartment 1C has been marked as complete.",
      type: "success",
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
    {
      id: "4",
      title: "Payment Overdue",
      description: "Rent payment for Apartment 4D is 3 days overdue.",
      type: "warning",
      timestamp: new Date(Date.now() - 86400000),
      read: false,
      actionLabel: "Send Reminder",
    },
    {
      id: "5",
      title: "Urgent Repair Needed",
      description:
        "Water leak reported in Apartment 5E affecting multiple units.",
      type: "error",
      timestamp: new Date(Date.now() - 43200000),
      read: false,
      actionLabel: "Assign Contractor",
    },
  ],
  onMarkAsRead = (id) => console.log(`Marked notification ${id} as read`),
  onDismiss = (id) => console.log(`Dismissed notification ${id}`),
  onActionClick = (id) => console.log(`Action clicked for notification ${id}`),
}: NotificationSystemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNotifications, setActiveNotifications] =
    useState<Notification[]>(notifications);

  const unreadCount = activeNotifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleMarkAsRead = (id: string) => {
    setActiveNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    onMarkAsRead(id);
  };

  const handleDismiss = (id: string) => {
    setActiveNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
    onDismiss(id);
  };

  const getIconForType = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="relative"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="max-h-96 overflow-y-auto">
          {activeNotifications.length > 0 ? (
            <ul className="space-y-2">
              {activeNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-3 rounded-md border ${notification.read ? "bg-gray-50" : "bg-white border-l-4"} ${
                    !notification.read && notification.type === "info"
                      ? "border-l-blue-500"
                      : ""
                  } ${!notification.read && notification.type === "success" ? "border-l-green-500" : ""} ${
                    !notification.read && notification.type === "warning"
                      ? "border-l-yellow-500"
                      : ""
                  } ${!notification.read && notification.type === "error" ? "border-l-red-500" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        {notification.actionLabel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onActionClick(notification.id)}
                            className="text-xs h-7"
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs h-7"
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(notification.id)}
                            className="text-xs h-7"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No notifications</p>
            </div>
          )}
        </div>
      )}

      {/* Toast notifications for real-time alerts */}
      <ToastProvider>
        {activeNotifications
          .filter((notification) => !notification.read)
          .slice(0, 1)
          .map((notification) => (
            <Toast key={notification.id} className="mb-2">
              <div className="flex items-start gap-2">
                <div className="mt-1">{getIconForType(notification.type)}</div>
                <div>
                  <ToastTitle>{notification.title}</ToastTitle>
                  <ToastDescription>
                    {notification.description}
                  </ToastDescription>
                </div>
              </div>
              {notification.actionLabel && (
                <ToastAction
                  altText={notification.actionLabel}
                  onClick={() => onActionClick(notification.id)}
                >
                  {notification.actionLabel}
                </ToastAction>
              )}
              <ToastClose onClick={() => handleMarkAsRead(notification.id)} />
            </Toast>
          ))}
        <ToastViewport />
      </ToastProvider>
    </div>
  );
};

export default NotificationSystem;
