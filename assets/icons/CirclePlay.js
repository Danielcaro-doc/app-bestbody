import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CirclePlay = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={34}
    fill="none"
    {...props}
  >
    <Path
      fill="#1A1A1A"
      d="M17 0a17 17 0 1 0 0 34 17 17 0 0 0 0-34Z"
    />
    <Path
      fill="#D6FD67"
      d="M24.853 18.537A1.947 1.947 0 0 0 25.615 17a1.926 1.926 0 0 0-.762-1.537A36.8 36.8 0 0 0 14.684 9.97l-.67-.235a2.125 2.125 0 0 0-2.805 1.714 42.606 42.606 0 0 0 0 11.1 2.125 2.125 0 0 0 2.806 1.714l.67-.235a36.797 36.797 0 0 0 10.168-5.492Z"
    />
  </Svg>
);

export default CirclePlay;
