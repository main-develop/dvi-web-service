import { Progress } from "./progress";

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-sm ${index + 1 === currentStep ? "font-bold text-matrix" : "text-muted-foreground"}`}
          >
            Step {index + 1}: {step}
          </div>
        ))}
      </div>
      <Progress value={((currentStep - 1) / (steps.length - 1)) * 100} className="h-2" />
    </div>
  );
}
