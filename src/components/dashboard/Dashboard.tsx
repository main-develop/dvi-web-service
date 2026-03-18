"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { useAuth } from "@/src/context/AuthContext";
import { getItemVariants } from "@/src/utils/get-motion-variants";

export default function Dashboard() {
  const { user, signout } = useAuth();

  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="flex flex-col px-7 py-2"
    >
      <div className="flex justify-end">
        <Button className="tracking-tight transition-all duration-400" onClick={() => signout()}>
          Sign out
        </Button>
      </div>
      <div className="flex min-h-[530px] items-center justify-center">
        <ul className="flex flex-col">
          <li>
            <b>Id:</b> {user?.id}
          </li>
          <li>
            <b>Email:</b> {user?.email}
          </li>
          <li>
            <b>Username:</b> {user?.username}
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
