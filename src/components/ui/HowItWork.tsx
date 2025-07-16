import HowItWorksImg from "/howitwork.jpg"; // adjust the path as needed

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full max-w-6xl mx-auto px-4 py-16 text-white"
    >
      <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>

      {/* Large Image */}
      <div className="w-full mb-10">
        <img
          src={HowItWorksImg}
          alt="How it works diagram"
          className="w-full max-h-[700px] object-contain rounded-2xl shadow-2xl mx-auto"
        />
      </div>

      {/* Step-by-step Description */}
      <div className="space-y-4 text-lg text-gray-300 leading-relaxed px-4 sm:px-8 lg:px-16">
        <p className="text-center max-w-3xl mx-auto">
          <strong>Anything2Image</strong> uses the <strong>Shape2Animal</strong> pipeline to turn object shapes into creative animal art while preserving the original photo’s feel.
        </p>
        <ul className="list-disc list-inside max-w-4xl mx-auto space-y-3">
          <li>
            <strong>Segmentation:</strong> Detect the object using Grounding DINO and generate a precise mask with SAM.
          </li>
          <li>
            <strong>Prompt Generation:</strong> Gemini 2.5 understands the shape and suggests animals (e.g., owl, penguin, koala).
          </li>
          <li>
            <strong>Depth Extraction:</strong> Extracts depth using ControlNet to guide 3D-aware image generation.
          </li>
          <li>
            <strong>Image Generation:</strong> SDXL inpainting redraws the shape as the selected animal, matching the object's form.
          </li>
          <li>
            <strong>Blending:</strong> The generated animal is merged into the original image using 50% opacity inside the masked region for natural results.
          </li>
        </ul>
      </div>
    </section>
  );
}