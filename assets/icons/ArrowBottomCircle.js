import React from 'react';
import Svg, { Circle, Path } from "react-native-svg"

const ArrowBottomCircle = (props) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}
  >
    <Circle
      cx={12.5}
      cy={12.5}
      r={12.5}
      fill="#1A1A1A"
      transform="rotate(90 12.5 12.5)"
    />
    <Path
      fill="#D5FF5F"
      d="M13.554 16.887a.904.904 0 0 1-1.278 0l-4.512-4.512a.904.904 0 0 1 1.278-1.277l3.874 3.875 3.875-3.872a.904.904 0 0 1 1.278 1.277l-4.512 4.512-.003-.003Z"
    />
  </Svg>
);

export default ArrowBottomCircle;
