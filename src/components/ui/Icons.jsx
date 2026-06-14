import React from 'react';

const baseSvgProps = (size, className) => ({
  xmlns: "http://www.w3.org/2000/svg",
  width: size || 18,
  height: size || 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: className || ""
});

export const LayoutDashboard = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="10" rx="1" />
    <rect width="7" height="5" x="3" y="14" rx="1" />
  </svg>
);

export const User = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const FileText = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

export const ArrowLeftRight = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="m16 3 5 5-5 5" />
    <path d="M21 8H3" />
    <path d="m8 21-5-5 5-5" />
    <path d="M3 16h18" />
  </svg>
);

export const ArrowUpRight = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export const ArrowDownLeft = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <line x1="17" y1="7" x2="7" y2="17" />
    <polyline points="17 17 7 17 7 7" />
  </svg>
);

export const Percent = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

export const HelpCircle = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const Settings = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const ChevronDown = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ChevronLeft = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRight = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ShieldCheck = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

export const UserIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const LogOutIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const LockIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const MailIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const EyeIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export const LoaderIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M21 12a9 9 0 1 1-6.21-8.56" />
  </svg>
);

export const AlertTriangle = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const ShieldAlert = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const Search = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const Hourglass = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <path d="M5 2h14" />
    <path d="M5 22h14" />
    <path d="M19 2v4c0 1.38-1.13 2.5-2.5 2.5L12 12l-4.5-3.5C6.13 8.5 5 7.38 5 6V2" />
    <path d="M12 12l4.5 3.5c1.37 0 2.5 1.12 2.5 2.5v4H5v-4c0-1.38 1.13-2.5 2.5-2.5L12 12z" />
  </svg>
);

export const XIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const CrosshairIcon = ({ size, className }) => (
  <svg {...baseSvgProps(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="23" />
    <line x1="1" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="23" y2="12" />
  </svg>
);