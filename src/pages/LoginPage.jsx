import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Eye } from "react-feather";
import { EyeOff } from "react-feather";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => login(e, credentials)}>
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
                name="password"
                placeholder="Enter password..."
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
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
              value="Login"
              className="btn btn--lg btn--main"
            />
          </div>
        </form>

        <p>
          Dont have an account?
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
}
