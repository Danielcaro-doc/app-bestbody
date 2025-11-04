import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const CloseIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={23}
    fill="none"
    {...props}
  >
    <Circle cx={11.5} cy={11.5} r={11.5} fill="#1A1A1A" />
    <Path
      fill="#D5FF5F"
      d="m9.969 8 1.54 2.819L13.077 8h1.904l-2.302 3.818 2.342 3.818h-1.894l-1.616-2.749-1.6 2.75H8l2.327-3.819L8.06 8h1.909Z"
    />
  </Svg>
)
export default CloseIcon