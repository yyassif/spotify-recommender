"use client"
import {
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";

import { Fragment, useEffect, useState } from "react";
import { User, getCurrentUser } from '~/lib/spotify-auth';
import { UserAvatar } from "./avatar";


export function UserIcon() {
  const [user, setCurrentUser] = useState<User | undefined>(undefined);
  useEffect(() => {
    getCurrentUser().then((user) => {
        if (user) {
          setCurrentUser(user);
        }
    });
  }, []);

  return (
    user ?
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <UserAvatar image={user.image} classes="rounded-full w-6 h-6 outline outline-0 cursor-pointer hover:outline-1 transition duration-150"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="flex justify-between items-center">
          <Fragment>
            <UserAvatar image={user.image} classes="w-8 h-8 rounded-lg"/>
            <span className="text-lg font-bold">{ user.name }</span>
            <span className="sr-only">User Icon and Full Name</span>
          </Fragment>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu> : null
  )
}