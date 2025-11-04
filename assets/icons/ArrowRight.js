import React from 'react';
import { Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ArrowRight = (props) => (
  <Svg
    width={11}
    height={9}
    viewBox="0 0 11 9"
    fill="none"
    {...props}
  >
    <Path
      fill="#0CBAED"
      d="M10.818 4.595a.623.623 0 0 0 0-.88L7.293.19a.623.623 0 1 0-.88.881l2.46 2.46H.623a.623.623 0 0 0 0 1.247h8.25l-2.46 2.46a.623.623 0 0 0 .88.882l3.525-3.525Z"
    />
  </Svg>
);

export default ArrowRight;
