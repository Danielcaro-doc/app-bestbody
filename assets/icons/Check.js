import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Check = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      fill="#D5FF5F"
      d="M4.267 11 0 6.604l1.944-2.003 2.323 2.4L11.055 0 13 2.003 4.267 11Z"
    />
  </Svg>
);

export default Check;
