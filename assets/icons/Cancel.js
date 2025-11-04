import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Cancel = (props) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    fill="none"
    {...props}
  >
    <Path
      fill="#D5FF5F"
      fillRule="evenodd"
      d="M2.822.203c2.444-.27 4.912-.27 7.356 0a2.95 2.95 0 0 1 2.604 2.571c.29 2.476.29 4.976 0 7.452a2.95 2.95 0 0 1-2.604 2.571c-2.444.27-4.912.27-7.356 0a2.95 2.95 0 0 1-2.605-2.572 32.012 32.012 0 0 1 0-7.45A2.943 2.943 0 0 1 2.821.204m.89 3.511a.593.593 0 0 1 .837 0L6.5 5.664l1.952-1.949a.593.593 0 1 1 .837.837L7.338 6.5l1.951 1.948a.591.591 0 0 1-.837.836L6.5 7.336 4.548 9.284a.592.592 0 1 1-.837-.836L5.662 6.5 3.711 4.552a.591.591 0 0 1 0-.837Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default Cancel;
