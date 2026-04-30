import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordSchema } from "@/src/lib/zod-schemas/user";
import { sendChangePasswordRequest } from "@/src/api/user-requests";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { passwordRequirements } from "@/src/lib/zod-schemas/auth";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { useAuth } from "@/src/context/AuthContext";
import { ZxcvbnResult } from "@zxcvbn-ts/core";
import { passwordResult, ZxcvbnStrength } from "@/src/utils/zxcvbn-strength";

interface ChangePasswordFieldProps {
  name: "newPassword" | "confirmPassword" | "currentPassword";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const formFields: ChangePasswordFieldProps[] = [
  { name: "confirmPassword", type: "password", label: "Confirm Password" },
  { name: "currentPassword", type: "password", label: "Current Password" },
];

export default function ChangePasswordForm() {
  const { signout } = useAuth();

  const [visibleFields, setVisibleFields] = useState<{ [key: string]: boolean }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "", currentPassword: "" },
    shouldFocusError: false,
  });
  const formRootErrors = form.formState.errors.root;

  const watchedPassword = useWatch({
    control: form.control,
    name: "newPassword",
  });
  const hasChanged = watchedPassword !== "";

  const watchedPasswordResult: ZxcvbnResult | null = watchedPassword
    ? passwordResult(watchedPassword)
    : null;

  const onSubmit = async (data: ChangePasswordSchema) => {
    if (watchedPassword && watchedPasswordResult && watchedPasswordResult?.score <= 1) {
      form.setError("newPassword", {
        type: "custom",
        message: "Password is too weak",
      });
      form.setFocus("newPassword");
      return;
    }

    const response = await sendChangePasswordRequest(data);

    if (response.ok) {
      setDialogOpen(true);
      setTimeout(() => signout(), 6000);
    } else {
      const responseType = response.data.type;
      const error = response.data.errors[0];

      if (error.attr === "current_password") {
        form.setError("currentPassword", { type: responseType, message: error.detail });
      } else if (error.attr === "new_password") {
        form.setError("newPassword", { type: responseType, message: error.detail });
        form.setFocus("newPassword");
      }

      if (responseType === "rate_limit_exceeded") {
        form.setError("root.rateLimit", { type: responseType, message: error.detail });
      } else if (responseType === "server_error") {
        toast.warning(error.detail, { id: "server-error" });
      }
    }
  };

  const handleCancel = () => {
    form.reset({ newPassword: "", confirmPassword: "", currentPassword: "" });
  };

  return (
    <>
      <Form {...form}>
        <form
          className="mt-6 w-full sm:w-[338px]"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    label="New Password"
                    eyeVisibleCondition={visibleFields["newPassword"]}
                    labelClassName="!bg-[#1b1b1b]"
                    onEyeClick={() =>
                      setVisibleFields((prev) => ({
                        ...prev,
                        ["newPassword"]: !prev["newPassword"],
                      }))
                    }
                    onFocus={() => setFocusedField("newPassword")}
                    {...field}
                    onBlur={() => setFocusedField(null)}
                  />
                </FormControl>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-600 ease-in-out",
                    focusedField === "newPassword" && hasChanged
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <ZxcvbnStrength password={field.value as string} />

                    <ul className="space-y-1 text-sm">
                      {passwordRequirements.map(({ message, regex }, id) => {
                        const isMet = regex.test(field.value);

                        return (
                          <li
                            key={id}
                            className={cn(
                              "flex items-center gap-2 transition-colors duration-400",
                              isMet ? "text-matrix/70" : "text-destructive",
                            )}
                          >
                            {isMet ? <Check size={15} /> : <X size={15} />}

                            <span>{message}</span>
                          </li>
                        );
                      })}
                    </ul>

                    {form.formState.errors.newPassword && <FormMessage />}
                  </div>
                </div>
              </FormItem>
            )}
          />

          {formFields.map(({ name, type, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-600 ease-in-out",
                        hasChanged ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden pt-2">
                        <Input
                          id={`change-password-form-${name}`}
                          type={type}
                          label={label}
                          disabled={!hasChanged}
                          eyeVisibleCondition={visibleFields[name as string]}
                          labelClassName="!bg-[#1b1b1b] !overflow-visible"
                          onEyeClick={() =>
                            setVisibleFields((prev) => ({
                              ...prev,
                              [name]: !prev[name as string],
                            }))
                          }
                          {...field}
                          onBlur={() => setFocusedField(null)}
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
          ))}

          <div className="flex flex-row gap-2 overflow-hidden">
            <Button
              type="submit"
              className="min-w-[84px] transition-all duration-300"
              disabled={form.formState.isSubmitting || !hasChanged}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Change Password"}
            </Button>

            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-600 ease-in-out",
                hasChanged ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <Button
                variant="outline"
                type="reset"
                disabled={!hasChanged}
                className="transition-all duration-300 disabled:cursor-default"
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
                Password has been successfully changed
              </DialogTitle>

              <DialogDescription className="text-center">
                You will be redirected to the sign in page in a few seconds. Use your new password
                to sign in.
              </DialogDescription>
            </DialogHeader>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
