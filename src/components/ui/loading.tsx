
import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

export default Loading;
