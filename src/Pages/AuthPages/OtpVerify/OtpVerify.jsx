import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./OtpVerify.css";
import logo from "../../../Assets/Images/logo.png";
import { MAIN_URL } from "../../../Configurations/Urls";

const OtpVerify = ({ title = "Email Verification" }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const appName = "Your App Name";
  const description =
    "Start your free trial and experience the full power of our platform today.";

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      setMessage("Email not provided.");
      setMessageType("error");
    }
  }, [location.state]);

  console.log("state", location.state);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp?.length < 6) {
      setMessage("Please enter the complete 6-digit OTP.");
      setMessageType("error");
      return;
    }

    if (!email) {
      setMessage("Email is missing.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${MAIN_URL}/api/auth/verified-otp`, {
        email: location.state.email,
        otp: +enteredOtp,
      });
      setMessage("OTP Verified successfully!");
      setMessageType("success");

      const data = await axios.post(
        `${MAIN_URL}/api/application/user/create-userV1`,
        {
          hash_password: location.state.hash_password,
          full_name: location.state.full_name,
          phone_number: location.state.phone,
          country_phone_code: location.state.phone_code,
          email: location.state.email,
        }
      );

      setMessage("Account created successfully!");
      setMessageType("success");
      
     
    //  console.log(location.state.hash_password)

      navigate("/organization-details", {
      state: { application_user_id: data.data.data.application_users_id ,
        hash_password:location.state.hash_password,
        email: location.state.email,
      },
      });
    } catch (error) {

      console.log("error is",error)
      setMessage("Invalid OTP or verification failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainSection position-relative">
      <div className="row g-0">

      
        {/* Left Side - OTP */}

        <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
          <div className="otp-box w-100" style={{ maxWidth: "400px" }}>
            <div className="panel-heading text-center">
              <img
                src={logo}
                className="img-fluid mb-2"
                alt="Logo"
                style={{ width: "100px", height: "auto" }}
              />
              <h1>{title}</h1>
            </div>

            <p>Enter the 6-digit OTP sent to your email</p>
  {location?.state?.otp}
            <form onSubmit={handleSubmit} className="otp-form">
              <div className="otp-inputs mb-3 d-flex justify-content-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input text-center"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={{
                      width: "40px",
                      height: "50px",
                      fontSize: "1.5rem",
                    }}
                  />
                ))}
              </div>

              <input
                type="submit"
                className="btn btn-primary w-100"
                value={loading ? "Verifying..." : "Verify OTP"}
                disabled={loading}
              />
            </form>

            {message && (
              <p
                className={`otp-message mt-3 ${messageType === "success" ? "text-success" : "text-danger"}`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Right Side - From Free Trial Page */}
        <div className="col-md-6 d-none d-md-block">
          <div className="darkBox h-100">
            <div className="DarkPanel text-white p-4 h-100 d-flex flex-column justify-content-center">
              <h1 className="display-5">{appName}</h1>
              <p className="lead">{description}</p>
              <p className="joinedLine mt-3">Join thousands of happy users.</p>
              <h6 className="mt-4 text-light-emphasis">
                &copy; {new Date().getFullYear()} Your Company Name.
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
