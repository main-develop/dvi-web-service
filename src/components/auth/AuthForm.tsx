import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { getItemVariants } from "@/src/utils/get-motion-variants";
import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { passwordRequirements } from "@/src/lib/zod-schemas/auth";
import { Spinner } from "../ui/spinner";
import { zxcvbnOptions, ZxcvbnResult } from "@zxcvbn-ts/core";
import * as zxcvbnCommon from "@zxcvbn-ts/language-common";
import * as zxcvbnEn from "@zxcvbn-ts/language-en";
import { passwordResult, ZxcvbnStrength } from "@/src/utils/zxcvbn-strength";

interface AuthFormProps<T extends FieldValues> {
  form: UseFormReturn<T, unknown, T>;
  fields: { name: keyof T; type: React.HTMLInputTypeAttribute; label: string }[];
  onSubmit: (data: T) => void;
  submitButtonText: string;
  formDescription?: string;
  showHints?: boolean;
  children?: React.ReactNode;
}

zxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommon.dictionary,
    ...zxcvbnEn.dictionary,
  },
});

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

  const passwordFieldName = useMemo(
    () =>
      fields.find(({ name }) => ["password", "newPassword"].includes(name as string))?.name as
        | Path<T>
        | undefined,
    [fields],
  );

  const watchedPassword = passwordFieldName ? form.watch(passwordFieldName) : undefined;

  const watchedPasswordResult = useMemo<ZxcvbnResult | null>(() => {
    if (watchedPassword) return passwordResult(watchedPassword);
    return null;
  }, [watchedPassword]);

  const handleFormSubmit = form.handleSubmit(async (data: T) => {
    if (
      showHints &&
      passwordFieldName &&
      watchedPasswordResult &&
      watchedPasswordResult?.score <= 1
    ) {
      form.setError(passwordFieldName, {
        type: "custom",
        message: "Password is too weak",
      });
      form.setFocus(passwordFieldName);
      return;
    }

    onSubmit(data);
  });

  return (
    <motion.div
      variants={getItemVariants(0, 0, 0.7)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <Form {...form}>
        {formDescription && <p className="text-center text-sm">{formDescription}</p>}

        <form noValidate onSubmit={handleFormSubmit} className="space-y-6">
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
                          type={type}
                          label={label}
                          eyeVisibleCondition={visibleFields[name as string]}
                          onEyeClick={() =>
                            setVisibleFields((prev) => ({
                              ...prev,
                              [name]: !prev[name as string],
                            }))
                          }
                          onFocus={
                            showPasswordHints ? () => setFocusedField(name as string) : undefined
                          }
                          {...field}
                          onBlur={() => setFocusedField(null)}
                        />
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
                        <div className="overflow-hidden">
                          <ZxcvbnStrength password={field.value as string} />
                          <ul className="space-y-1 text-sm">
                            {passwordRequirements.map(({ message, regex }, id) => {
                              const isMet = regex.test(field.value || "");

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
                          {(form.formState.errors.password ||
                            form.formState.errors.newPassword) && <FormMessage />}
                        </div>
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
            {formRootErrors?.rateLimit ? formRootErrors.rateLimit.message : ""}
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
