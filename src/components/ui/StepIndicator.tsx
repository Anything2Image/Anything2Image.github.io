import React from "react";

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { name: "Upload", icon: "📁", color: "from-blue-500 to-cyan-500" },
    { name: "Select", icon: "🎯", color: "from-green-500 to-emerald-500" },
    { name: "Refine", icon: "🎨", color: "from-yellow-500 to-orange-500" },
    { name: "Choose", icon: "🦁", color: "from-pink-500 to-rose-500" },
    { name: "Result", icon: "✨", color: "from-purple-500 to-indigo-500" },
  ];

  return (
    <div className="flex justify-center items-center w-full mb-12 px-4">
      <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`
                  relative w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold 
                  transition-all duration-500 transform border-2
                  ${
                    isActive
                      ? `bg-gradient-to-r ${step.color} text-white shadow-2xl scale-110 border-white/30 animate-pulse`
                      : isCompleted
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl border-green-400/50"
                      : "bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700"
                  }
                `}
                >
                  {isCompleted ? (
                    <div className="text-2xl">✓</div>
                  ) : isActive ? (
                    <div className="text-2xl">{step.icon}</div>
                  ) : (
                    <div className="text-lg">{step.icon}</div>
                  )}
                  {isActive && (
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.color} opacity-30 blur-xl animate-pulse`}
                    ></div>
                  )}
                </div>
                <p
                  className={`
                  mt-2 text-xs text-center font-medium transition-all duration-300 min-w-0
                  ${
                    isActive
                      ? "text-white font-bold"
                      : isCompleted
                      ? "text-green-400"
                      : "text-gray-500"
                  }
                `}
                >
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                  h-1 w-8 md:w-12 transition-all duration-500 rounded-full
                  ${
                    isCompleted
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
                      : "bg-gray-700"
                  }
                `}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator; 