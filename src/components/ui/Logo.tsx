const Logo = ({ currentStep }: { currentStep: number }) => {
  const stepColors: { [key: number]: string } = {
    1: "from-blue-400 to-cyan-400",
    2: "from-green-400 to-emerald-400",
    3: "from-yellow-400 to-orange-400",
    4: "from-pink-400 to-rose-400",
    5: "from-purple-400 to-indigo-400",
  };

  return (
    <div className="text-center mb-8">
      <div className="relative inline-block">
        <div
          className={`absolute -inset-2 bg-gradient-to-r ${stepColors[currentStep]} opacity-20 blur-2xl rounded-full animate-pulse`}
        ></div>
        {/* FIX: Removed trailing spaces to ensure perfect centering */}
        <h1
          className={`relative text-5xl md:text-6xl font-black bg-gradient-to-r ${stepColors[currentStep]} bg-clip-text text-transparent`}
        >
          Anything2Image
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-300 font-medium">
        Transform{" "}
        <span
          className={`font-bold bg-gradient-to-r ${stepColors[currentStep]} bg-clip-text text-transparent`}
        >
          anything
        </span>{" "}
        into magical art
      </p>
    </div>
  );
};

export default Logo; 