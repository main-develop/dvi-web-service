import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeEmailSchema, ChangeEmailSchema } from "@/src/lib/zod-schemas/user";
import { sendChangeEmailRequest } from "@/src/api/user-requests";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";
import OTPVerification from "../ui/otp-verification";
import { VerificationPurpose } from "@/src/api/auth-requests";
import { cn } from "@/src/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ChangeEmailFieldProps {
  name: "newEmail" | "currentPassword";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const formFields: ChangeEmailFieldProps[] = [
  { name: "newEmail", type: "email", label: "Email" },
  { name: "currentPassword", type: "password", label: "Current Password" },
];

export interface ChangeEmailFormRef {
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

interface Props {
  onDirtyChange: (dirty: boolean) => void;
}

const ChangeEmailForm = forwardRef<ChangeEmailFormRef, Props>(({ onDirtyChange }, ref) => {
  const { user, refreshUser } = useAuth();
  const currentEmail = user?.email ?? "";

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ChangeEmailSchema>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: currentEmail, currentPassword: "" },
    shouldFocusError: false,
  });
  const formRootErrors = form.formState.errors.root;

  const watchedEmail = useWatch({
    control: form.control,
    name: "newEmail",
  });
  const hasChanged = watchedEmail !== currentEmail;

  useEffect(() => {
    onDirtyChange(hasChanged);
  }, [hasChanged]);

  const onSubmit = async (data: ChangeEmailSchema) => {
    const response = await sendChangeEmailRequest(data);

    if (response.ok) {
      setDialogOpen(true);
    } else {
      const responseType = response.data.type;
      const error = response.data.errors[0];

      if (error.attr === "current_password") {
        form.setError("currentPassword", { type: responseType, message: error.detail });
      } else if (error.attr === "new_email") {
        form.setError("newEmail", { type: responseType, message: error.detail });
      }
      if (responseType === "rate_limit_exceeded") {
        form.setError("root.rateLimit", { type: responseType, message: error.detail });
      } else if (responseType === "server_error") {
        toast.warning(error.detail, { id: "server-error" });
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      submitForm: () => form.handleSubmit(onSubmit)(),
      resetForm: () => {
        form.reset({ newEmail: currentEmail, currentPassword: "" });
      },
    }),
    [currentEmail],
  );

  const onSuccess = async () => {
    await refreshUser();
    setDialogOpen(false);
  };

  return (
    <>
      <Form {...form}>
        <form className="mt-4 mb-2 w-full" noValidate onSubmit={form.handleSubmit(onSubmit)}>
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
                        (name === "currentPassword" && hasChanged) || name === "newEmail"
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden pt-2">
                        <Input
                          type={type}
                          label={label}
                          eyeVisibleCondition={passwordVisible}
                          disabled={name === "currentPassword" && !hasChanged}
                          onEyeClick={() => setPasswordVisible((prev) => !prev)}
                          className="disabled:cursor-default"
                          labelClassName="!bg-[#1b1b1b]"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormControl>

                  <FormMessage>
                    {formRootErrors?.rateLimit ? formRootErrors.rateLimit.message : ""}
                  </FormMessage>
                </FormItem>
              )}
            />
          ))}
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
          <DialogHeader className="mb-2">
            <DialogTitle className="text-center uppercase">Update email address</DialogTitle>
          </DialogHeader>

          <OTPVerification
            email={form.getValues("newEmail")}
            purpose={VerificationPurpose.CHANGE_EMAIL}
            onSuccess={onSuccess}
            onBack={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});

ChangeEmailForm.displayName = "ChangeEmailForm";
export default ChangeEmailForm;
