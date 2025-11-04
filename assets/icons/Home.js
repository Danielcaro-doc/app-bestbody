import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Home = ({color}) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
  >
    <Path
      fill={color}
      d="M7.264.516a2.167 2.167 0 0 1 2.807 0l6.501 5.525a2.169 2.169 0 0 1 .763 1.651v8.641A1.667 1.667 0 0 1 15.668 18h-2.666a1.667 1.667 0 0 1-1.667-1.667V12a1.334 1.334 0 0 0-1.328-1.333h-2.68a1.334 1.334 0 0 0-1.326 1.333v4.334A1.667 1.667 0 0 1 4.334 18H1.667A1.667 1.667 0 0 1 0 16.333v-8.64A2.167 2.167 0 0 1 .763 6.04L7.264.516Z"
    />
  </Svg>
);

export default Home;
