import React, { useState } from "react";

interface MultiStepFormProps {
    steps: React.ReactElement[];
    onComplete?: () => void;
    className?: string;
}

export interface StepComponentProps {
    onNext?: () => void;
    onBack?: () => void;
    step?: number;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
    steps,
    onComplete,
    className = "",
}) => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const isLast = currentStep === steps.length - 1;
    const isFirst = currentStep === 0;

    const goNext = () => {
        if (!isLast) setCurrentStep((prev) => prev + 1);
        else if (onComplete) onComplete();
    };

    const goBack = () => {
        if (!isFirst) setCurrentStep((prev) => prev - 1);
    };

    const CurrentStepComponent = React.cloneElement(
        steps[currentStep],
        {
            onNext: goNext,
            onBack: goBack,
            step: currentStep,
        } as StepComponentProps
    );

    return (
        <div className={className}>
            {CurrentStepComponent}
        </div>
    );
};

export default MultiStepForm;
