import SparkleIcon from "../icons/SparkleIcon";

const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-float text-purple-400/50"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${10 + Math.random() * 20}s`,
          transform: `scale(${Math.random() * 0.5 + 0.5})`,
        }}
      >
        <SparkleIcon />
      </div>
    ))}
  </div>
);

export default FloatingParticles; 