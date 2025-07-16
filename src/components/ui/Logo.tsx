const Logo = ({ currentStep }: { currentStep: number }) => {
  const stepColors: { [key: number]: string } = {
    1: "from-blue-400 to-cyan-400",
    2: "from-green-400 to-emerald-400",
    3: "from-yellow-400 to-orange-400",
    4: "from-pink-400 to-rose-400",
    5: "from-teal-400 to-cyan-400",
    6: "from-purple-400 to-indigo-400",
    7: "from-orange-400 to-red-400",
  };

  return (
    <div className="text-center mb-8">
      <div className="relative inline-block">
        <div
          className={`absolute -inset-2 bg-gradient-to-r ${stepColors[currentStep]} opacity-20 blur-2xl rounded-full animate-pulse`}
        ></div>

        <h1
          className={`relative py-2 text-5xl md:text-6xl font-black bg-gradient-to-r ${stepColors[currentStep]} bg-clip-text text-transparent leading-loose`}
        >
          Anything2Image
        </h1>
      </div>

      <p className="relative mt-2 text-lg text-gray-300 font-medium">
        Transform{" "}
        <span
          className={`py-1 font-bold bg-gradient-to-r ${stepColors[currentStep]} bg-clip-text text-transparent leading-loose`}
        >
          anything
        </span>{" "}
        into magical art
      </p>
    </div>
  );
};

export default Logo;
