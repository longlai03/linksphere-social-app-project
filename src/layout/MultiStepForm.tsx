import React from "react";

interface MultiStepFormProps {
    steps: React.ReactElement[];
    step: number;
    onNext: () => void;
    onBack: () => void;
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
    step,
    onNext,
    onBack,
    onComplete,
    className = "",
}) => {
    const isLast = step === steps.length - 1;
    const isFirst = step === 0;

    const handleNext = () => {
        if (!isLast) onNext();
        else if (onComplete) onComplete();
    };

    const handleBack = () => {
        if (!isFirst) onBack();
    };

    const CurrentStepComponent = React.cloneElement(steps[step], {
        onNext: handleNext,
        onBack: handleBack,
        step: step,
    } as StepComponentProps);

    return <div className={className}>{CurrentStepComponent}</div>;
};

export default MultiStepForm;
