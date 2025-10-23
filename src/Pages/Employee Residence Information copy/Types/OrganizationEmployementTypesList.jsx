import React, { useEffect, useState } from "react";
import Layout1 from "../../DataLayouts/Layout1";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

function OrganizationEmployementTypesList() {

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setTypes([
        { id: 1, name: "Type Name", description: "Type Description" },
        { id: 2, name: "Type Name", description: "Type Description" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);


  return (
    <Layout1
      loading={loading}
      heading={"Employement Types"}
      btnName={"Add Employement types"}
      Data={types}
      Icons={[
        <FormatAlignJustifyIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
        <FormatAlignJustifyIcon color="primary" />,
        <NextWeekIcon sx={{ color: "text.secondary" }} />]
      }
      messages={[
        "types",
        "employement types",
        "Add Employement types",
        "types"
      ]}
      Route={"/employement/types"}
      setData={setTypes}
    />

  );
}

export default OrganizationEmployementTypesList;
