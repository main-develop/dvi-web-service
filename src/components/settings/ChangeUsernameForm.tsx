import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeUsernameSchema, ChangeUsernameSchema } from "@/src/lib/zod-schemas/user";
import { sendChangeUsernameRequest } from "@/src/api/user-requests";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";

export interface ChangeUsernameFormRef {
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

interface Props {
  onDirtyChange: (dirty: boolean) => void;
}

const ChangeUsernameForm = forwardRef<ChangeUsernameFormRef, Props>(({ onDirtyChange }, ref) => {
  const { user, refreshUser } = useAuth();
  const currentUsername = user?.username ?? "";

  const form = useForm<ChangeUsernameSchema>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: { username: currentUsername },
    shouldFocusError: false,
  });
  const formRootErrors = form.formState.errors.root;

  const watchedUsername = useWatch({
    control: form.control,
    name: "username",
  });
  const hasChanged = watchedUsername !== currentUsername;

  useEffect(() => {
    onDirtyChange(hasChanged);
  }, [hasChanged]);

  useEffect(() => {
    if (user) {
      form.reset({ username: user.username });
    }
  }, [user]);

  const onSubmit = async (data: ChangeUsernameSchema) => {
    const response = await sendChangeUsernameRequest(data);

    if (response.ok) {
      await refreshUser();
    } else {
      const responseType = response.data.type;
      const error = response.data.errors[0];

      if (error.attr === "new_username") {
        form.setError("username", { type: responseType, message: error.detail });
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
      resetForm: () => form.reset({ username: currentUsername }),
    }),
    [currentUsername],
  );

  return (
    <Form {...form}>
      <form className="mt-6 w-full" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" label="Username" {...field} labelClassName="!bg-[#1b1b1b]" />
              </FormControl>

              <FormMessage>
                {formRootErrors?.rateLimit ? formRootErrors.rateLimit.message : ""}
              </FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
});

ChangeUsernameForm.displayName = "ChangeUsernameForm";
export default ChangeUsernameForm;
