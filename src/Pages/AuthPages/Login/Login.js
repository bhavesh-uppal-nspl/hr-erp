import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../../Assets/Images/logo.png";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { Eye, EyeOff } from "lucide-react";

function Login({
  title = "User Login",
  appName = "Your App Name",
  description,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if credentials are already saved
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const { isLoggedIn, login, setAccess } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!email) {
      formErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password) {
      formErrors.password = "Password is required";
      isValid = false;
    } else if (password?.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const submitLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (rememberMe) {
      localStorage.setItem("savedEmail", email);
      localStorage.setItem("savedPassword", password);
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }

    setLoading(true);

 
    try {
      const response = await axios.post(`${MAIN_URL}/api/auth/login`, {
        email,
        password_hash:password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setAccess(user?.role?.system_role_name);


        let dd = user.organization.find(
          (item) =>
            item.organization_id ==
            user.user_active_organization.organization_id
        );

        let mm = {
          ...user,
          organization: dd,
        };
        login(mm);
      toast.success("Login successful!");

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("error occoured Please TRy agian Later!");
      }
      if (error.response && error.response.data) {
        const { errors, message } = error.response.data;
        if (errors) {
          toast.error("Validation errors occurred.");
          setErrors(errors);
        } else {
          toast.error("Login failed. Please try Again Later!");
        }
      } 
      else if( error.response.status === 500){
        toast.error("Server error occurred. Please try again later.");
      }
      else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="mainSection position-relative">
      <div className="row g-0">
        {/* Left Side (Form) */}
        <div className="col-md-6">
          <div className="whiteBox">
            <div className="panel panel-default">
              <div className="panel-heading text-center">
                <img src={logo} className="img-fluid mb-2" alt="Logo" />
                <h2>{title}</h2>
              </div>
              <div className="panel-body">
                <form onSubmit={submitLogin}>
                  <div className="form-group mb-3">
                    <input
                      placeholder="Enter Your Email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="form-group mb-3 position-relative">
                    <input
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`form-control pe-5 ${errors.password ? "is-invalid" : ""}`}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute top-50 translate-middle-y"
                      style={{
                        right: "15px",
                        cursor: "pointer",
                        color: "#6c757d",
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="form-check mt-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember Password
                    </label>
                  </div>

                  <input
                    type="submit"
                    className="btn btn-primary w-40"
                    value="Login"
                    disabled={loading}
                  />

                    <input
                    type="submit"
                     onClick={() => navigate("/email-register")}
                    className="btn btn-primary w-40"
                    value="Start Free Trial"
                    disabled={loading}
                  />

                  <div className="mt-3">
                    Forgot Password?{" "}
                    <Link to="/forgot-password" className="text-primary">
                      Forgot Password
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6 d-none d-md-block">
          <div className="darkBox">
            <div className="DarkPanel text-white p-4">
              <h1>{appName}</h1>
              <p>
                {description ||
                  "A powerful and flexible solution to manage your system efficiently."}
              </p>
              <p className="joinedLine mt-3">Trusted by thousands of users.</p>
              <h6 className="mt-4 text-light-emphasis">
                &copy; {new Date().getFullYear()} Your Company Name.
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
