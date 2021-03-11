import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";
const Block = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

function LoginPage(props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailHandler = useCallback(
    (e) => {
      setEmail(e.target.value);
    },
    [email]
  );
  const onPasswordHandler = useCallback(
    (e) => {
      setPassword(e.target.value);
    },
    [password]
  );
  const onSubmitHandler = useCallback((e) => {
    //아래 코드를 해주는 이유는  버튼을 클릭할때마다 리프레쉬가 되기 때문에 그 리프레쉬를 해준다.
    e.preventDefault();

    let body = {
      email: email,
      password: password,
    };
    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        props.history.push("/");
      } else {
        alert("Error");
      }
    });
  });

  return (
    <Block>
      <Form onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={email} onChange={onEmailHandler}></input>

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={onPasswordHandler}
        ></input>
        <br />
        <button>Login</button>
      </Form>
    </Block>
  );
}

export default withRouter(LoginPage);
