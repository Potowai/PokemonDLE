import * as React from "react";

export function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="11" y="10" width="2" height="6" rx="1" fill="currentColor" />
      <rect x="11" y="7" width="2" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
