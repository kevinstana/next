"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/public/hua-logo.png";
import Link from "next/link";
import { clsx } from "clsx";
import { Role } from "@/types/app-types";
import { roleSpecificMenuItems, sharedMenuItems } from "@/components/SideBar/menu";

export default function Sidebar({ role }: Readonly<{ role: Role }>) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/logout") {
    return null
  }

  return (
    <aside className="border-r min-w-64 overflow-x-hidden hidden md:block text-[0.95rem]">
      <div className="h-16 flex items-center justify-center px-4 border-b">
        <Image src={logo} height={42} alt="HUA Logo" priority />
      </div>

      <nav className="py-1 px-2 space-y-2">
        <ul className="space-y-2 pt-6">
          {sharedMenuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={clsx(
                  "block p-2 rounded hover:bg-gray-300",
                  pathname === item.path && "bg-gray-200"
                )}
              >
                <div className="flex pl-2 items-center">
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
          {roleSpecificMenuItems[role].map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={clsx(
                  "block p-2 rounded hover:bg-gray-300",
                  pathname === item.path && "bg-gray-200"
                )}
              >
                <div className="flex pl-2 items-center">
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
