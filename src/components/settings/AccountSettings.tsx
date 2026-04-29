import { useRef, useState } from "react";
import ChangeEmailForm, { ChangeEmailFormRef } from "./ChangeEmailForm";
import ChangeUsernameForm, { ChangeUsernameFormRef } from "./ChangeUsernameForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { cn } from "@/src/lib/utils";
import { Badge } from "../ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import DeleteAccountForm from "./DeleteAccountForm";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";

export default function AccountSettings() {
  const usernameRef = useRef<ChangeUsernameFormRef>(null);
  const emailRef = useRef<ChangeEmailFormRef>(null);

  const [usernameChanged, setUsernameChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasAnyChange = usernameChanged || emailChanged;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const requests: Promise<void>[] = [];
      if (usernameChanged) requests.push(usernameRef.current!.submitForm());
      if (emailChanged) requests.push(emailRef.current!.submitForm());
      await Promise.all(requests);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    usernameRef.current?.resetForm();
    emailRef.current?.resetForm();
  };

  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="flex w-full justify-center py-[35px]"
    >
      <div className="flex flex-col">
        <div className="bg-sidebar-accent/60 flex flex-col rounded-md p-4">
          <h2 className="uppercase">Profile</h2>

          <div className="flex flex-row gap-4">
            <ChangeUsernameForm ref={usernameRef} onDirtyChange={setUsernameChanged} />
            <ChangeEmailForm ref={emailRef} onDirtyChange={setEmailChanged} />
          </div>

          <div className="flex flex-row gap-2 overflow-hidden">
            <Button
              className="min-w-[84px] transition-all duration-300"
              disabled={isSubmitting || !hasAnyChange}
              onClick={handleSave}
            >
              {isSubmitting ? <Spinner /> : "Save changes"}
            </Button>

            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-in-out",
                hasAnyChange ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <Button
                type="reset"
                variant="outline"
                className={`transition-all duration-300 ${!hasAnyChange ? "!cursor-default" : ""}`}
                disabled={isSubmitting || !hasAnyChange}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-sidebar-accent/60 mt-7 flex flex-col rounded-md p-4">
          <div className="flex flex-row items-center justify-between">
            <h2 className="uppercase">Security</h2>

            <Badge className="bg-matrix/20 border-matrix-50 text-matrix-80 border-1 text-[0.813rem]">
              <BadgeCheckIcon />
              Password last changed 30 days ago
            </Badge>
          </div>

          <div className="flex flex-row gap-12">
            <ChangePasswordForm />
          </div>
        </div>

        <div className="bg-sidebar-accent/60 mt-7 flex flex-col rounded-md p-4">
          <h2 className="text-destructive/90 uppercase">Delete Account</h2>

          <p className="text-sm">
            After <b>24 hours</b> from the time you submit this request, your account and all
            associated data will be <b>irreversibly</b> deleted.
            <br />
            Once the deletion process has begun, you can automatically cancel it by signing back
            into your account within <b>24 hours</b>.
          </p>

          <div className="flex flex-row gap-12">
            <DeleteAccountForm />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
