import React from 'react';
import { Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const Mail = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={19} height={15} fill="none">
    <Path
      fill="#D5FF5F"
      d="M16.034.698H3.048A2.167 2.167 0 0 0 .884 2.862v9.276a2.167 2.167 0 0 0 2.164 2.164h12.986a2.167 2.167 0 0 0 2.165-2.164V2.862A2.167 2.167 0 0 0 16.034.698Zm-.548 3.58L9.921 8.607a.618.618 0 0 1-.76 0l-5.565-4.33a.618.618 0 1 1 .76-.975L9.54 7.335l5.186-4.033a.618.618 0 0 1 .76.976Z"
    />
  </Svg>
);

export default Mail;
