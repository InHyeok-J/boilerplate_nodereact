import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import { signUpUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";
const Block = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled.form`
  width: 400px;
  display: flex;
  flex-direction: column;
`;

const WaringText = styled.div`
  color: red;
`;
function SignUpPage(props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [waringState, setWaringState] = useState(false);

  const onEmailHandler = useCallback(
    (e) => {
      setEmail(e.target.value);
    },
    [email]
  );
  const onNameHandler = useCallback(
    (e) => {
      setName(e.target.value);
    },
    [email]
  );
  const onPasswordHandler = useCallback(
    (e) => {
      setPassword(e.target.value);
      if (password.length < 4) {
        setWaringState(true);
      } else {
        setWaringState(false);
      }
    },
    [password]
  );
  const onPasswordCheckHandler = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
    },
    [passwordCheck]
  );
  const onSubmitHandler = useCallback((e) => {
    //아래 코드를 해주는 이유는  버튼을 클릭할때마다 리프레쉬가 되기 때문에 그 리프레쉬를 해준다.
    e.preventDefault();
    if (password !== passwordCheck) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    }
    let body = {
      name: name,
      email: email,
      password: password,
    };
    dispatch(signUpUser(body)).then((response) => {
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("Failed to sign up");
      }
    });
  });
  return (
    <Block>
      <Form onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={email} onChange={onEmailHandler}></input>
        <label>Name</label>
        <input type="text" value={name} onChange={onNameHandler}></input>

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={onPasswordHandler}
        ></input>
        {waringState && (
          <WaringText>패스워드는 5자 이상이여야 합니다.</WaringText>
        )}
        <label>Password 확인</label>
        <input
          type="password"
          value={passwordCheck}
          onChange={onPasswordCheckHandler}
        ></input>
        <br />
        <button>Login</button>
      </Form>
    </Block>
  );
}

export default withRouter(SignUpPage);
