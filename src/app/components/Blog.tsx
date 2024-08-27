import React from 'react';

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 hidden">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Blog Page</h1>
      <div className="w-3/4 max-w-md mx-auto text-center">
        <svg
          width="400"
          height="200"
          viewBox="0 0 400 200"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="black"
          strokeWidth="2"
        >
          <rect x="10" y="10" width="380" height="180" fill="yellow" />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="24"
            fill="black"
          >
            Page Under Construction
          </text>
        </svg>
        <p className="mt-6 text-gray-600">
          We&apos;re working hard to bring you great content! Please check back soon.
        </p>
      </div>
    </div>
  );
}
