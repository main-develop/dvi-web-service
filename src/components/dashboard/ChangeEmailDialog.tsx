import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { changeEmailSchema, ChangeEmailSchema } from "@/src/lib/zod-schemas/user";
import { sendChangeEmailRequest } from "@/src/api/user-requests";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";
import OTPVerification from "../ui/otp-verification";
import { VerificationPurpose } from "@/src/api/auth-requests";

interface ChangeEmailFieldProps {
  name: "newEmail" | "currentPassword";
  type: React.HTMLInputTypeAttribute;
  label: string;
}

const formFields: ChangeEmailFieldProps[] = [
  { name: "newEmail", type: "email", label: "New Email" },
  { name: "currentPassword", type: "password", label: "Current Password" },
];

export default function ChangeEmailDialog() {
  const { refreshUser } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setTimeout(() => setCurrentStep(0), 1000);
      form.reset();
    }
  };

  const onSuccess = async () => {
    await refreshUser();
    onOpenChange(false);
  };

  const form = useForm<ChangeEmailSchema>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "", currentPassword: "" },
    shouldFocusError: false,
  });
  const formRootErrors = form.formState.errors.root;

  const onSubmit = async (data: ChangeEmailSchema) => {
    const response = await sendChangeEmailRequest(data);

    if (response.ok) {
      setCurrentStep(1);
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

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => onOpenChange(open)}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-14 rounded-sm transition-all duration-300">
          Edit
        </Button>
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
              <DialogTitle>Update email address</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form className="mt-4 space-y-3" noValidate onSubmit={form.handleSubmit(onSubmit)}>
                {formFields.map(({ name, type, label }) => (
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
          <OTPVerification
            email={form.getValues("newEmail")}
            purpose={VerificationPurpose.CHANGE_EMAIL}
            onSuccess={onSuccess}
            onBack={() => setCurrentStep(0)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
