const Card = ({
  children,
  className = '',
  hover = true,
  glass = false,
  ...props
}) => {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-200';

  const styles = {
    default: 'bg-white/5 border border-white/10 backdrop-blur-sm',
    glass: 'glass',
    hover: hover ? 'hover:scale-[1.02] hover:shadow-xl' : '',
  };

  return (
    <div
      className={`${baseClasses} ${glass ? styles.glass : styles.default} ${hover ? styles.hover : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;