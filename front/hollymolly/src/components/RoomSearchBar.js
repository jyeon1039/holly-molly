import React, { useState, useRef } from "react";
import RoomGrid from "../components/RoomGrid";
import style from "../styles/styles";
import RoomText from "../components/RoomText";

const RoomSearchBar = (props) => {
  const inputRef = useRef();
  const [clicked, setClicked] = useState(false);
  const onClick = () => {
    setClicked(!clicked);
    alert("방이름은? " + inputRef.current.value);
  };

  return (
    <React.Fragment>
      <RoomGrid
        is_flex_space
        border="2px solid white"
        padding="5px"
        width="410px"
        height="32px"
      >
        <input
          style={styles.input}
          type="text"
          placeholder="입력하세요..."
          ref={inputRef}
        />
        {/* 검색 버튼 */}
        <RoomGrid
          onClick={onClick}
          is_flex_center
          padding="5px"
          width="160px"
          height="32px"
          bg="#FFE600"
        >
          <RoomText bold size="15px" color={style.white}>
            코드로 입장하기
          </RoomText>
        </RoomGrid>
      </RoomGrid>
    </React.Fragment>
  );
};

export default RoomSearchBar;

const styles = {
  input: {
    borderColor: style.white,
    border: "2px solid white",
    borderRadius: "1.5rem",
    color: style.black,
    height: "20px",
    width: "250px",
    fontSize: 15,
  },
};
