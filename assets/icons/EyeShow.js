import React from 'react';
import Svg, { Path } from 'react-native-svg';

const EyeShow = ({color}) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={14}
    fill="none"
    {...props}
  >
    <Path
      fill="#1A1A1A"
      d="M6.781 7a1.969 1.969 0 1 1 3.938 0A1.969 1.969 0 0 1 6.78 7Z"
    />
    <Path
      fill="#1A1A1A"
      fillRule="evenodd"
      d="M0 7c0 1.435.372 1.917 1.116 2.884C2.6 11.812 5.09 14 8.75 14c3.66 0 6.15-2.188 7.634-4.116C17.128 8.918 17.5 8.434 17.5 7c0-1.435-.372-1.917-1.116-2.884C14.9 2.188 12.41 0 8.75 0 5.09 0 2.6 2.188 1.116 4.116.372 5.084 0 5.566 0 7Zm8.75-3.281a3.281 3.281 0 1 0 0 6.562 3.281 3.281 0 0 0 0-6.562Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default EyeShow;
