import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../Zustand/Store/useAuthStore";
import { MAIN_URL } from "../../../Configurations/Urls";
import TableDataGeneric from "../../../Configurations/TableDataGeneric";
import Layout4 from "../../DataLayouts/Layout4";
import { useAddOrgUrl } from "../Helper";


function CommonList({
  title,
  apiEndpoint,
  addRoute,
  editRouteBase,
  mapResponseToRows,
  tablePrimaryKey = "id",
  tableName = "",
  showAddButton = true,

  extraParams = {},
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userData } = useAuthStore();
   const addorg = useAddOrgUrl();
  const org = userData?.organization;
  const navigate = useNavigate();

  // ✅ Fetch data (generic)
  const fetchData = async (loadingVal = true) => {
    if (!apiEndpoint) return;
    setLoading(loadingVal);
    try {
      const response = await axios.get(`${MAIN_URL}${addorg(apiEndpoint)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // params: {
        //   per_page: "all",
        //   organization_id: org?.organization_id,
        //   ...extraParams,
        // },
      });

    const responseData =
      response?.data?.stages?.data ||
      response?.data?.data ||
      response?.data ||
      [];
      const mappedData = mapResponseToRows
        ? mapResponseToRows(responseData)
        : responseData;

      setData(mappedData);

    } catch (err) {
      console.error(`Error fetching ${title}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount and pagination change
  useEffect(() => {
    if (org?.organization_id) {
      setData([])
      fetchData(true);
    }
  }, [org , apiEndpoint]);

  // ✅ Delete function (generic)
  const deleteFunction = async (id) => {
    try {
      await axios.delete(`${MAIN_URL}${addorg(apiEndpoint)}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchData(false);
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  return (
    <>
      <Layout4
        heading={title}
        Route={addRoute}
        btnName={`Add ${title}`}
        showAddButton={showAddButton}
      />

      <TableDataGeneric
        tableName={tableName || title}
        primaryKey={tablePrimaryKey}
        heading={title}
        data={data}
        loading={loading}
        sortname={tablePrimaryKey}
        Route={editRouteBase}
        mainKey={tablePrimaryKey}
        DeleteFunc={item => deleteFunction(item.id)}
        EditFunc={(item) => navigate(`${editRouteBase}/${item.id}`)}
        token={localStorage.getItem("token")}
      />
    </>
  );
}

export default CommonList;
