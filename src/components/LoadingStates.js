import React from 'react';

export const LoadingSpinner = ({ size = 'large', color = '#6A2EE8', message }) => (
  <div className="flex-1 flex flex-col justify-center items-center p-4">
    <div 
      className={`animate-spin rounded-full border-4 border-t-transparent ${size === 'large' ? 'w-12 h-12' : 'w-8 h-8'}`}
      style={{ borderColor: `${color} transparent transparent transparent` }}
    />
    {message && <p className="mt-3 text-sm text-[#666]">{message}</p>}
  </div>
);

export const SkeletonPlaceholder = ({ width = '100%', height = 16, className }) => (
  <div
    className={`bg-[#E8E8E8] rounded animate-pulse ${className || ''}`}
    style={{ width, height }}
  />
);

export const CardSkeleton = () => (
  <div className="bg-white p-4 rounded-xl mx-4 my-2 shadow-sm">
    <div className="flex flex-row items-center mb-3">
      <SkeletonPlaceholder width={60} height={60} className="rounded-full mr-3" />
      <div className="flex-1">
        <SkeletonPlaceholder width="60%" height={16} className="mb-2" />
        <SkeletonPlaceholder width="40%" height={14} />
      </div>
    </div>
    <SkeletonPlaceholder width="100%" height={1} className="my-3" />
    <SkeletonPlaceholder width="30%" height={14} className="mb-2" />
    <SkeletonPlaceholder width="50%" height={18} />
  </div>
);

export const ListItemSkeleton = () => (
  <div className="bg-white p-4 mx-4 my-1 rounded-xl flex flex-row items-center shadow-sm">
    <SkeletonPlaceholder width={40} height={40} className="rounded-full mr-3" />
    <div className="flex-1">
      <SkeletonPlaceholder width="70%" height={16} className="mb-1.5" />
      <SkeletonPlaceholder width="50%" height={12} />
    </div>
  </div>
);

export const EmptyState = ({ icon, title, message, actionButton, className }) => (
  <div className={`flex-1 flex flex-col justify-center items-center px-8 ${className || ''}`}>
    {icon && <div className="text-6xl mb-4">{icon}</div>}
    <h3 className="text-lg font-bold text-black mb-2 text-center">{title}</h3>
    {message && <p className="text-sm text-[#666] text-center mb-6 leading-5">{message}</p>}
    {actionButton}
  </div>
);
