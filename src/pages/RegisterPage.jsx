import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Eye } from "react-feather";
import { EyeOff } from "react-feather";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => register(e, credentials)}>
          <div className="field--wrapper">
            <label>Username:</label>
            <input
              required
              type="text"
              name="username"
              placeholder="Enter your username..."
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
          </div>

          <div className="field--wrapper">
            <label>Email:</label>
            <input
              required
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />
          </div>

          <div className="field--wrapper">
            <label>Password:</label>
            <div className="relative">
              <input
                required
                type={isShowPassword ? "text" : "password"}
                name="password1"
                placeholder="Enter password..."
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password1: e.target.value })
                }
              />
              {isShowPassword ? (
                <Eye
                  className="eye--icon"
                  onClick={() => setIsShowPassword(false)}
                />
              ) : (
                <EyeOff
                  className="eyeOff--icon"
                  onClick={() => setIsShowPassword(true)}
                />
              )}
            </div>
          </div>

          <div className="field--wrapper">
            <label>Password again:</label>
            <div className="relative">
              <input
                required
                type={isShowPassword ? "text" : "password"}
                name="password2"
                placeholder="Enter password again..."
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password2: e.target.value })
                }
              />
              {isShowPassword ? (
                <Eye
                  className="eye--icon"
                  onClick={() => setIsShowPassword(false)}
                />
              ) : (
                <EyeOff
                  className="eyeOff--icon"
                  onClick={() => setIsShowPassword(true)}
                />
              )}
            </div>
          </div>

          <div className="field--wrapper">
            <input
              type="submit"
              value="Register"
              className="btn btn--lg btn--main"
            />
          </div>
        </form>

        <p>
          You had an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
