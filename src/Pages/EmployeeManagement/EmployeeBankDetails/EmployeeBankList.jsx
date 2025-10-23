import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";

function EmployeeLanguageList() {
  const [contaEducation, setEducation] = useState([]);
  const { userData } = useAuthStore();
  const org = userData?.organization;
  const [loading, setLoading] = useState(true);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (org?.organization_id) {
      setLoading(true);
      fetchEmployeeConatct(org.organization_id)
        .then((data) => {
          let a = data.employeecontacts;
          let b = a.map((item) => {
            return {
              id: item.employee_contact_id,
              name: `${capitalize(item.employee.first_name)} ${capitalize(item.employee.middle_name || "")} ${capitalize(item.employee.last_name || "")}
🏷️ ${item.employee.employee_code || "N/A"} 
🧑‍💼 ${item.employee.designation?.designation_name}`.trim(),
              description: item.personal_email,
              info: item.personal_phone_no,
            };
          });
          setContact(b);
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [org]);

  let deletecontact = async (id) => {
    try {
      const org_id = org.organization_id;
      const response = await axios.delete(
        `${MAIN_URL}/api/organizations/${org_id}/employee-contact/${id}`
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete  Employee Contact"
      );
    }
  };

  return (
    <Layout1
      loading={loading}
      heading={"Employement Types"}
      btnName={"Add Employement types"}
      Data={types}
      Icons={[
        <FormatAlignJustifyIcon
          sx={{ fontSize: 60, color: "grey.500", mb: 2 }}
        />,
        <FormatAlignJustifyIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />,
      ]}
      messages={[
        "types",
        "employement types",
        "Add Employement types",
        "types",
      ]}
      Route={"/employement/types"}
      setData={setTypes}
    />
  );
}

export default EmployeeLanguageList;
