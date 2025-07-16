import React from 'react'

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-blue-700 font-semibold text-lg">Yükleniyor...</span>
    </div>
  )
}

export default Loading 