import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../Configurations/Urls";
import { useAddOrgUrl } from "./Helper";

const convertToLaravelDateTime = (input) => {
  if (!input) return null;
  const date = new Date(input);
  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export default function useFormHandler({
  baseUrl,
  initialData,
  validateForm,
  successMessages,
  redirectPath,
  fetchDependencies = [],
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = id ? "edit" : "add";
  const { userData } = useAuthStore();

 const addorg = useAddOrgUrl();

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData({
      organization_id: userData?.organization?.organization_id || "",
      ...initialData,
    });
  }, [initialData]);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchData = async () => {
    if (mode === "add") return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${MAIN_URL}${addorg(baseUrl)}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) setFormData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, ...fetchDependencies]);

  // ========== HANDLERS ==========
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    if (name == "country_id") {
      setFormData((prev) => ({ ...prev, state_id: "", city_id: "" }));
      setFormErrors((prev) => ({ ...prev, state_id: "", city_id: "" }));
    }
    if (name == "state_id") {
      setFormData((prev) => ({ ...prev, city_id: "" }));
      setFormErrors((prev) => ({ ...prev, city_id: "" }));
    }
  };

  const handleChangeImage = (key, file) => {
    setFormData((prev) => ({ ...prev, [key]: file }));
    setFormErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [key]: file }));
      setFormErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleRemoveFile = (key) => {
    setFormData((prev) => ({ ...prev, [key]: null }));
  };

  const handlePreview = (file) => {
    const url = file instanceof File ? URL.createObjectURL(file) : `${file}`;
    window.open(url, "_blank");
  };

  const handleSubmit = async () => {
    if (!validateForm(formData, setFormErrors)) {
      toast.error("Please fix the validation errors.");
      return;
    }

    const token = localStorage.getItem("token");
    const organization_entity_id =
      userData?.organization?.entities?.organization_entity_id || null;

    setBtnLoading(true);

    try {
      const processedFormData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (key.endsWith("_datetime") && value) {
            acc[key] = convertToLaravelDateTime(value);
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const hasFile = Object.values(processedFormData).some(
        (value) => value instanceof File || value instanceof Blob
      );

      let payload;
      let headers = { Authorization: `Bearer ${token}` };

      if (hasFile) {
        payload = new FormData();

        Object.entries({
          ...processedFormData,
          organization_entity_id,
        }).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            payload.append(key, value);
          }
        });

        if (mode === "edit") {
          payload.append("_method", "PUT");
        }

        headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = { ...processedFormData, organization_entity_id };
      }

      if (mode === "edit") {
        await axios.put(`${MAIN_URL}${addorg(baseUrl)}/${id}`, payload, { headers });
        toast.success(successMessages.update);
      } else {
        await axios.post(`${MAIN_URL}${addorg(baseUrl)}`, payload, { headers });
        toast.success(successMessages.add);
      }

      navigate(redirectPath);
    } catch (err) {
      if (err.response?.status === 422) {
        toast.error("Please fix the validation errors.");
        setFormErrors(err.response.data.errors || {});
      } else {
        console.log("error is ", err)
        toast.error("Operation failed");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  return {
    id,
    mode,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    loading,
    btnLoading,
    handleSubmit,
    userData,
    handleChange,
    handleChangeImage,
    handleFileChange,
    handleRemoveFile,
    handlePreview,
  };
}
