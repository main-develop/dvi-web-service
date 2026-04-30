"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { useAuth } from "@/src/context/AuthContext";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { deleteAccountSchema, DeleteAccountSchema } from "@/src/lib/zod-schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { sendDeleteAccountRequest } from "@/src/api/user-requests";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { cn } from "@/src/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export default function DeleteAccountForm() {
  const { signout } = useAuth();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [deleteAccountClicked, setDeleteAccountClicked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<DeleteAccountSchema>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
    shouldFocusError: false,
  });
  const formRootErrors = form.formState.errors.root;

  const onSubmit = async (data: DeleteAccountSchema) => {
    const response = await sendDeleteAccountRequest(data);

    if (response.ok) {
      setDialogOpen(true);
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

  const handleCancel = () => {
    setDeleteAccountClicked(false);
    form.reset({ password: "" });
  };

  return (
    <>
      <Form {...form}>
        <form className="mt-4 w-full sm:w-[338px]" noValidate>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-600 ease-in-out",
                      deleteAccountClicked
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden pt-1.5">
                      <Input
                        type="password"
                        label="Current Password"
                        disabled={!deleteAccountClicked}
                        labelClassName="!bg-[#1b1b1b]"
                        eyeVisibleCondition={passwordVisible}
                        onEyeClick={() => setPasswordVisible((prev) => !prev)}
                        {...field}
                      />
                    </div>
                  </div>
                </FormControl>

                <FormMessage>
                  {formRootErrors?.rateLimit ? formRootErrors?.rateLimit.message : ""}
                </FormMessage>
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-2">
            <Button
              type="button"
              variant="destructive"
              className="min-w-[84px] transition-all duration-300"
              disabled={form.formState.isSubmitting}
              onClick={() =>
                deleteAccountClicked ? form.handleSubmit(onSubmit)() : setDeleteAccountClicked(true)
              }
            >
              {form.formState.isSubmitting ? (
                <Spinner />
              ) : deleteAccountClicked ? (
                "Confirm"
              ) : (
                "Delete Account"
              )}
            </Button>

            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-600 ease-in-out",
                deleteAccountClicked ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <Button
                variant="outline"
                type="reset"
                className="transition-all duration-300 disabled:cursor-default"
                disabled={!deleteAccountClicked}
                onClick={() => handleCancel()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={dialogOpen}>
        <DialogContent
          className="flex w-sm items-center justify-center"
          showCloseButton={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <motion.div variants={getItemVariants(0, 0, 0.7)} initial="hidden" animate="visible">
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
              <DialogTitle className="uppercase">
                The account deletion process has begun
              </DialogTitle>

              <DialogDescription className="text-center">
                You will be redirected to the sign in page in a few seconds.
              </DialogDescription>
            </DialogHeader>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
