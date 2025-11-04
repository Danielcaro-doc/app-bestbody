import React from 'react';
import Svg, { Path,Circle } from 'react-native-svg';

const PencilEdit = (props) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Circle cx={15} cy={15} r={14.5} fill="#1A1A1A" stroke="#fff" />
    <Path
      fill="#D5FF5F"
      d="M21.05 11.558a.692.692 0 0 0 0-.98l-1.625-1.625a.692.692 0 0 0-.98 0l-1.277 1.271 2.604 2.605M8.75 18.649v2.604h2.604l7.682-7.688-2.605-2.605L8.75 18.65Z"
    />
  </Svg>
);

export default PencilEdit;

