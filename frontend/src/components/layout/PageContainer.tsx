import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
}) => {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-2xl';
      case 'md':
        return 'max-w-4xl';
      case 'lg':
        return 'max-w-5xl';
      case 'xl':
        return 'max-w-6xl';
      case '2xl':
        return 'max-w-7xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-6xl';
    }
  };

  return (
    <div className={`min-h-screen pt-28 pb-20 px-4 sm:px-6 relative ${className}`}>
      <div className="ambient-gradient absolute top-0 inset-x-0 h-[600px] pointer-events-none" />
      <div className={`mx-auto relative z-10 ${getMaxWidth()}`}>{children}</div>
    </div>
  );
};
