const Textarea = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 backdrop-blur-sm focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-200 resize-vertical min-h-[120px] ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Textarea;