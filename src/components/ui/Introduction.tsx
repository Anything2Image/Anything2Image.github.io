import React from "react";

export default function Introduction() {
  return (
    <section className="w-full max-w-3xl mx-auto text-center  px-4">
      {/* <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
        🐾 Anything2Image
      </h2> */}
      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
        Ever wondered what your favorite object would look like as an animal?
        <br />
        <span className="text-blue-400 font-semibold">Anything2Image</span> is an AI tool that reimagines everyday items—like stones, toys, or tools—into creative animal forms.
      </p>
      <p className="mt-4 text-gray-400">
        Just upload an image, walk through a few easy steps, and watch as your object transforms into magical, animated art.
      </p>
    </section>
  );
}