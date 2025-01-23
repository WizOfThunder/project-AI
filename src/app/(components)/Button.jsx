const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
