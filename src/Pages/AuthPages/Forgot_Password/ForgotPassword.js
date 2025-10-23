import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../../Assets/Images/logo.png";
import {MAIN_URL } from "../../../Configurations/Urls";

function ForgotPassword({
  title = "Forgot Password",
  appName = "Your App Name",
  description,
}) {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    let formErrors = {};
    setErrors({});

    if (!email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Invalid email format";
    }

    if (Object.keys(formErrors)?.length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${MAIN_URL}/api/auth/forgot-password`, { email },  { headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
      toast.success(res.data.message);
      setOtpSent(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    let formErrors = {};
    setErrors({});

    if (!enteredOtp) {
      formErrors.otp = "OTP is required";
    } else if (!/^[0-9]{6}$/.test(enteredOtp)) {
      formErrors.otp = "Invalid OTP format";
    }

    if (Object.keys(formErrors)?.length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${MAIN_URL}/api/auth/verified-otp`, {
        email,
        otp: +enteredOtp,
      });
      toast.success(res.data.message || "OTP verified!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to verify OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainSection position-relative">
      <div className="row g-0">
        <div className="col-md-6">
          <div className="whiteBox">
            <div className="panel panel-default">
              <div className="panel-heading text-center">
                <img src={logo} className="img-fluid mb-2" alt="Logo" />
                <h2>{title}</h2>
              </div>

              {!otpSent ? (
                <div className="panel-body">
                  <form onSubmit={sendOtp}>
                    <div className="form-group mb-3">
                      <input
                        placeholder="Enter Your Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary w-100"
                      value={loading ? "Sending..." : "Send OTP"}
                      disabled={loading}
                    />
                  </form>
                </div>
              ) : (
                <div className="panel-body">
                  <form onSubmit={verifyOtp}>
                    <div className="form-group mb-3">
                      <input
                        placeholder="Enter Received OTP"
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className={`form-control ${
                          errors.otp ? "is-invalid" : ""
                        }`}
                      />
                      {errors.otp && (
                        <div className="invalid-feedback">{errors.otp}</div>
                      )}
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary w-100"
                      value={loading ? "Verifying..." : "Verify OTP"}
                      disabled={loading}
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side branding panel */}
        <div className="col-md-6 d-none d-md-block">
          <div className="darkBox">
            <div className="DarkPanel text-white p-4">
              <h1>{appName}</h1>
              <p>
                {description ||
                  "A powerful and flexible solution to manage your system efficiently. From user access to real-time reporting, everything is centralized and streamlined for a better experience."}
              </p>
              <p className="joinedLine mt-3">
                Trusted by thousands of users to manage their workflows.
              </p>
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

export default ForgotPassword;
