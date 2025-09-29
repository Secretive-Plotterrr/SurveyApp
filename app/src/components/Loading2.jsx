import React from 'react';

const Loading2 = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50 gap-4 sm:gap-6">
      <div
        className="loader w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-blue-500 animate-l5"
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
      <div className="text-black text-lg sm:text-xl md:text-2xl font-bold text-center px-4">
        Checking out for outstanding records...
      </div>
    </div>
  );
};

export default Loading2;