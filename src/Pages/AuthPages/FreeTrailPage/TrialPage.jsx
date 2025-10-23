import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../../Assets/Images/logo.png";
import axios from "axios";
import { MAIN_URL } from "../../../Configurations/Urls";
import { Eye, EyeOff } from "lucide-react";
import { fetchGeneralCountries, fetchGeneralCountriesall } from "../../../Apis/OrganizationLocation";
import SelectWithImage from "../../../Components/Inputs/SelectWithImage";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

const FreeTrialPage = ({
  title = "Start Free Trial",
  appName = "Your App Name",
  description,
}) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(null);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [formErrors, setFormErrors] = useState("");

  const [showConflictModal, setShowConflictModal] = useState(false); // ⬅️ NEW STATE

  const navigate = useNavigate();

  useEffect(() => {
    fetchGeneralCountriesall()
      .then((data) => {
        const formatted = data.countries.map((item) => ({
          name: item.country_name,
          code: item.country_code,
          phone_code: item.country_phone_code,
        }));
        setCountries(formatted);
        setCountryCode(formatted.find((item) => item.code === "IN"));
      })
      .catch((err) => setFormErrors(err.message));
  }, []);

  useEffect(() => {
    document.body.style.overflow = showConflictModal ? "hidden" : "auto";
  }, [showConflictModal]);

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    if (!fullName.trim()) {
      formErrors.fullName = "Full Name is required";
      isValid = false;
    }

    if (!email) {
      formErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      formErrors.email = "Invalid email format";
      isValid = false;
    }


    if (!password) {
      formErrors.password = "Password is required";
      isValid = false;
    } else if (password?.length < 8) {
      formErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    } else {
      const parsed = parsePhoneNumberFromString(phone, countryCode?.code);
      if (!parsed || !parsed.isValid()) {
        formErrors.phone = "Enter a valid phone number";
        isValid = false;
      } else {
        setPhone(parsed.nationalNumber);
      }
    }

    if (!agree) {
      formErrors.agree = "You must agree to the Terms of Service";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        email: email,
        full_name: fullName,
        hash_password: password,
        phone: phone,
        country: `${countryCode.name}`,
        phone_code: `${countryCode.phone_code}`,
      };

      let res = await axios.post(`${MAIN_URL}/api/auth/create-user`, {
        email,
      });

      navigate("/otp-verify", { state: { ...payload, otp: res.data.otp } });
    } catch (error) {
      if (error.response && error.response.data) {
        const { errors, message, status, data } = error.response;

        if (status === 409 && data.message === "User already Exist.") {
          setShowConflictModal(true);
          setErrors((prev) => ({ ...prev, email: "Email already in use" }));
        } else if (errors) {
          setErrors(errors);
        } else {
          toast.error(message || "Registration failed.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
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
                <img
                  src={logo}
                  className="img-fluid mb-2"
                  alt="Logo"
                  style={{ maxWidth: "150px", height: "auto" }}
                />
                <h2>{title}</h2>
              </div>
              <div className="panel-body">
                <form
                  onSubmit={handleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="form-group mb-3">
                    <input
                      placeholder="Full Name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <input
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group mb-1 position-relative">
                    <input
                      placeholder="Create a secure password"
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
                  <div className="form-text mb-2 text-[5px] text-gray-300">
                    Minimum 8 characters, with at least one number or symbol.
                  </div>

                  <div className="form-group mb-3 d-flex">
                    <SelectWithImage
                      value={countryCode}
                      error={false}
                      options={countries}
                      optionkey={"phone_code"}
                      onChange={(e, val) => setCountryCode(val)}
                      width={"60%"}
                      minWidth="20px"
                      disabled={false}
                      searchKeys={["name", "phone_code"]}
                    />
                    <input
                      type="tel"
                      placeholder="Enter Phone Number"
                      value={phone}
                      style={{ height: "50px" }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d{0,15}$/.test(val)) {
                          setPhone(val);
                        }
                      }}
                      className="form-control"
                    />
                  </div>
                  {errors.phone && (
                    <div className="invalid-feedback d-block">
                      {errors.phone}
                    </div>
                  )}

                  <small className="text-muted mb-3 d-block">
                    Number used for alerts or account recovery
                  </small>

                  <div className="form-check mb-3">
                    <input
                      className={`form-check-input ${errors.agree ? "is-invalid" : ""}`}
                      type="checkbox"
                      checked={agree}
                      onChange={() => setAgree(!agree)}
                      id="termsCheck"
                    />
                    <label className="form-check-label" htmlFor="termsCheck">
                      I agree to the <Link to="/terms">Terms of Service</Link>{" "}
                      and <Link to="/privacy">Privacy Policy</Link>.
                    </label>
                    {errors.agree && (
                      <div className="invalid-feedback">{errors.agree}</div>
                    )}
                  </div>

                  <input
                    type="submit"
                    className="btn btn-primary w-40 mt-1"
                    value={loading ? "Submitting..." : "Continue"}
                    disabled={loading}
                  />

                  <div className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary">
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6 d-none d-md-block">
          <div className="darkBox h-100 d-flex align-items-center justify-content-center">
            <div
              className="DarkPanel text-white p-4 w-100"
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <h1 className="mb-3">{appName}</h1>
              <p className="mb-4">
                {description ||
                  "Start your free trial and experience the full power of our platform today."}
              </p>
              <p className="joinedLine mb-3">Join thousands of happy users.</p>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="form-control"
                  style={{ height: "45px", borderRadius: "6px" }}
                />
              </div>
              <button
                className="btn btn-light w-100"
                style={{
                  borderRadius: "6px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Handle User
              </button>

              <h6 className="mt-4 text-light-emphasis small">
                &copy; {new Date().getFullYear()} Your Company Name.
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Email Already Exists Modal */}
      {showConflictModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Email Already Registered</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConflictModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  This email is already registered. Would you like to log in instead or
                  continue registration?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowConflictModal(false);
                    navigate("/login");
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowConflictModal(false);
                    navigate("/email-register", { state: { email } });
                  }}
                >
                  Continue Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeTrialPage;
