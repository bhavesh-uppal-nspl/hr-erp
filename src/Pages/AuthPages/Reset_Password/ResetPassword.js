import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../../Assets/Images/logo.png";
import axios from "axios";
import {MAIN_URL } from "../../../Configurations/Urls";

function ResetPassword({
  title = "Reset Password",
  appName = "Your App Name",
  description,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Please verify OTP again.");
      navigate("/forgot-password");
    }
  }, [email]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!newPassword || newPassword?.length < 6) {
      formErrors.newPassword = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (newPassword !== confirmNewPassword) {
      formErrors.confirmNewPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await axios.post(`${MAIN_URL}/api/auth/reset-password`, {
        email,
        new_password: newPassword,
      });
  
      toast.success(res.data.message || "Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password."
      );
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
              <div className="panel-body">
                <form onSubmit={handleReset}>
                  <div className="form-group mb-3">
                    <input
                      placeholder="Enter New Password"
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`form-control ${
                        errors.newPassword ? "is-invalid" : ""
                      }`}
                    />
                    {errors.newPassword && (
                      <div className="invalid-feedback">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <input
                      placeholder="Confirm New Password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={`form-control ${
                        errors.confirmNewPassword ? "is-invalid" : ""
                      }`}
                    />
                    {errors.confirmNewPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmNewPassword}
                      </div>
                    )}
                  </div>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Reset Password"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right (Info Panel) */}
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

export default ResetPassword;
