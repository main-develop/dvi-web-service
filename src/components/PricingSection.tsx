"use client";

import { BadgeCheck } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { BackgroundGridPattern } from "./ui/background-grid-pattern";
import { Badge } from "./ui/badge";
import { PricingTab } from "./ui/pricing-tabs";
import { useState } from "react";
import NumberFlow, { continuous } from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
import * as motions from "../lib/motion-variants";
import { GlowingBorderEffect } from "./ui/glowing-border-effect";

interface PricingTierProps {
  id: string;
  name: string;
  description: string;
  price: Record<string, number | string>;
  features: string[];
  cta: string;
}

export const tiers: PricingTierProps[] = [
  {
    id: "basic",
    name: "Basic",
    description: "For most individuals",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "No payment credentials required",
      "Limited AI analysis",
      "Up to 7 projects at once",
      "10GB of processing per week",
      "5GB storage",
    ],
    cta: "Get started",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For advanced enthusiasts",
    price: {
      monthly: 35,
      yearly: 25,
    },
    features: [
      "Advanced visualizations",
      "Extended AI analysis limits",
      "Unlimited projects",
      "50GB of processing per week",
      "40GB storage",
    ],
    cta: "Try for free",
  },
  {
    id: "business",
    name: "Business",
    description: "For small companies/startups",
    price: {
      monthly: 90,
      yearly: 70,
    },
    features: [
      "Access to API",
      "24/7 priority support",
      "Early access to new features",
      "Unlimited everything",
    ],
    cta: "Get started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    features: [
      "Custom quote",
      "Flexible terms",
      "Custom service configuration",
      "Support for compliance with privacy laws",
      "Invoicing and billing, volume discounts",
    ],
    cta: "Contact sales",
  },
];

const frequencies = ["monthly", "yearly"];

export const PricingSection = ({
  backgroundGridSquares,
}: {
  backgroundGridSquares: number[][];
}) => {
  const containerVariants = motions.getContainerVariants();
  const itemVariants = motions.getItemVariants(20);
  const [selectedFrequency, setSelectedFrequency] = useState(frequencies[0]);

  return (
    <div className="relative flex px-5 pb-20 sm:flex-row sm:px-22">
      <div className="fade-bottom-mask absolute inset-0">
        <BackgroundGridPattern squares={backgroundGridSquares} />
      </div>

      <motion.div
        className="relative flex w-full flex-col items-center justify-center gap-4"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center justify-center gap-5 rounded-md">
          <motion.h2
            className="matrix-text text-3xl font-bold tracking-[0.04rem] uppercase sm:text-4xl"
            variants={itemVariants}
          >
            Choose your plan
          </motion.h2>

          <motion.p variants={itemVariants} className="sm:w-2xl text-center">
            Check out our Individual, Business, and Enterprise plans, available on a monthly and
            annual subscription basis. Choose the one that suits you best.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="bg-background border-muted mx-auto flex w-fit rounded-md border-2 p-1"
          >
            <GlowingBorderEffect className="hidden sm:block" />

            {frequencies.map((freq) => (
              <PricingTab
                key={freq}
                text={freq}
                selected={selectedFrequency === freq}
                setSelected={setSelectedFrequency}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={motions.getItemInitial()}
              whileInView={motions.getItemAnimate()}
              transition={motions.getItemTransition(index)}
              viewport={{ once: true }}
              className="w-full sm:w-auto"
            >
              <Card
                className={cn(
                  "bg-background text-foreground border-muted relative flex h-auto w-auto flex-col gap-6 border-2 p-6 sm:h-[480px] sm:w-70",
                )}
              >
                <GlowingBorderEffect className="hidden sm:block" />

                <div className="flex flex-row justify-between">
                  <h2 className="flex items-center gap-3 text-lg font-medium uppercase">
                    {tier.name}
                  </h2>

                  <AnimatePresence mode="wait">
                    {["pro", "business"].includes(tier.id) && selectedFrequency === "yearly" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: [0.4, 0, 0.2, 0.9],
                        }}
                      >
                        <Badge className="bg-matrix text-secondary">
                          {(() => {
                            const monthlyTotal = (tier.price.monthly as number) * 12;
                            const yearlyTotal = (tier.price.yearly as number) * 12;
                            const discount = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
                            return `${Math.round(discount)}% off`;
                          })()}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <h3 className="text-muted-foreground text-sm font-medium">{tier.description}</h3>

                <div className="relative h-9">
                  {typeof tier.price[selectedFrequency] === "number" ? (
                    <NumberFlow
                      plugins={[continuous]}
                      format={{
                        style: "currency",
                        currency: "USD",
                        trailingZeroDisplay: "stripIfInteger",
                      }}
                      locales="en-US"
                      value={tier.price[selectedFrequency]}
                      className="text-2xl font-medium"
                      suffix={`${tier.id === "business" ? " / user" : ""} / month`}
                    />
                  ) : (
                    <h1 className="text-2xl font-medium">{tier.price[selectedFrequency]}</h1>
                  )}
                </div>

                <div className="border-t-muted border-1"></div>

                <div className="flex-1 space-y-2">
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li
                        key={index}
                        className={cn(
                          "text-muted-foreground flex items-start gap-2 text-sm font-medium",
                        )}
                      >
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="sm:bg-primary/90 hover:bg-primary/80 cursor-pointer tracking-tight transition-all">
                  {tier.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
