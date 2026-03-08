import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AuthFormProps<T extends FieldValues> {
  form: UseFormReturn<T, unknown, T>;
  fields: { name: keyof T; type: React.HTMLInputTypeAttribute; label: string }[];
  onSubmit: (data: T) => void;
  submitButtonText: string;
  formDescription?: string;
  children?: React.ReactNode;
}

export default function AuthForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitButtonText,
  formDescription,
  children,
}: AuthFormProps<T>) {
  const [visibleFields, setVisibleFields] = useState<{ [key: string]: boolean }>({});

  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {formDescription && <p className="text-center text-sm">{formDescription}</p>}

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map(({ name, type, label }) => (
            <FormField
              key={name as string}
              control={form.control}
              name={name as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={type === "password" && visibleFields[name as string] ? "text" : type}
                        label={label}
                        {...field}
                      />
                      {type === "password" && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            setVisibleFields((prev) => ({
                              ...prev,
                              [name]: !prev[name as string],
                            }))
                          }
                          className={cn(
                            "hover:text-muted-foreground text-muted-foreground/60 absolute",
                            "inset-y-0 right-0 flex w-9 items-center justify-center",
                            "transition-all duration-300 hover:bg-transparent",
                          )}
                        >
                          {visibleFields[name as string] ? <EyeOff /> : <Eye />}
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {children}

          <Button type="submit" className="w-full tracking-tight">
            {submitButtonText}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
