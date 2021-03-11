import React, { useCallback, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
const Block = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function LandingPage(props) {
  const onClickHandler = useCallback(() => {
    axios.get("/api/users/logout").then((response) => {
      if (response.data.success) {
        props.history.push("/login");
      } else {
        alert("로그아웃 하는데 실패했습니다.");
      }
    });
  });

  return (
    <Block>
      <h2>시작 페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </Block>
  );
}

export default withRouter(LandingPage);
