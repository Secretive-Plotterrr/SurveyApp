import React from 'react';

const Loading3 = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50 gap-4">
      <div
        className="loader w-[50px] h-[50px] rounded-full bg-blue-500 animate-l5"
        style={{
          '--b': '8px',
          WebkitMask: `
            repeating-conic-gradient(#0000 0deg, #000 1deg 70deg, #0000 71deg 90deg),
            radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)))
          `,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'destination-in',
        }}
      ></div>
      <div className="text-black text-2xl font-bold">
        Checking out for records...
      </div>
    </div>
  );
};

export default Loading3;