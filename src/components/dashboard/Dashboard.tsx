"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { useAuth } from "@/src/context/AuthContext";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { deleteAccountSchema, DeleteAccountSchema } from "@/src/lib/zod-schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { sendDeleteAccountRequest } from "@/src/api/user-requests";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export default function Dashboard() {
  const { user, signout } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successContentVisible, setSuccessContentVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      form.reset({ password: "" });
      setPasswordVisible(false);
    }
  };

  const form = useForm<DeleteAccountSchema>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
    shouldFocusError: false,
  });
  const formRootErrors = form.formState.errors.root;

  const onSubmit = async (data: DeleteAccountSchema) => {
    const response = await sendDeleteAccountRequest(data);

    if (response.ok) {
      setSuccessContentVisible(true);
      setTimeout(() => signout(), 6000);
    } else {
      const responseType = response.data.type;
      const error = response.data.errors[0];

      if (error.attr === "current_password") {
        form.setError("password", { type: responseType, message: error.detail });
      }

      if (responseType === "rate_limit_exceeded") {
        form.setError("root.rateLimit", { type: responseType, message: error.detail });
      } else if (responseType === "server_error") {
        toast.warning(error.detail, { id: "server-error" });
      }
    }
  };

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
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex min-h-[530px] w-full max-w-[395px] flex-col items-center justify-center gap-8 p-8">
          <ul className="flex flex-col">
            <li>
              <b>User ID:</b> {user?.id}
            </li>
            <li>
              <b>Email:</b> {user?.email}
            </li>
            <li>
              <b>Username:</b> {user?.username}
            </li>
          </ul>
          <Dialog open={dialogOpen} onOpenChange={(open) => onOpenChange(open)}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full transition-all duration-300">
                Delete account
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-lg"
              showCloseButton={false}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(event) => {
                successContentVisible ? event.preventDefault() : undefined;
              }}
              onEscapeKeyDown={(event) => {
                successContentVisible ? event.preventDefault() : undefined;
              }}
            >
              {!successContentVisible ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Start account deletion proccess?</DialogTitle>
                    <DialogDescription>
                      After 24 hours from the time you submit this request, your account and all
                      associated data will be <b>irreversibly</b> deleted.
                      <br />
                      You can cancel the deletion process by signing back into your account.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form className="mt-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="password"
                                label="Password"
                                eyeVisibleCondition={passwordVisible}
                                onEyeClick={() => setPasswordVisible((prev) => !prev)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage>
                              {formRootErrors?.rateLimit ? formRootErrors?.rateLimit.message : ""}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="mt-3">
                        <DialogClose asChild>
                          <Button variant="outline" className="transition-all duration-300">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          variant="destructive"
                          className="w-[84px] transition-all duration-300"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? <Spinner /> : "Confirm"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </>
              ) : (
                <motion.div
                  variants={getItemVariants(0, 0, 0.7)}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="bg-matrix/15 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-matrix-80 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <DialogHeader className="mt-5 flex items-center justify-center">
                    <DialogTitle>The account deletion process has begun</DialogTitle>
                    <DialogDescription>
                      You will be redirected to the sign in page in a few seconds.
                    </DialogDescription>
                  </DialogHeader>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
}
