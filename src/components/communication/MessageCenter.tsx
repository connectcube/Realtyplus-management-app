import React, { useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MessageCircle, Send, User, Users, Home, Wrench } from "lucide-react";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    type: "tenant" | "landlord" | "contractor";
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    type: "tenant" | "landlord" | "contractor";
  };
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    type: "tenant" | "landlord" | "contractor";
    avatar?: string;
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface Contact {
  id: string;
  name: string;
  type: "tenant" | "landlord" | "contractor";
  avatar?: string;
}

interface MessageCenterProps {
  userId?: string;
  userType?: "tenant" | "landlord" | "contractor";
  conversations?: Conversation[];
  contacts?: Contact[];
}

const MessageCenter = ({
  userId = "1",
  userType = "tenant",
  conversations = [
    {
      id: "1",
      participant: {
        id: "2",
        name: "John Smith",
        type: "landlord",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
      lastMessage: "I'll check on the heating issue tomorrow morning.",
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 2,
    },
    {
      id: "2",
      participant: {
        id: "3",
        name: "Mike Plumber",
        type: "contractor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      },
      lastMessage: "I can come by on Thursday to fix the sink.",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
    },
    {
      id: "3",
      participant: {
        id: "4",
        name: "Sarah Manager",
        type: "landlord",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      lastMessage: "Your rent payment has been received, thank you!",
      lastMessageTime: new Date(Date.now() - 172800000),
      unreadCount: 0,
    },
  ],
  contacts = [
    {
      id: "2",
      name: "John Smith",
      type: "landlord",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: "3",
      name: "Mike Plumber",
      type: "contractor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
    {
      id: "4",
      name: "Sarah Manager",
      type: "landlord",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
      id: "5",
      name: "Bob Electrician",
      type: "contractor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    },
  ],
}: MessageCenterProps) => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(conversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [newMessageContent, setNewMessageContent] = useState("");

  // Mock messages for the selected conversation
  const mockMessages: Message[] = [
    {
      id: "1",
      sender: {
        id: "2",
        name: "John Smith",
        type: "landlord",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
      recipient: {
        id: userId,
        name: "You",
        type: userType,
      },
      content:
        "Hello, I received your maintenance request about the heating issue.",
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
    {
      id: "2",
      sender: {
        id: userId,
        name: "You",
        type: userType,
      },
      recipient: {
        id: "2",
        name: "John Smith",
        type: "landlord",
      },
      content: "Yes, the heating is not working properly in the living room.",
      timestamp: new Date(Date.now() - 5400000),
      read: true,
    },
    {
      id: "3",
      sender: {
        id: "2",
        name: "John Smith",
        type: "landlord",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
      recipient: {
        id: userId,
        name: "You",
        type: userType,
      },
      content: "I'll check on the heating issue tomorrow morning.",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    // In a real app, this would send the message to the backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleStartNewConversation = () => {
    if (selectedContact && newMessageContent.trim() !== "") {
      // In a real app, this would create a new conversation and send the message
      console.log("Starting new conversation with:", selectedContact);
      console.log("Initial message:", newMessageContent);
      setSelectedContact("");
      setNewMessageContent("");
      setActiveTab("inbox");
    }
  };

  const getContactTypeIcon = (type: "tenant" | "landlord" | "contractor") => {
    switch (type) {
      case "tenant":
        return <User className="h-4 w-4 text-blue-500" />;
      case "landlord":
        return <Home className="h-4 w-4 text-green-500" />;
      case "contractor":
        return <Wrench className="h-4 w-4 text-orange-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Message Center
        </h2>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b px-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              New Message
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="inbox"
          className="flex-1 flex overflow-hidden p-0 m-0"
        >
          <div className="w-1/3 border-r overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 ${selectedConversation === conversation.id ? "bg-gray-100" : ""}`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <div className="relative">
                          <img
                            src={
                              conversation.participant.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.participant.id}`
                            }
                            alt={conversation.participant.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="absolute -bottom-1 -right-1 rounded-full p-1 bg-white">
                            {getContactTypeIcon(conversation.participant.type)}
                          </div>
                        </div>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">
                            {conversation.participant.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                <div className="p-3 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {(() => {
                        const conversation = conversations.find(
                          (c) => c.id === selectedConversation,
                        );
                        return (
                          <div className="relative">
                            <img
                              src={
                                conversation?.participant.avatar ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation?.participant.id}`
                              }
                              alt={conversation?.participant.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="absolute -bottom-1 -right-1 rounded-full p-1 bg-white">
                              {conversation &&
                                getContactTypeIcon(
                                  conversation.participant.type,
                                )}
                            </div>
                          </div>
                        );
                      })()}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {
                          conversations.find(
                            (c) => c.id === selectedConversation,
                          )?.participant.name
                        }
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {
                          conversations.find(
                            (c) => c.id === selectedConversation,
                          )?.participant.type
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === userId ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender.id === userId
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{message.content}</p>
                          <div
                            className={`text-xs mt-1 ${
                              message.sender.id === userId
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="new" className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-lg font-medium">New Message</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Recipient</label>
              <Select
                value={selectedContact}
                onValueChange={setSelectedContact}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a recipient" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      <div className="flex items-center gap-2">
                        {getContactTypeIcon(contact.type)}
                        <span>{contact.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Type your message here..."
                rows={6}
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
              />
            </div>

            <Button
              onClick={handleStartNewConversation}
              disabled={!selectedContact || newMessageContent.trim() === ""}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MessageCenter;
