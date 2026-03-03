import * as React from "react";

const VercelIcon = ({height = 16, ...props}: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 256 222"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        fill="currentColor"
        {...props}
    >
        <path d="m128 0 128 221.705H0z"/>
    </svg>
);
export default VercelIcon;
