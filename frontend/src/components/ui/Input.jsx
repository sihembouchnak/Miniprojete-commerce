const Input = ({
  label,
  error,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        <input
          className={`w-full px-4 ${Icon ? 'pl-12' : ''} py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;