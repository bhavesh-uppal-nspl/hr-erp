import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import logo from "../../Assets/Images/logo.png";
import { MAIN_URL } from "../../Configurations/Urls";
import { getIndustry } from "../../Apis/Organization-apis";
import {
  fetchGeneralCountries,
  fetchOwnershipTypeCategory,
} from "../../Apis/OrganizationLocation";
import "./OrganizationDetails.css";
import { MenuItem, TextField, CircularProgress } from "@mui/material";
import Login from "../AuthPages/Login/Login";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import OrganizationData from "../Orgnaization/Organisation/OrganizationData";

const OrganizationDetails = () => {
  const location = useLocation();
  return (
    <div className="mainSection position-relative">
      <div className="row g-0">
        {/* Left Side */}
        <div className="col-md-6">
          <div className="whiteBox">
            <div className="panel text-center">
              <img
                src={logo}
                className="img-fluid mb-2"
                alt="Logo"
                style={{ maxWidth: "44px", height: "auto" }}
              />
              <h2>Organization Details</h2>
            </div>
            <div className="panel-body">
              <OrganizationData
                data={{
                  organization_name: "",
                  organization_short_name: "",
                  general_country_id: "",
                  general_state_id: "",
                  application_user_id: location?.state?.application_user_id,
                  hash_password: location?.state?.hash_password,
                  email: location?.state?.email,
                  general_business_ownership_type_category_id: "",
                  general_industry_id: "",
                  general_city_id: "",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6 d-none d-md-block">
          <div className="darkBox">
            <div className="DarkPanel text-white p-4">
              <h1>Welcome to Our Platform!</h1>
              <p>
                Unlock features, collaborate, and grow your business with us.
              </p>
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

export default OrganizationDetails;
