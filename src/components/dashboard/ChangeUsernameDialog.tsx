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
import { changeUsernameSchema, ChangeUsernameSchema } from "@/src/lib/zod-schemas/user";
import { sendChangeUsernameRequest } from "@/src/api/user-requests";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";

export default function ChangeUsernameDialog() {
  const { refreshUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      form.reset({ username: "" });
    }
  };

  const form = useForm<ChangeUsernameSchema>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: { username: "" },
    shouldFocusError: false,
  });
  const formRootErrors = form.formState.errors.root;

  const onSubmit = async (data: ChangeUsernameSchema) => {
    const response = await sendChangeUsernameRequest(data);

    if (response.ok) {
      await refreshUser();
      onOpenChange(false);
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

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => onOpenChange(open)}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-14 rounded-sm transition-all duration-300">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Set a new username</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="mt-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" label="Username" {...field} />
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
                className="w-[84px] transition-all duration-300"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
