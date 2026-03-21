import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
};

const ToolIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, color = "currentColor", className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-hidden="true"
        {...props}
      >
        <path d="M8.24 9.09c0 .07-.04.23-.23.29l-.98.27c-.85.23-1.49.87-1.72 1.72l-.26.96c-.06.22-.23.24-.31.24-.08 0-.25-.02-.31-.24l-.26-.97c-.23-.84-.88-1.48-1.72-1.71l-.97-.26c-.21-.06-.23-.24-.23-.31 0-.08.02-.26.23-.32l.98-.26c.84-.24 1.48-.88 1.71-1.72l.26-.95.02-.07c.07-.17.23-.2.29-.2.06 0 .23.02.29.18l.28 1.03c.23.84.88 1.48 1.72 1.72l.97.26.03.02c.2.08.21.26.21.32Z" />
        <path d="M21.15 6.04a1.73 1.73 0 0 0 0-2.46 1.73 1.73 0 0 0-2.46 0l-1.35 1.35 2.46 2.46 1.35-1.35Z" />
        <path d="M3.27 18.85a1.86 1.86 0 0 0 0 2.6 1.86 1.86 0 0 0 2.6 0l7.59-7.59-2.6-2.6-7.59 7.59Z" />
        <path d="m20.84 11.43-1.51-1.51.77-.77c.2-.2.31-.46.31-.74 0-.28-.11-.55-.31-.74l-3.04-3.04a1.05 1.05 0 0 0-1.49 0l-.77.77-1.51-1.51c-1.43-1.43-3.44-2.1-5.43-1.81a1.06 1.06 0 0 0-.86.72c-.13.38-.03.81.26 1.09l4.53 4.53-1.14 1.14a1.05 1.05 0 0 0 0 1.49l3.04 3.04c.2.2.46.31.74.31.28 0 .55-.11.74-.31l1.14-1.14 4.53 4.53c.29.29.71.38 1.09.26.38-.13.66-.41.72-.81.29-2-.39-4.01-1.81-5.43Z" />
      </svg>
    );
  },
);

ToolIcon.displayName = "ToolIcon";

export default ToolIcon;
