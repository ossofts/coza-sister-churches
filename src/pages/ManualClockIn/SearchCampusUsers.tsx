import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/store/types";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { fullName } from "@/utils";
import { memo, useCallback, useDeferredValue, useMemo, useState } from "react";

// the campus list runs to thousands of people, and every row mounts an avatar
// that fetches an image, so only ever paint a window of them
const MAX_VISIBLE_RESULTS = 30;

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

const getGender = (gender: "M" | "F") => {
  if (gender === "M") return "Male";
  if (gender === "F") return "Female";
  return "";
};

const UserDetails = memo(
  ({ user, onSelect }: { user: User; onSelect: (user: User) => void }) => {
    const name = fullName(user);
    const initials = `${user.firstName?.[0]}${user.lastName?.[0]}`;
    const hueText = name?.[0] || "O";
    return (
      <div
        role="listitem"
        tabIndex={0}
        className="flex items-center p-4 cursor-pointer"
        onClick={() => onSelect(user)}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onSelect(user);
        }}
      >
        <Avatar>
          {/* most people have no picture; mounting the image for an empty src
              just costs a layout effect and a second render pass per row */}
          {user?.pictureUrl ? <AvatarImage src={user.pictureUrl} /> : null}
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
  },
);
UserDetails.displayName = "UserDetails";

const SearchCampusUsers = ({
  disabled,
  onSelectCampusUser,
  usersByCampus,
  isLoading,
}: SearchCampusUsersProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  // the input stays responsive while the list catches up on its own
  const deferredSearch = useDeferredValue(search);

  // lowercasing every name and email on each keystroke is the other half of the
  // cost, so build the haystack once per payload instead
  const searchIndex = useMemo(
    () =>
      usersByCampus.map((user) => ({
        user,
        haystack: `${fullName(user)} ${user.email ?? ""}`.toLowerCase(),
      })),
    [usersByCampus],
  );

  const { list, totalMatches } = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    if (!term)
      return {
        list: usersByCampus.slice(0, MAX_VISIBLE_RESULTS),
        totalMatches: usersByCampus.length,
      };

    const matches: User[] = [];
    let totalMatches = 0;
    for (const entry of searchIndex) {
      if (!entry.haystack.includes(term)) continue;
      totalMatches += 1;
      if (matches.length < MAX_VISIBLE_RESULTS) matches.push(entry.user);
    }
    return { list: matches, totalMatches };
  }, [searchIndex, usersByCampus, deferredSearch]);

  // nothing to say once the whole match set is already on screen
  const listMessage =
    list.length === 0
      ? "No one matches that search"
      : totalMatches > list.length
        ? `Showing ${list.length} of ${totalMatches} — keep typing to narrow it down`
        : null;

  const onSelectUser = useCallback(
    (user: User) => {
      onSelectCampusUser(user._id, user.departmentId ?? user.department?._id);
      setOpen(false);
      setSearch("");
    },
    [onSelectCampusUser],
  );

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
                  placeholder="Search by name or email"
                  className="w-full p-3 border border-neutral-200 rounded-lg text-sm"
                />
              </div>
              <div
                role="list"
                className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800"
              >
                {list.map((user) => (
                  <UserDetails
                    key={user._id}
                    user={user}
                    onSelect={onSelectUser}
                  />
                ))}
              </div>
              {listMessage && (
                <p className="p-4 text-xs text-center text-neutral-500 dark:text-neutral-400">
                  {listMessage}
                </p>
              )}
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
