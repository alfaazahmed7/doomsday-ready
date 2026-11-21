// import { FcProgressBar } from 'react-icons/fc';

export function ProgressBar({
  watchedCount,
  totalCount
}: {
  watchedCount: number;
  totalCount: number;
}) {
  const percentage = (watchedCount / totalCount) * 100;
  const roundedPercentage = Math.round(percentage);

  return (
    <div className="space-y-2">
      <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-width duration-300 ease-out"
          style={{ width: `${roundedPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{watchedCount} of {totalCount} movies watched</span>
        <span>{roundedPercentage}%</span>
      </div>
    </div>
  );
}