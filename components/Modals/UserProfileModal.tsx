"use client";

import { TransformedUser, UserProfileModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import BaseModal from "./BaseModal";
import { getUserProfile } from "@/lib/server-actions";
import useSWR from "swr";
import RecordNavigation from "../RecordNavigation";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";
// import UserProfileSkeleton from "../Skeletons/UserProfileSkeleton";
import UserProfile from "../UserProfile";
import { useUserIdentifiers } from "@/providers/UserIdentifiersProvider";
import { Loader2 } from "lucide-react";

const titles: Record<string, string> = {
  users: "Users",
  "external-users": "External Users",
  "hua-users": "Hua Users",
};

const UserProfileModal = forwardRef<UserProfileModalRef>((_, ref) => {
  const [user, setUser] = useState<TransformedUser>();
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const { identifiers, path } = useUserIdentifiers();

  const { isLoading, isValidating, mutate } = useSWR(
    () => value,
    () => getUserProfile(value, path),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (res) => {
        setIsEditing(false);
        setUser(res.data);
      },
      onError: () => {
        setIsEditing(false);
      },
    }
  );

  useImperativeHandle(ref, () => ({
    openDialog: (username) => {
      setOpen(true);
      setValue(username);
    },
  }));

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader
          title={`${titles[path]} / ${value}`}
          setOpen={setOpen}
        />

        <div
          className="flex flex-col flex-grow justify-between px-4 pt-4 overflow-hidden"
          tabIndex={-1}
        >
          {/* Profile and navigation */}
          <div className="flex flex-col px-6 py-2">
            <div className="flex w-full justify-between">
              <h3 className="font-medium text-sm/[1.5rem]">Profile</h3>
              <RecordNavigation
                list={identifiers}
                value={value}
                setValue={setValue}
              />
            </div>
          </div>

          {/* form */}
          {!user || isLoading || isValidating ? (
            // <UserProfileSkeleton />
            <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="mr-2 h-14 w-14 animate-spin" strokeWidth={0.5} />
            </div>
          ) : (
            <UserProfile
              user={user}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setOpen={setOpen}
              mutate={mutate}
              path={path}
            />
          )}
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

UserProfileModal.displayName = "UserProfileModal";

export { UserProfileModal };
