import { Button } from "../ui/button";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useForm } from "react-hook-form";
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
  showHints: boolean;
}

const formFields: ChangePasswordFieldProps[] = [
  { name: "newPassword", type: "password", label: "New Password", showHints: true },
  { name: "confirmPassword", type: "password", label: "Confirm Password", showHints: false },
  { name: "currentPassword", type: "password", label: "Current Password", showHints: false },
];

export default function ChangePasswordDialog() {
  const { signout } = useAuth();
  const [visibleFields, setVisibleFields] = useState<{ [key: string]: boolean }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "", currentPassword: "" },
    shouldFocusError: false,
  });
  const formRootErrors = form.formState.errors.root;

  const watchedPassword = form.watch("newPassword");

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
      setCurrentStep(1);
      setTimeout(() => signout(), 6000);
    } else {
      const responseType = response.data.type;
      const error = response.data.errors[0];

      if (error.attr === "current_password") {
        form.setError("currentPassword", { type: responseType, message: error.detail });
      } else if (error.attr === "newPassword") {
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

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => onOpenChange(open)}>
      <DialogTrigger asChild>
        <Button className="w-full uppercase transition-all duration-300">Change password</Button>
      </DialogTrigger>
      <DialogContent
        className={`${currentStep === 1 && "flex items-center justify-center"}`}
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(event) => {
          currentStep === 1 && event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          currentStep === 1 && event.preventDefault();
        }}
      >
        {currentStep === 0 && (
          <>
            <DialogHeader>
              <DialogTitle>Set a new password</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form className="mt-4 space-y-3" noValidate onSubmit={form.handleSubmit(onSubmit)}>
                {formFields.map(({ name, type, label, showHints }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type={type}
                            label={label}
                            eyeVisibleCondition={visibleFields[name as string]}
                            onEyeClick={() =>
                              setVisibleFields((prev) => ({
                                ...prev,
                                [name]: !prev[name as string],
                              }))
                            }
                            onFocus={showHints ? () => setFocusedField(name as string) : undefined}
                            {...field}
                            onBlur={() => setFocusedField(null)}
                          />
                        </FormControl>

                        {showHints ? (
                          <div
                            className={cn(
                              "grid transition-[grid-template-rows,opacity] duration-600 ease-in-out",
                              focusedField === name
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
                        ) : (
                          <FormMessage>
                            {formRootErrors?.rateLimit ? formRootErrors?.rateLimit.message : ""}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                ))}
                <DialogFooter className="mt-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="transition-all duration-300">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="min-w-[84px] transition-all duration-300"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? <Spinner /> : "Confirm"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
        {currentStep === 1 && (
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
              <DialogTitle>Password has been successfully changed</DialogTitle>
              <DialogDescription className="text-center">
                You will be redirected to the sign in page in a few seconds. Use your new password
                to sign in.
              </DialogDescription>
            </DialogHeader>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
