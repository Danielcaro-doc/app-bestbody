import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Off = (props) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#D5FF5F"
      d="M8.566 0v11.566h2.868V0H8.566ZM2.928 2.928A9.97 9.97 0 0 0 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10a9.97 9.97 0 0 0-2.928-7.072l-2.015 2.015a7.152 7.152 0 1 1-10.115 0L2.929 2.928Z"
    />
  </Svg>
);

export default Off;
