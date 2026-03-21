export function SparkleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0v-1H3a1 1 0 010-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17.5 7.512a1 1 0 01.576 1.765l-2.507 2.085.788 3.322a1 1 0 01-1.504 1.09L12 13.682l-2.853 2.092a1 1 0 01-1.504-1.09l.788-3.322-2.507-2.085a1 1 0 01.576-1.765l3.354-.312 1.179-3.456A1 1 0 0112 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
