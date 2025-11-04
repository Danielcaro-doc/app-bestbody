import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CalendarIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={8}
    fill="none"
    {...props}
  >
    <Path
      fill="#D5FF5F"
      d="M7.111 1.415v-.082a1.333 1.333 0 1 0-2.667 0h-.888a1.333 1.333 0 0 0-2.667 0v.082A1.332 1.332 0 0 0 0 2.667v4C0 7.402.598 8 1.333 8h5.334C7.402 8 8 7.402 8 6.667v-4a1.332 1.332 0 0 0-.889-1.252Zm-1.778-.082a.444.444 0 0 1 .89 0v.89a.444.444 0 1 1-.89 0v-.89Zm-3.555 0a.444.444 0 1 1 .889 0v.89a.444.444 0 0 1-.89 0v-.89ZM7.11 6.667c0 .245-.199.444-.444.444H1.333a.445.445 0 0 1-.444-.444V4H7.11v2.667Z"
    />
  </Svg>
)
export default CalendarIcon
