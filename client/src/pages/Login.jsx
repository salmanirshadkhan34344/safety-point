import React, { useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { apiPostWithoutAuth } from "../util/ApiRequest";
import { ENDPOINTS } from "../util/EndPoint";
import { isLoaderState, snakeBarState } from "../util/RecoilStore";
import { useRecoilState } from "recoil";
import { FaEyeSlash } from "react-icons/fa";
import '../scss/Login.scss'
const Login = () => {

  const [isLoaderInfo, setIsLoaderInfo] = useRecoilState(isLoaderState);
  const [snackBarInfo, setSnackBarInfo] = useRecoilState(snakeBarState);

  const [viewPassword, setViewPassword] = useState(false);
  const emailEl = React.useRef(null);
  const passwordEl = React.useRef(null);


  const handleSubmit = (event) => {
    setIsLoaderInfo(true);

    event.preventDefault();
    const body = {
      email: emailEl.current.value,
      password: passwordEl.current.value,
      device_token: "testing",
    };
    apiPostWithoutAuth(
      ENDPOINTS.UserLogin,
      body,
      (res) => {
        const Roles = res.data?.user_details?.role;
        localStorage.setItem("accessToken", res?.data?.token);
        localStorage.setItem("user", JSON.stringify(res?.data?.user_details));
        console.log(res);

        if (Roles === "admin") {
          setSnackBarInfo({
            snackStatus: true,
            snackColor: "bg-success",
            snackMsg: "Successful",
          });
          window.location.href = `/admin/dashboard`;
        }
        if (Roles !== "admin") {
          setIsLoaderInfo(false);
          setSnackBarInfo({
            snackStatus: true,
            snackColor: "bg-danger",
            snackMsg: "admin is not valid",
          });
        }
      },
      (error) => {
        setIsLoaderInfo(false);

        setSnackBarInfo({
          snackStatus: true,
          snackColor: "bg-danger",
          snackMsg: "There is an Error Plz Try Again",
        });
      }
    );
  };

  return (
    <>
      <Container fluid className="login-main-div bg-primary text-white">
        <Container className="login-con-1">
          <Row className="login-con">
            <Col lg="12" md="12">
              <div>
              {/* <img className="logo" src={require('../assets/images/logo.png')}/> */}
                <h1 className="mb-5 bahnschrift-regular">Login</h1>
              </div>

              <Form className="login-form" onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="mb-0 poppins-light">
                      Email address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      ref={emailEl}
                      placeholder="Enter email"
                    />
                  </Form.Group>
                  <div className="position-relative">
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-0 poppins-light">
                        Password
                      </Form.Label>

                      <Form.Control
                        type={viewPassword ? "text" : "password"}
                        name="password"
                        ref={passwordEl}
                        placeholder="Password"
                      />

                      <button
                        onClick={() => setViewPassword(!viewPassword)}
                        className="no-btn-structure show-hide-btn"
                        type="button"
                      >
                        <span className="text-primary">
                          <FaEyeSlash />
                        </span>
                      </button>
                    </Form.Group>
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn btn-secondary"
                  >
                    Login
                  </Button>
               </Form>

            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default Login;
