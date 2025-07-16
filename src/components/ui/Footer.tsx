import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Project Info */}
        <div>
          <h3 className="font-semibold mb-2">Project</h3>
          <p>Anything2Image</p>
          <a
            href="https://github.com/your-repo-url"
            className="text-blue-400 hover:underline mt-1 block"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="font-semibold mb-2">Team Members</h3>
          <ul className="space-y-1">
            <li>22120082 - Trần Quốc Duy</li>
            <li>22120406 - Võ Anh Tuấn</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p>Emails:</p>
          <ul className="space-y-1 mt-1 text-blue-400">
            <li>
              <a href="mailto:22120082@student.hcmus.edu.vn">22120405@student.hcmus.edu.vn</a>
            </li>
            <li>
              <a href="mailto:22120406@student.hcmus.edu.vn">22120406@student.hcmus.edu.vn</a>
            </li>
          </ul>
        </div>

        {/* Institution */}
        <div>
          <h3 className="font-semibold mb-2">Institution</h3>
          <p>Trường Đại học Khoa học Tự nhiên – VNUHCM</p>
          <p className="mt-1">Course: Thiết kế phần mềm</p>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10">
        © 2025 Anything2Image Team. All rights reserved.
      </div>
    </footer>
  );
}
