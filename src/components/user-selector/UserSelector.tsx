import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireDataBase } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Search, X, UserPlus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
  role?: string;
}

interface UserSelectorProps {
  onUserSelect: (users: User[]) => void;
  selectedUsers: User[];
}

const UserSelector = ({
  onUserSelect,
  selectedUsers = [],
}: UserSelectorProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const usersCollection = collection(fireDataBase, "users");
        const usersSnapshot = await getDocs(usersCollection);

        const fetchedUsers = usersSnapshot.docs.map(
          (doc) =>
            ({
              uid: doc.id,
              ...doc.data(),
            } as User)
        );

        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    // Check if user is already selected
    if (!selectedUsers.some((selectedUser) => selectedUser.uid === user.uid)) {
      const updatedUsers = [...selectedUsers, user];
      onUserSelect(updatedUsers);
    }
    setShowDropdown(false);
    setSearchQuery("");
  };

  // Handle user removal
  const handleUserRemove = (userId: string) => {
    const updatedUsers = selectedUsers.filter((user) => user.uid !== userId);
    onUserSelect(updatedUsers);
  };

  return (
    <div className="col-span-1 sm:col-span-3 w-full">
      <div className="relative">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <Search className="top-1/2 left-2 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
            <Input
              placeholder="Search users by name or email"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
              className="pl-8"
            />
          </div>
        </div>

        {/* User dropdown */}
        {showDropdown && (
          <div className="z-10 absolute bg-background shadow-lg mt-1 border border-input rounded-md w-full max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="mr-2 w-4 h-4 text-primary animate-spin" />
                <span>Loading users...</span>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center hover:bg-accent p-2 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar className="mr-2 w-8 h-8">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={`${user.firstName} ${user.lastName}` || "User"}
                      />
                    ) : (
                      <div className="flex justify-center items-center bg-primary w-full h-full font-medium text-primary-foreground text-sm">
                        {user.firstName?.[0] || user.email?.[0] || "U"}
                      </div>
                    )}
                  </Avatar>

                  <div className="flex-grow">
                    <p className="font-medium text-sm">
                      {`${user.firstName} ${user.lastName}` || "Unnamed User"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  </div>
                  {user.role && (
                    <Badge variant="outline" className="ml-2">
                      {user.role}
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="p-2 text-muted-foreground text-center">
                {searchQuery ? "No users found" : "No users available"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected users */}
      {selectedUsers.length > 0 && (
        <div className="mt-2">
          <p className="mb-1 text-muted-foreground text-sm">Selected users:</p>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <Badge
                key={user.uid}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {`${user.firstName} ${user.lastName}` || user.email}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleUserRemove(user.uid)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default UserSelector;
