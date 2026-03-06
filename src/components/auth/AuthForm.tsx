import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { getTextLink } from "@/src/utils/get-text-link";

interface AuthFormProps<T extends FieldValues> {
  form: UseFormReturn<T, unknown, T>;
  fields: { name: keyof T; type: React.HTMLInputTypeAttribute; label: string }[];
  onSubmit: (data: T) => void;
  submitButtonText: string;
  headerText: string;
  paragraphText?: string[];
  children?: React.ReactNode;
}

export function AuthForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitButtonText,
  headerText,
  paragraphText,
  children,
}: AuthFormProps<T>) {
  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="text-foreground relative w-full max-w-sm space-y-8 p-8"
    >
      <h2 className="matrix-text text-center text-3xl font-bold uppercase">{headerText}</h2>
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
                    <Input type={type} label={label} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {children}
          <Button type="submit" className="w-full">
            {submitButtonText}
          </Button>
        </form>
      </Form>
      {paragraphText && (
        <p className="text-muted-foreground text-center text-sm">
          {paragraphText[0]} {getTextLink(paragraphText[1], paragraphText[2])}
        </p>
      )}
    </motion.div>
  );
}
