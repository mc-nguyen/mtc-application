import React from 'react';
import './StepIndicator.css';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={index} className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
          <div className="step-circle">{index + 1}</div>
          <div className="step-name">{step.name}</div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;