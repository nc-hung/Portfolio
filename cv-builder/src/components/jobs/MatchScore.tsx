import React from 'react';

export function MatchScore({ score }: { score: number }) {
  // Config cho SVG Circle
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorCode = 'text-green-500';
  if (score < 50) colorCode = 'text-red-500';
  else if (score < 75) colorCode = 'text-yellow-500';

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Độ Phù Hợp</h3>
      <div className="relative flex items-center justify-center">
        {/* Background Circle */}
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset: 0 }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-gray-100"
          />
          {/* Progress Circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={colorCode}
          />
        </svg>
        <span className={`absolute text-2xl font-bold ${colorCode}`}>
          {score}%
        </span>
      </div>
    </div>
  );
}
