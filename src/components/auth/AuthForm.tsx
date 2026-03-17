import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { passwordRequirements } from "@/src/lib/zod-schemas/auth";
import { Spinner } from "../ui/spinner";

interface AuthFormProps<T extends FieldValues> {
  form: UseFormReturn<T, unknown, T>;
  fields: { name: keyof T; type: React.HTMLInputTypeAttribute; label: string }[];
  onSubmit: (data: T) => void;
  submitButtonText: string;
  formDescription?: string;
  showHints?: boolean;
  children?: React.ReactNode;
}

export default function AuthForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitButtonText,
  formDescription,
  showHints,
  children,
}: AuthFormProps<T>) {
  const [visibleFields, setVisibleFields] = useState<{ [key: string]: boolean }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRootErrors = form.formState.errors.root;

  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <Form {...form}>
        {formDescription && <p className="text-center text-sm">{formDescription}</p>}

        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map(({ name, type, label }) => {
            const showPasswordHints =
              ["password", "newPassword"].includes(name as string) && showHints;

            return (
              <FormField
                key={name as string}
                control={form.control}
                name={name as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={
                            type === "password" && visibleFields[name as string] ? "text" : type
                          }
                          label={label}
                          onFocus={
                            showPasswordHints ? () => setFocusedField(name as string) : undefined
                          }
                          {...field}
                          onBlur={() => setFocusedField(null)}
                        />

                        {type === "password" && (
                          <Button
                            type="button"
                            variant="ghost"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() =>
                              setVisibleFields((prev) => ({
                                ...prev,
                                [name]: !prev[name as string],
                              }))
                            }
                            className={cn(
                              "hover:text-muted-foreground text-muted-foreground/60 absolute",
                              "inset-y-2.5 right-2 flex size-1 items-center justify-center rounded-none",
                              "bg-background hover:bg-background transition-all duration-300",
                            )}
                          >
                            {visibleFields[name as string] ? <EyeOff /> : <Eye />}
                          </Button>
                        )}
                      </div>
                    </FormControl>

                    {showPasswordHints ? (
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-600 ease-in-out",
                          focusedField === name
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <ul className="space-y-1 overflow-hidden text-sm">
                          {passwordRequirements.map(({ message, regex }, id) => {
                            const isMet = regex.test(field.value);

                            return (
                              <li
                                key={id}
                                className={cn(
                                  "flex items-center gap-2 transition-colors duration-400",
                                  isMet ? "text-matrix/70" : "text-muted-foreground/60",
                                )}
                              >
                                {isMet ? <Check size={15} /> : <X size={15} />}

                                <span>{message}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
            );
          })}

          {children}

          <FormMessage className="!my-[13px]">
            {formRootErrors?.clientError ? formRootErrors.clientError.message : ""}
          </FormMessage>

          <Button
            type="submit"
            className="w-full tracking-tight transition-all duration-400"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Spinner /> : submitButtonText}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
