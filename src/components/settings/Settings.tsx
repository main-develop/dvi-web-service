"use client";

import { usePathname } from "next/navigation";
import AccountSettings from "./AccountSettings";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { motion } from "motion/react";

export default function Settings() {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/settings/account" ? (
        <AccountSettings />
      ) : (
        <motion.div
          variants={getItemVariants(0, 0, 0.7)}
          initial="hidden"
          animate="visible"
          className="flex h-[638px] w-full items-center justify-center py-[35px]"
        >
          In development...
        </motion.div>
      )}
    </>
  );
}
