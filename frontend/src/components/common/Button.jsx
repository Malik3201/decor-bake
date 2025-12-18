import { memo, forwardRef } from 'react';

const variants = {
  primary: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:shadow-pink-200 active:scale-[0.98]',
  secondary: 'bg-white text-pink-600 border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 active:scale-[0.98]',
  outline: 'bg-transparent text-pink-600 border-2 border-pink-500 hover:bg-pink-50 active:scale-[0.98]',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-pink-600 active:scale-[0.98]',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg active:scale-[0.98]',
  success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:from-green-600 hover:to-green-700 hover:shadow-lg active:scale-[0.98]',
  glass: 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 active:scale-[0.98]',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-xl',
};

const ButtonComponent = forwardRef(function ButtonComponent({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}, ref) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Left Icon */}
      {leftIcon && !loading && (
        <span className="mr-2 -ml-0.5">{leftIcon}</span>
      )}
      
      {/* Children */}
      {children}
      
      {/* Right Icon */}
      {rightIcon && (
        <span className="ml-2 -mr-0.5">{rightIcon}</span>
      )}
    </button>
  );
});

export const Button = memo(ButtonComponent);
Button.displayName = 'Button';

// Icon Button variant
const IconButtonComponent = forwardRef(function IconButtonComponent({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}, ref) {
  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const variantClasses = variants[variant] || variants.ghost;
  const sizeClasses = iconSizes[size] || iconSizes.md;

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export const IconButton = memo(IconButtonComponent);
IconButton.displayName = 'IconButton';
