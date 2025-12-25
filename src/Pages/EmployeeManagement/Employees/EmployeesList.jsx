"use client"

import { useCallback, useEffect, useState, useMemo, useRef } from "react"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline"
import CakeIcon from "@mui/icons-material/Cake"
import axios from "axios"
import useAuthStore from "../../../Zustand/Store/useAuthStore"
import toast from "react-hot-toast"
import PeopleIcon from "@mui/icons-material/People"
import { MAIN_URL } from "../../../Configurations/Urls"
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom"
import TableDataGeneric from "../../../Configurations/TableDataGeneric"
import Layout4 from "../../DataLayouts/Layout4"
import { operatorRequiresValue } from '../../../Components/filters/operators';

const DEFAULT_COLUMNS = [
  {
    field: "employee_code",
    label: "Emp Code",
    visible: true,
    width: 150,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "name",
    label: "Name",
    visible: true,
    width: 200,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "department",
    label: "Department",
    visible: true,
    width: 180,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
  {
    field: "designation",
    label: "Designation",
    visible: true,
    width: 180,
    filterable: true,
    sortable: true,
    pinned: "none",
    required: false,
  },
]

function EmployeeList({ mode }) {
  const { userData } = useAuthStore()
  const org = userData?.organization

  const [employee, setemployee] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const { id } = useParams()
  const fromDashboard = location.state?.fromDashboard || false
  const [searchParams, setSearchParams] = useSearchParams()

  const [paginationData, setPaginationData] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  })

  const [tableConfig, setTableConfig] = useState(null)
  const [configColumns, setConfigColumns] = useState(DEFAULT_COLUMNS)
  const [loadingConfig, setLoadingConfig] = useState(true)

  const fetchControllerRef = useRef(null)
  const hasInitializedURL = useRef(false)
 

  // Initialize URL parameters with defaults on mount
  useEffect(() => {
    if (hasInitializedURL.current) return

    const currentParams = new URLSearchParams(searchParams)
    let needsUpdate = false

    if (!currentParams.has("page")) {
      currentParams.set("page", "1")
      needsUpdate = true
    }

    if (!currentParams.has("pageSize")) {
      currentParams.set("pageSize", "10")
      needsUpdate = true
    }

    if (!currentParams.has("sortBy")) {
      currentParams.set("sortBy", "employee_code")
      needsUpdate = true
    }

    if (!currentParams.has("sortOrder")) {
      currentParams.set("sortOrder", "desc")
      needsUpdate = true
    }

    if (needsUpdate) {
      setSearchParams(currentParams, { replace: true })
    }

    hasInitializedURL.current = true
  }, [])

  // // Build query params from URL
  // const buildQueryParamsFromURL = useMemo(() => {
  //   const params = {}
  //   params.page = Number.parseInt(searchParams.get("page"), 10) || 1
  //   params.pageSize = Number.parseInt(searchParams.get("pageSize"), 10) || 10

  //   const search = searchParams.get("search")
  //   if (search) params.search = search

  //   const sortBy = searchParams.get("sortBy")
  //   const sortOrder = searchParams.get("sortOrder")
  //   if (sortBy) {
  //     params.sortBy = sortBy
  //     params.sortOrder = sortOrder || "asc"
  //   }

  //   searchParams.forEach((value, key) => {
  //     if (key.startsWith("filter_") && value) {
  //       const filterKey = key.replace("filter_", "")
  //       params[filterKey] = value
  //     }
  //   })

  //   return params
  // }, [searchParams])

  // Fetch employees with filters - FIXED
  const fetchEmployeesWithFilters = useCallback(async () => {
    if (!org?.organization_id) return

    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort()
    }

    fetchControllerRef.current = new AbortController()

    setLoading(true)
    try {
      // Build filters array from URL params
      const filters = []
      const processedFields = new Set() // Track processed fields to avoid duplicates
      let filterIndex = 0 // Track filter index
     
      searchParams.forEach((value, key) => {
        // Skip operator and logic params - they'll be processed with their field
        if (key.endsWith("_operator") || key.endsWith("_logic")) return
       
        if (key.startsWith("filter_")) {
          const field = key.replace("filter_", "")
         
          // Skip if already processed
          if (processedFields.has(field)) return
          processedFields.add(field)
         
          // Get operator from URL (e.g., filter_employee_code_operator=contains)
          const operatorKey = `filter_${field}_operator`
          const operator = searchParams.get(operatorKey) || 'contains' // Default to contains
         
          // Check if operator requires a value
          const requiresValue = operatorRequiresValue(operator)
         
          // Include filter if:
          // 1. Operator doesn't require value (today, this_week, this_month, is_null, is_not_null)
          // 2. OR value exists
          if (!requiresValue || value) {
            // For operators that don't require values, set value to null
            let filterValue = requiresValue ? value : null
           
            // Convert comma-separated string to array for operators that need arrays
            if (requiresValue && filterValue) {
              if (operator === 'equals' || operator === 'not_equals') {
                // Split by comma and trim whitespace, then convert to lowercase
                filterValue = filterValue.split(',').map(v => v.trim().toLowerCase())
              } else if (operator === 'between' || operator === 'not_between') {
                // Split by comma and trim whitespace for range operators
                filterValue = filterValue.split(',').map(v => v.trim())
              }
            }
           
            filters.push({
              field: field,
              operator: operator,
              value: filterValue
            })
           
            filterIndex++ // Increment index for next filter
          }
        }
      })

      // Handle general search
      const search = searchParams.get("search")
      if (search) {
        filters.push({
          field: 'employee_code',
          operator: 'contains',
          value: search
        })
      }

      const requestBody = {
        filters: filters,
        page: Number.parseInt(searchParams.get("page"), 10) || 1,
        pageSize: Number.parseInt(searchParams.get("pageSize"), 10) || 10,
        sort: {
          field: searchParams.get("sortBy") || "employee_id",
          direction: searchParams.get("sortOrder") || "desc"
        }
      }

      const response = await fetch(
        `${MAIN_URL}/api/organizations/${org.organization_id}/employee/filters`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: fetchControllerRef.current.signal,
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
       // const filteredEmployees = result.data.filter((item) => item.employment_status !== "Exited")
        setemployee(result.data)

        if (result.pagination) {
          // Backend may return 'limit' instead of 'pageSize'
          const pageSize = result.pagination.pageSize || result.pagination.limit || 10;
          const requestedPage = Number.parseInt(searchParams.get("page"), 10) || 1;
         
          setPaginationData({
            page: result.pagination.page || requestedPage, // Use requested page if backend doesn't return it
            pageSize: pageSize,
            total: result.pagination.total || 0,
            totalPages: result.pagination.totalPages || 1,
            hasNext: result.pagination.hasNext || false,
            hasPrev: result.pagination.hasPrev || false,
          })
        }
      } else {
        setemployee([])
        setPaginationData({
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        })
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted")
        return
      }
      console.error("Error fetching employees:", err)
      toast.error("Failed to fetch employees")
      setemployee([])
      setPaginationData({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      })
    } finally {
      setLoading(false)
    }
  }, [org?.organization_id, searchParams])

  // Load table configuration once
  useEffect(() => {
    const loadTableConfiguration = async () => {
      if (!org?.organization_id) {
        setLoadingConfig(false)
        return
      }

      try {
        const configRes = await fetch(`${MAIN_URL}/api/general-datagrids`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (configRes.ok) {
          const configResponse = await configRes.json()
          const datagrids = configResponse.datagrids || []
          const orgKey = `Employees_grid_${org.organization_id}`
          const savedConfig = datagrids.find((dg) => dg.datagrid_key === orgKey)

          if (savedConfig?.datagrid_default_configuration) {
            const serverCfg = savedConfig.datagrid_default_configuration
            setTableConfig(serverCfg)

            if (serverCfg?.columns?.length > 0) {
              const processedColumns = serverCfg.columns
                .map((col) => {
                  const label = typeof col.label === "string" ? col.label.trim().toLowerCase() : ""
                  if (label === "name" || col.field === "Name") {
                    return { ...col, field: "name", label: "Name" }
                  }
                  return col
                })
                .filter((col, idx, arr) => col.field !== "name" || arr.findIndex((c) => c.field === "name") === idx)
                .filter((col) => !["first_name", "middle_name", "last_name"].includes(col.field))

              const hasEmployeeName = processedColumns.some((c) => c.field === "name")
              const finalColumns = hasEmployeeName
                ? processedColumns
                : [
                    {
                      field: "name",
                      label: "Name",
                      visible: true,
                      width: 200,
                      filterable: true,
                      sortable: true,
                      pinned: "none",
                      required: false,
                    },
                    ...processedColumns,
                  ]

              setConfigColumns(finalColumns)
            } else {
              setConfigColumns(DEFAULT_COLUMNS)
            }
          } else {
            setConfigColumns(DEFAULT_COLUMNS)
          }
        }
      } catch (error) {
        console.error("Error loading table configuration:", error)
        setConfigColumns(DEFAULT_COLUMNS)
      } finally {
        setLoadingConfig(false)
      }
    }

    loadTableConfiguration()
  }, [org?.organization_id])

  // Fetch employees when URL params change
  useEffect(() => {
    if (org?.organization_id && !loadingConfig && hasInitializedURL.current) {
      fetchEmployeesWithFilters()
    }

    return () => {
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort()
      }
    }
  }, [org?.organization_id, loadingConfig, searchParams, fetchEmployeesWithFilters])

  const deleteemployee = useCallback(
    async (id) => {
      try {
        const org_id = org.organization_id
        await axios.delete(`${MAIN_URL}/api/organizations/${org_id}/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.href = "/login"
          toast.error("Session Expired!")
        }
      }
    },
    [org],
  )

  const navigate = useNavigate()

  const onclickRow = useCallback(
    (item) => {
      const params = new URLSearchParams(searchParams)
      navigate(`/organization/employee/employee-details/employee-profile?id=${item.employee_id}&${params.toString()}`)
    },
    [navigate, searchParams],
  )

  const handleDelete = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${MAIN_URL}/api/organizations/${org?.organization_id}/employee/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return Promise.resolve()
      } catch (error) {
        console.error("Delete failed:", error)
        return Promise.reject(error)
      }
    },
    [org?.organization_id],
  )

  const handleEdit = useCallback(
    (item) => {
      navigate(`/organization/employee/employee-details/edit/${item.employee_id || item.id}`)
    },
    [navigate],
  )

  const carddata = useMemo(
    () => [
      { key: "profile_image_url", type: "photo" },
      { key: "name", type: "String" },
      { key: "designation", type: "String" },
    ],
    [],
  )

  const icons = useMemo(
    () => [
      {
        key: "exitToAppIcon",
        element: <ExitToAppIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />,
      },
      {
        key: "viewHeadlineIcon",
        element: <ViewHeadlineIcon color="primary" />,
      },
      {
        key: "cakeIcon",
        element: <CakeIcon sx={{ color: "red" }} />,
      },
      {
        key: "peopleIcon",
        element: <PeopleIcon sx={{ color: "primary" }} />,
      },
    ],
    [],
  )

  const messages = useMemo(
    () => [
      "Employee details",
      "Employee details",
      "Add Employee",
      "Employee, Deleting This Employee will delete its Entire data from Employees Record of this Organization Permanently",
    ],
    [],
  )


       const handleShow = useCallback(
    (item) => {
      navigate(`/organization/employee/employee-details/view/${item.employee_id}`)
    },
    [navigate],
  )


  return (
    <>
      <Layout4
        loading={loading}
        delete_action={"EMPLOYEE_DELETE"}
        heading={
          <div style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
            Employees
          </div>
        }
        btnName={"Add Employee"}
        onAddBtClick={() => null}
        onEditBtClick={() => null}
        Data={employee}
        Icons={icons}
        messages={messages}
        Route={"/organization/employee/employee-details"}
        setData={setemployee}
        DeleteFunc={deleteemployee}
      />
      {!loadingConfig && (
        <>
          {fromDashboard ? (
            <TableDataGeneric
              tableName="Employees"
              primaryKey="employee_id"
              heading="Employees"
              data={employee}
              sortname={"name"}
              showActions={false}
              CardData={carddata}
              Route="/organization/employee/employee-details"
              DeleteFunc={handleDelete}
              EditFunc={handleEdit}
              handleShow={handleShow}
              token={localStorage.getItem("token")}
              configss={configColumns}
              onclickRow={onclickRow}
              linkType={"Name"}
              paginationData={paginationData}
              {...(tableConfig && { config: tableConfig })}
            />
          ) : (
            <TableDataGeneric
              tableName="Employees"
              primaryKey={"employee_id"}
              recordKey={"employee_code"}
              recordLabel={"Employee Code"}
              heading="Employees"
              data={employee}
              sortname={"name"}
              showActions={true}
              CardData={carddata}
              Route="/organization/employee/employee-details"
              DeleteFunc={handleDelete}
              EditFunc={handleEdit}
              handleShow={handleShow}
              onclickRow={onclickRow}
              token={localStorage.getItem("token")}
              linkType={"name"}
              configss={configColumns}
              paginationData={paginationData}
              {...(tableConfig && { config: tableConfig })}
            />
          )}
        </>
      )}
    </>
  )
}

export default EmployeeList
