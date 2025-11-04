import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Boock = (props) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={12}
    fill="none"
    {...props}
  >
    <Path
      fill="#1A1A1A"
      d="M1.5 0a.873.873 0 0 0-.285.045C.63.165.165.63.045 1.215 0 1.305 0 1.395 0 1.5v8.25A2.247 2.247 0 0 0 2.25 12h8.25v-1.5H2.25c-.42 0-.75-.33-.75-.75S1.83 9 2.25 9h8.25V.75c0-.42-.33-.75-.75-.75H9v4.5L7.5 3 6 4.5V0H1.5Z"
    />
  </Svg>
);

export default Boock;
