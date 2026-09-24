import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/store/types";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

const getHueFromChar = (char: string, saturation = 89, lightness = 89) => {
  const c = char.toUpperCase()[0] || "";
  const charCode = c.charCodeAt(0);

  // Map A-Z (65-90) to hue values from 0 to 360
  const alphabetIndex = charCode - 65; // A=0, B=1, ..., Z=25
  const hue = Math.round((alphabetIndex / 25) * 360);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

type SearchCampusUsersProps = {
  disabled: boolean;
  onSelectCampusUser: (userId: string, departmentId: string) => void;
  usersByCampus: User[];
  isLoading: boolean;
};

const UserDetails = ({
  user,
  onSelectUser,
}: {
  user: User;
  onSelectUser: () => void;
}) => {
  const getGender = (gender: "M" | "F") => {
    if (gender === "M") return "Male";
    if (gender === "F") return "Female";
    return "";
  };

  const name = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName?.[0]}${user.lastName?.[0]}`;
  const hueText = name?.[0] || "O";
  return (
    <div className="flex items-center p-4" onClick={() => onSelectUser()}>
      <Avatar>
        <AvatarImage src={user?.pictureUrl} />
        <AvatarFallback
          className="text-sm border-none rounded-full grid place-content-center p-2 aspect-square font-semibold"
          style={{
            color: getHueFromChar(hueText, 61, 20),
            background: getHueFromChar(hueText),
          }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col ml-4 flex-1">
        <div className="flex items-center gap-2 justify-between">
          <h2 className="font-medium text-sm">
            {user?.firstName} {user?.lastName}
          </h2>

          {user?.gender && (
            <Badge variant="outline">{getGender(user.gender)}</Badge>
          )}
        </div>
        <p className="text-xs text-neutral-700 dark:text-neutral-300">
          {user?.departmentName}
        </p>
        <p className="text-xs text-neutral-700 dark:text-neutral-300">
          {user.email}
        </p>
      </div>
    </div>
  );
};

const SearchCampusUsers = ({
  disabled,
  onSelectCampusUser,
  usersByCampus,
  isLoading,
}: SearchCampusUsersProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    const data = [...usersByCampus];
    if (search.trim().length > 0) {
      return data.filter(
        (user) =>
          `${user?.firstName?.toLowerCase()} ${user?.lastName?.toLowerCase()}`.includes(
            search.toLowerCase(),
          ) || user?.email?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return data.slice(0, 30);
  }, [usersByCampus, search]);

  const onSelectUser = (userId: string, departmentId: string) => {
    onSelectCampusUser(userId, departmentId);
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      {usersByCampus?.length > 0 && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="h-[100svh] w-full px-0">
            <DialogTitle className="sr-only">User search</DialogTitle>
            <div className="flex flex-col h-full relative overflow-auto mt-4">
              <div className="p-4 h-fit sticky top-0 bg-white z-[1] dark:bg-black">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name"
                  className="w-full p-3 border border-neutral-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
                {list?.map((user) => (
                  <UserDetails
                    key={user._id}
                    user={user}
                    onSelectUser={() =>
                      onSelectUser(
                        user._id,
                        user.departmentId ?? user.department?._id,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <button
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="absolute bottom-24 right-5 p-4 border-none bg-brandColor-600 text-white rounded-full disabled:opacity-50 disabled:bg-neutral-600 disabled:cursor-not-allowed z-10"
      >
        {isLoading ? <Loader2Icon className="animate-spin" /> : <SearchIcon />}
      </button>
    </>
  );
};

export default SearchCampusUsers;
