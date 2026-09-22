function LoadingSpinner({ label = "Loading...", size = "md" }) {
  const sizeClass = size === "sm" ? "h-4 w-4 border-2" : "h-10 w-10 border-4";

  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 text-gray-600" role="status" aria-live="polite">
      <span className={`${sizeClass} animate-spin rounded-full border-gray-300 border-t-blue-600`} aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
