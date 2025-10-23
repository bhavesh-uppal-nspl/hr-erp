let FormatDateV1 = (date) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-GB") // dd/mm/yyyy
    : "-";

  return formattedDate.replace(/\//g, "-");
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return "";

  const date = new Date(dateTime);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const Configurations = [
  {
    route: "/training-programs-categories",
    ListProps: {
      title: "Training Program Categories",
      apiEndpoint: "/api/ems/training-programs-categories",
      addRoute: "/training-programs-categories",
      editRouteBase: "/training-programs-categories/edit",
      tablePrimaryKey: "organization_ems_training_program_category_id",
      tableName: "Training Program Categories",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_training_program_category_id,
          training_program_category_name:
            item.training_program_category_name || "-",
          training_program_category_code:
            item.training_program_category_code || "-",
          description: item.description || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          training_program_category_name,
          training_program_category_code,
          description,
        } = formData;

        // --- organization_id ---
        if (!organization_id)
          errors.organization_id = "Organization is required.";
        else if (isNaN(organization_id))
          errors.organization_id = "Organization ID must be a valid number.";

        // --- organization_entity_id (sometimes|nullable|integer) ---
        if (organization_entity_id && isNaN(organization_entity_id))
          errors.organization_entity_id = "Entity ID must be a valid number.";

        // --- training_program_category_name ---
        if (!training_program_category_name?.trim())
          errors.training_program_category_name =
            "Training Program Category name is required.";
        else if (training_program_category_name?.length > 100)
          errors.training_program_category_name =
            "Category name cannot exceed 100 characters.";

        // --- training_program_category_code ---
        if (
          training_program_category_code &&
          training_program_category_code?.length > 10
        )
          errors.training_program_category_code =
            "Category code cannot exceed 10 characters.";

        // --- description ---
        if (description && description?.length > 255)
          errors.description = "Description cannot exceed 255 characters.";

        // --- set and return ---
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/training-programs-categories",
      initialData: {
        organization_entity_id: "",
        training_program_category_name: "",
        training_program_category_code: "",
        description: "",
      },
      successMessages: {
        add: "Training Program Category added!",
        update: "Training Program Category updated!",
      },
      redirectPath: "/training-programs-categories",
      headerProps: {
        addMessage: "Add Training Program Category",
        updateMessage: "Update Training Program Category",
        homeLink: "/training-programs-categories",
        homeText: "Training Program Category",
      },
      Inputs: [
        {
          type: "Text",
          label: "Training Program Category Name *",
          mainKey: "training_program_category_name",
        },
        {
          type: "Text",
          label: "Training Program Category Code (Optional)",
          mainKey: "training_program_category_code",
        },
        {
          type: "MultiRow",
          label: "Description (Optional)",
          mainKey: "description",
        },
      ],
      DataFetchers: [],
    },
  },
  {
    route: "/training-programs",
    ListProps: {
      title: "Training Programs",
      apiEndpoint: "/api/ems/training-programs",
      addRoute: "/training-programs",
      editRouteBase: "/training-programs/edit",
      tablePrimaryKey: "organization_ems_training_program_id",
      tableName: "Training Programs",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_training_program_id,
          category: `${item?.category?.training_program_category_name}` || "-",
          training_program_name: item?.training_program_name || "-",
          training_program_code: item.training_program_code || "-",
          description: item.description || "-",
          duration_in_hours: item.duration_in_hours || "-",
          is_active: item.is_active || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_training_program_category_id,
          training_program_name,
          training_program_code,
          description,
          duration_in_hours,
          is_active,
        } = formData;

        // --- organization_id (required|integer|exists) ---
        if (!organization_id)
          errors.organization_id = "Organization is required.";
        else if (isNaN(organization_id))
          errors.organization_id = "Organization ID must be a valid number.";

        // --- organization_entity_id (sometimes|nullable|integer|exists) ---
        if (organization_entity_id && isNaN(organization_entity_id))
          errors.organization_entity_id = "Entity ID must be a valid number.";

        // --- organization_ems_training_program_category_id (sometimes|nullable|integer|exists) ---
        if (!organization_ems_training_program_category_id)
          errors.organization_ems_training_program_category_id =
            "Training Program Category is required.";
        else if (isNaN(organization_ems_training_program_category_id))
          errors.organization_id =
            "Training Porgram Category ID must be a valid number.";

        // --- training_program_name (required|string|max:150|unique) ---
        if (!training_program_name?.trim())
          errors.training_program_name = "Training Program name is required.";
        else if (training_program_name?.length > 150)
          errors.training_program_name =
            "Training Program name cannot exceed 150 characters.";

        // --- training_program_code (nullable|string|max:20) ---
        if (training_program_code && training_program_code?.length > 20)
          errors.training_program_code =
            "Training Program code cannot exceed 20 characters.";

        // --- description (nullable|string|max:255) ---
        if (description && description?.length > 255)
          errors.description = "Description cannot exceed 255 characters.";

        // --- duration_in_hours (nullable|integer) ---
        if (duration_in_hours && isNaN(duration_in_hours))
          errors.duration_in_hours = "Duration must be a valid number.";

        // --- is_active (sometimes|boolean) ---
        if (
          is_active !== undefined &&
          typeof is_active !== "boolean" &&
          !["true", "false", 1, 0, "1", "0"].includes(is_active)
        )
          errors.is_active = "Active status must be true or false.";

        console.log("errors her eis : ", errors);

        // --- set and return ---
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/training-programs",
      initialData: {
        organization_entity_id: "",
        organization_ems_training_program_category_id: "",
        training_program_name: "",
        training_program_code: "",
        description: "",
        duration_in_hours: "",
        is_active: false,
      },
      successMessages: {
        add: "Training Program added!",
        update: "Training Program updated!",
      },
      redirectPath: "/training-programs",
      headerProps: {
        addMessage: "Add Training Program",
        updateMessage: "Update Training Program",
        homeLink: "/training-programs",
        homeText: "Training Program",
      },
      Inputs: [
        {
          type: "Select",
          label: "Training Program Category *",
          mainKey: "organization_ems_training_program_category_id",
          OptionMainKey: "ProgramCategory",
          menuKey: "organization_ems_training_program_category_id",
          formatValue: (val) => `${val.training_program_category_name}`,
        },
        {
          type: "Text",
          label: "Training Program Name *",
          mainKey: "training_program_name",
        },
        {
          type: "Text",
          label: "Training Program Code (Optional)",
          mainKey: "training_program_code",
        },
        {
          type: "MultiRow",
          label: "Description (Optional)",
          mainKey: "description",
        },
        {
          type: "Number",
          label: "Duration in Hours (Optional)",
          mainKey: "duration_in_hours",
        },
        {
          type: "Checkbox",
          label: "Is Active (Optional)",
          mainKey: "is_active",
        },
      ],
      DataFetchers: [
        {
          name: "ProgramCategory",
          Type: "Fetch",
          link: "/api/ems/training-programs-categories",
        },
      ],
    },

    // ,,, from here
  },
  {
    route: "/students",
    ListProps: {
      title: "Students",
      apiEndpoint: "/api/ems/students",
      addRoute: "/students",
      editRouteBase: "/students/edit",
      tablePrimaryKey: "organization_ems_student_id",
      tableName: "Students",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_student_id,
          country: item?.country?.country_name || "-",
          state: item?.state?.state_name || "-",
          city: item?.city?.city_name || "-",
          first_name: item?.first_name || "-",
          last_name: item.last_name || "-",
          gender: item.gender || "-",
          date_of_birth: item.date_of_birth || "-",
          email: item.email || "-",
          phone: item.phone || "-",
          alternate_phone: item.alternate_phone || "-",
          address: item.address || "-",
          certificate_name: item.certificate_name || "-",
          student_status: item.student_status || "-",
          remarks: item.remarks || "-",
          profile_image_url: item.profile_image_url || "-",
          student_id: item.student_id || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          country_id,
          state_id,
          city_id,
          first_name,
          last_name,
          gender,
          date_of_birth,
          email,
          phone,
          alternate_phone,
          address,
          certificate_name,
          student_status,
          profile_image_url,
          remarks,
        } = formData;

        // --- organization_id (required|integer|exists) ---
        if (!organization_id)
          errors.organization_id = "Organization is required.";
        else if (isNaN(organization_id))
          errors.organization_id = "Organization ID must be a valid number.";

        // --- organization_entity_id (sometimes|nullable|integer) ---
        if (organization_entity_id && isNaN(organization_entity_id))
          errors.organization_entity_id =
            "Organization Entity ID must be a valid number.";

        // --- country_id (sometimes|nullable|integer) ---
        if (country_id && isNaN(country_id))
          errors.country_id = "Country ID must be a valid number.";

        // --- state_id (sometimes|nullable|integer) ---
        if (state_id && isNaN(state_id))
          errors.state_id = "State ID must be a valid number.";

        // --- city_id (sometimes|nullable|integer) ---
        if (city_id && isNaN(city_id))
          errors.city_id = "City ID must be a valid number.";

        // --- first_name (required|string|max:100) ---
        if (!first_name?.trim()) errors.first_name = "First name is required.";
        else if (first_name?.length > 100)
          errors.first_name = "First name cannot exceed 100 characters.";

        // --- last_name (nullable|string|max:50) ---
        if (last_name && last_name?.length > 50)
          errors.last_name = "Last name cannot exceed 50 characters.";

        // --- gender (nullable|in:Male,Female,Other) ---
        if (gender && !["Male", "Female", "Other"].includes(gender))
          errors.gender = "Gender must be Male, Female, or Other.";

        // --- date_of_birth (nullable|date) ---
        if (date_of_birth && isNaN(Date.parse(date_of_birth)))
          errors.date_of_birth = "Date of birth must be a valid date.";

        // --- email (required|string|max:100|unique) ---
        if (!email?.trim()) errors.email = "Email is required.";
        else if (email?.length > 100)
          errors.email = "Email cannot exceed 100 characters.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          errors.email = "Email must be valid.";

        // --- phone (required|string|max:20|unique) ---
        if (!phone?.trim()) errors.phone = "Phone number is required.";
        else if (phone?.length > 20)
          errors.phone = "Phone number cannot exceed 20 characters.";
        else if (!/^[0-9+\-\s()]+$/.test(phone))
          errors.phone = "Phone number contains invalid characters.";

        // --- alternate_phone (nullable|string|max:20) ---
        if (alternate_phone && alternate_phone?.length > 20)
          errors.alternate_phone =
            "Alternate phone cannot exceed 20 characters.";

        // --- address (nullable|string|max:255) ---
        if (address && address?.length > 255)
          errors.address = "Address cannot exceed 255 characters.";

        // --- certificate_name (nullable|string|max:150) ---
        if (certificate_name && certificate_name?.length > 150)
          errors.certificate_name =
            "Certificate name cannot exceed 150 characters.";

        if (!student_status) {
          errors.student_status = "Student Status is required.";
        } else if (
          student_status &&
          !["Active", "Completed", "Dropped", "On Hold"].includes(
            student_status
          )
        )
          errors.student_status =
            "Student status must be one of: Active, Completed, Dropped, or On Hold.";

        // --- profile_image_url (nullable|file|mimes:jpg,jpeg,png|max:2048) ---
        if (profile_image_url) {
          if (
            profile_image_url.size &&
            profile_image_url.size > 2 * 1024 * 1024
          )
            errors.profile_image_url = "Profile image size cannot exceed 2MB.";
          if (
            profile_image_url.type &&
            !["image/jpeg", "image/jpg", "image/png"].includes(
              profile_image_url.type
            )
          )
            errors.profile_image_url =
              "Profile image must be JPG, JPEG, or PNG.";
        }

        // --- remarks (nullable|string) ---
        if (remarks && typeof remarks !== "string")
          errors.remarks = "Remarks must be a valid text.";

        // --- set & return ---
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/students",
      initialData: {
        organization_entity_id: "",
        country_id: "",
        state_id: "",
        city_id: "",
        first_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        email: "",
        phone: "",
        alternate_phone: "",
        address: "",
        certificate_name: "",
        student_status: "",
        remarks: "",
        profile_image_url: "",
        student_id: "",
      },
      successMessages: {
        add: "Student added!",
        update: "Student updated!",
      },
      redirectPath: "/students",
      headerProps: {
        addMessage: "Add Student",
        updateMessage: "Update Student",
        homeLink: "/students",
        homeText: "Student",
      },
      Inputs: [
        {
          type: "Select",
          label: "Country (Optional)",
          mainKey: "country_id",
          OptionMainKey: "Countries",
          menuKey: "general_country_id",
          formatValue: (val) => `${val.country_name}`,
        },
        {
          type: "Select",
          label: "State (Optional)",
          mainKey: "state_id",
          OptionMainKey: "States",
          menuKey: "general_state_id",
          formatValue: (val) => `${val.state_name}`,
        },
        {
          type: "Select",
          label: "City (Optional)",
          mainKey: "city_id",
          OptionMainKey: "Cities",
          menuKey: "general_city_id",
          formatValue: (val) => `${val.city_name}`,
        },

        {
          type: "Text",
          label: "First Name *",
          mainKey: "first_name",
        },
        {
          type: "Text",
          label: "Last Name (Optional)",
          mainKey: "last_name",
        },
        {
          type: "Select",
          label: "Gender (Optional)",
          mainKey: "gender",
          OptionMainKey: "Genders",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Date",
          label: "Date Of Birth (Optional)",
          mainKey: "date_of_birth",
        },
        {
          type: "Text",
          label: "Email *",
          mainKey: "email",
        },
        {
          type: "Text",
          label: "Phone *",
          mainKey: "phone",
        },
        {
          type: "Text",
          label: "Alternate Phone (Optional)",
          mainKey: "alternate_phone",
        },
        {
          type: "MultiRow",
          label: "Address (Optional)",
          mainKey: "address",
        },
        {
          type: "Text",
          label: "Certificate Name (Optional)",
          mainKey: "certificate_name",
        },
        {
          type: "Select",
          label: "Student Status *",
          mainKey: "student_status",
          OptionMainKey: "StudentStatus",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
        {
          type: "Picture",
          label: "Profile Image",
          mainKey: "profile_image_url",
        },
      ],
      DataFetchers: [
        { name: "Countries", Type: "Fetch", link: "/api/general/countries" },
        {
          name: "States",
          Type: "FetchDepend",
          dependKey: "country_id",
          link: "/api/general/countries/${country_id}/states/v1",
        },
        {
          name: "Cities",
          Type: "FetchDepend",
          dependKey: "state_id",
          link: "/api/general/countries/${country_id}/states/${state_id}/cities",
        },
        {
          name: "Genders",
          Type: "NoFetch",
          Options: ["Male", "Female", "Other"],
        },
        {
          name: "StudentStatus",
          Type: "NoFetch",
          Options: ["Active", "Completed", "Dropped", "On Hold"],
        },
      ],
    },
  },
  {
    route: "/students-fees",
    ListProps: {
      title: "Students Fees",
      apiEndpoint: "/api/ems/students-fees",
      addRoute: "/students-fees",
      editRouteBase: "/students-fees/edit",
      tablePrimaryKey: "organization_ems_student_fee_id",
      tableName: "Students Fees",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_student_fee_id,
          admission: `${item?.admission?.admission_number}` || "-",
          student:
            `${item?.student?.first_name} ${item?.student?.last_name}` || "-",
          installment: `${item?.installment?.installment_number}` || "-",
          payment_number: item?.payment_number || "-",
          payment_date: FormatDateV1(item.payment_date) || "-",
          student_currency_code: item.student_currency_code || "-",
          amount_paid_student_currency:
            item.amount_paid_student_currency || "-",
          settlement_currency_code: item.settlement_currency_code || "-",
          amount_received_inr: item.amount_received_inr || "-",
          settlement_date: FormatDateV1(item.settlement_date) || "-",
          gateway_charges: item.gateway_charges || "-",
          forex_difference: item.forex_difference || "-",
          payment_mode: item.payment_mode || "-",
          transaction_reference: item.transaction_reference || "-",
          payment_status: item.payment_status || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_admission_id,
          organization_ems_student_id,
          organization_ems_fee_installment_id,
          payment_number,
          payment_date,

          student_currency_code,
          amount_paid_student_currency,

          settlement_currency_code,
          amount_received_inr,

          settlement_date,
          gateway_charges,
          forex_difference,

          payment_mode,
          transaction_reference,
          payment_status,

          remarks,
        } = formData;

        // ===== REQUIRED FIELDS =====
        if (!organization_id) {
          errors.organization_id = "Organization is required.";
        }

        if (!payment_number?.trim()) {
          errors.payment_number = "Payment number is required.";
        } else if (payment_number?.length > 50) {
          errors.payment_number = "Payment number cannot exceed 50 characters.";
        }

        if (!payment_date) {
          errors.payment_date = "Payment date is required.";
        }

        if (!student_currency_code?.trim()) {
          errors.student_currency_code = "Student currency code is required.";
        } else if (student_currency_code?.length > 10) {
          errors.student_currency_code =
            "Student currency code cannot exceed 10 characters.";
        }

        if (
          amount_paid_student_currency === "" ||
          amount_paid_student_currency === null
        ) {
          errors.amount_paid_student_currency =
            "Amount paid (student currency) is required.";
        } else if (isNaN(amount_paid_student_currency)) {
          errors.amount_paid_student_currency = "Amount paid must be a number.";
        } else if (Number(amount_paid_student_currency) < 0) {
          errors.amount_paid_student_currency =
            "Amount paid cannot be negative.";
        }

        if (!settlement_currency_code?.trim()) {
          errors.settlement_currency_code =
            "Settlement currency code is required.";
        } else if (settlement_currency_code?.length > 10) {
          errors.settlement_currency_code =
            "Settlement currency code cannot exceed 10 characters.";
        }

        if (amount_received_inr === "" || amount_received_inr === null) {
          errors.amount_received_inr = "Amount received (INR) is required.";
        } else if (isNaN(amount_received_inr)) {
          errors.amount_received_inr = "Amount received must be a number.";
        } else if (Number(amount_received_inr) < 0) {
          errors.amount_received_inr = "Amount received cannot be negative.";
        }

        // ===== OPTIONAL NUMERIC FIELDS =====
        if (
          gateway_charges &&
          (isNaN(gateway_charges) || Number(gateway_charges) < 0)
        ) {
          errors.gateway_charges = "Gateway charges must be a positive number.";
        }

        if (forex_difference && isNaN(forex_difference)) {
          errors.forex_difference = "Forex difference must be a number.";
        }

        // ===== OPTIONAL DATE =====
        if (settlement_date) {
          const validDate = !isNaN(Date.parse(settlement_date));
          if (!validDate) errors.settlement_date = "Invalid settlement date.";
        }

        // ===== PAYMENT MODE =====
        const validPaymentModes = [
          "UPI",
          "Credit Card",
          "Debit Card",
          "NetBanking",
          "PayPal",
          "Stripe",
          "Razorpay",
          "Other",
        ];

        if (!payment_mode) {
          errors.payment_mode = "Payment mode is required.";
        } else if (!validPaymentModes.includes(payment_mode)) {
          errors.payment_mode = "Invalid payment mode selected.";
        }

        // ===== OPTIONAL STRING FIELDS =====
        if (transaction_reference && transaction_reference?.length > 100) {
          errors.transaction_reference =
            "Transaction reference cannot exceed 100 characters.";
        }

        const validStatuses = [
          "Pending",
          "Successful",
          "Failed",
          "Refunded",
          "Settled",
        ];
        if (payment_status && !validStatuses.includes(payment_status)) {
          errors.payment_status = "Invalid payment status.";
        }

        // ===== OPTIONAL REMARKS =====
        if (remarks && typeof remarks !== "string") {
          errors.remarks = "Remarks must be a valid string.";
        }

        // ===== OPTIONAL RELATIONS (if required to validate IDs) =====
        const idFields = {
          organization_entity_id,
          organization_ems_admission_id,
          organization_ems_student_id,
          organization_ems_fee_installment_id,
        };
        Object.entries(idFields).forEach(([key, value]) => {
          if (value && isNaN(value)) {
            errors[key] = "Invalid ID format.";
          }
        });

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/students-fees",
      initialData: {
        organization_entity_id: "",
        organization_ems_admission_id: "",
        organization_ems_student_id: "",
        organization_ems_fee_installment_id: "",
        payment_number: "",
        payment_date: "",
        student_currency_code: "",
        amount_paid_student_currency: "",
        settlement_currency_code: "",
        amount_received_inr: "",
        settlement_date: "",
        gateway_charges: "",
        forex_difference: "",
        payment_mode: "",
        transaction_reference: "",
        payment_status: "",
        remarks: "",
      },
      successMessages: {
        add: "Student Fee added!",
        update: "Student Fee updated!",
      },
      redirectPath: "/students-fees",
      headerProps: {
        addMessage: "Add Student Fee",
        updateMessage: "Update Student Fee",
        homeLink: "/students-fees",
        homeText: "Student Fee",
      },
      Inputs: [
        {
          type: "Select",
          label: "Student *",
          mainKey: "organization_ems_student_id",
          OptionMainKey: "Students",
          menuKey: "organization_ems_student_id",
          formatValue: (val) => `${val.first_name} ${val.last_name}`,
        },
        {
          type: "Select",
          label: "Admission *",
          mainKey: "organization_ems_admission_id",
          OptionMainKey: "Admissions",
          menuKey: "organization_ems_admission_id",
          formatValue: (val) => `${val.admission_number}`,
        },
        {
          type: "Select",
          label: "Fee Installment (Optional)",
          mainKey: "organization_ems_fee_installment_id",
          OptionMainKey: "FeeInstallments",
          menuKey: "organization_ems_fee_installment_id",
          formatValue: (val) => `${val.installment_number}`,
        },

        {
          type: "Number",
          label: "Payment Number *",
          mainKey: "payment_number",
        },
        {
          type: "Date",
          label: "Payment Date *",
          mainKey: "payment_date",
        },
        {
          type: "Text",
          label: "Student Currency Code *",
          mainKey: "student_currency_code",
        },
        {
          type: "Number",
          label: "Amount Paid Student Currency *",
          mainKey: "amount_paid_student_currency",
        },
        {
          type: "Text",
          label: "Settlement Currency Code *",
          mainKey: "settlement_currency_code",
        },
        {
          type: "Number",
          label: "Amount Received INR *",
          mainKey: "amount_received_inr",
        },
        {
          type: "Date",
          label: "Settlement Date (Optional)",
          mainKey: "settlement_date",
        },
        {
          type: "Number",
          label: "Gateway Charges (Optional)",
          mainKey: "gateway_charges",
        },
        {
          type: "Number",
          label: "Forex Difference (Optional)",
          mainKey: "forex_difference",
        },
        {
          type: "Select",
          label: "Payment Mode *",
          mainKey: "payment_mode",
          OptionMainKey: "PaymentMode",
          menuKey: null,
          formatValue: (val) => val,
        },

        {
          type: "Text",
          label: "Transaction Reference (Optional)",
          mainKey: "transaction_reference",
        },

        {
          type: "Select",
          label: "Payment Status *",
          mainKey: "payment_status",
          OptionMainKey: "PaymentStatus",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        { name: "Students", Type: "Fetch", link: "/api/ems/students" },
        { name: "Admissions", Type: "Fetch", link: "/api/ems/admissions" },
        {
          name: "FeeInstallments",
          Type: "Fetch",
          link: "/api/ems/fee-installments",
        },

        {
          name: "PaymentMode",
          Type: "NoFetch",
          Options: [
            "UPI",
            "Credit Card",
            "Debit Card",
            "NetBanking",
            "PayPal",
            "Stripe",
            "Razorpay",
            "Other",
          ],
        },
        {
          name: "PaymentStatus",
          Type: "NoFetch",
          Options: ["Pending", "Successful", "Failed", "Refunded", "Settled"],
        },
      ],
    },

    // ,,, from here
  },
  {
    route: "/leads",
    ListProps: {
      title: "Leads",
      apiEndpoint: "/api/ems/leads",
      addRoute: "/leads",
      editRouteBase: "/leads/edit",
      tablePrimaryKey: "organization_ems_lead_id",
      tableName: "Leads",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_lead_id,
          country: item?.country?.country_name || "-",
          state: item?.state?.state_name || "-",
          city: item?.city?.city_name || "-",
          source: `${item?.leadSource?.lead_source_name}` || "-",
          stage: `${item?.leadStage?.lead_stage_name}` || "-",
          stage: `${item?.leadStage?.lead_stage_name}` || "-",
          training_program:
            `${item?.training_program?.training_program_name}` || "-",

          lead_datetime: formatDateTime(item?.lead_datetime) || "-",
          person_full_name: item?.person_full_name || "-",
          email: item.email || "-",
          phone: item.phone || "-",
          alternate_phone: item.alternate_phone || "-",
          interested_program_remarks: item.interested_program_remarks || "-",
          remarks: item.remarks || "-",
          is_spam: item.is_spam || "-",
          spam_reason: item.spam_reason || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          lead_source_id,
          country_id,
          state_id,
          city_id,
          training_program_id,
          lead_stage_id,
          lead_datetime,
          person_full_name,
          email,
          phone,
          alternate_phone,
          interested_program_remarks,
          remarks,
          is_spam,
          spam_reason,
        } = formData;

        // ===== REQUIRED FIELDS =====
        if (!organization_id) {
          errors.organization_id = "Organization ID is required.";
        } else if (isNaN(organization_id)) {
          errors.organization_id = "Organization ID must be a number.";
        }

        if (!lead_datetime) {
          errors.lead_datetime = "Lead datetime is required.";
        } else if (isNaN(Date.parse(lead_datetime))) {
          errors.lead_datetime = "Lead datetime is invalid.";
        }

        if (!person_full_name?.trim()) {
          errors.person_full_name = "Full name of the lead is required.";
        } else if (person_full_name?.length > 150) {
          errors.person_full_name = "Full name cannot exceed 150 characters.";
        }

        // ===== OPTIONAL RELATION IDS =====
        const optionalIds = {
          lead_source_id,
          country_id,
          state_id,
          city_id,
          training_program_id,
          lead_stage_id,
        };
        Object.entries(optionalIds).forEach(([key, value]) => {
          if (value && isNaN(value)) {
            errors[key] = "Invalid ID format.";
          }
        });

        // ===== OPTIONAL STRINGS =====
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.email = "Invalid email address.";
        } else if (email && email?.length > 100) {
          errors.email = "Email cannot exceed 100 characters.";
        }

        if (phone && phone?.length > 20) {
          errors.phone = "Phone number cannot exceed 20 characters.";
        }

        if (alternate_phone && alternate_phone?.length > 20) {
          errors.alternate_phone =
            "Alternate phone cannot exceed 20 characters.";
        }

        if (
          interested_program_remarks &&
          interested_program_remarks?.length > 150
        ) {
          errors.interested_program_remarks =
            "Remarks cannot exceed 150 characters.";
        }

        if (remarks && typeof remarks !== "string") {
          errors.remarks = "Remarks must be a valid string.";
        }

        if (is_spam !== undefined && typeof is_spam !== "boolean") {
          errors.is_spam = "Invalid value for spam flag.";
        }

        if (spam_reason && spam_reason?.length > 255) {
          errors.spam_reason = "Spam reason cannot exceed 255 characters.";
        }

        console.log("errors is : ", errors);

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/leads",
      initialData: {
        organization_entity_id: "",
        lead_source_id: "",
        country_id: "",
        state_id: "",
        city_id: "",
        training_program_id: "",
        lead_stage_id: "",

        lead_datetime: "",
        person_full_name: "",
        email: "",
        phone: "",
        alternate_phone: "",
        interested_program_remarks: "",
        remarks: "",
        is_spam: false,
        spam_reason: "",
      },
      successMessages: {
        add: "Lead added!",
        update: "Lead updated!",
      },
      redirectPath: "/leads",
      headerProps: {
        addMessage: "Add Lead",
        updateMessage: "Update Lead",
        homeLink: "/leads",
        homeText: "Lead",
      },
      Inputs: [
        {
          type: "Select",
          label: "Lead Source (Optional)",
          mainKey: "lead_source_id",
          OptionMainKey: "LeadSources",
          menuKey: "organization_ems_lead_source_id",
          formatValue: (val) => `${val.lead_source_name}`,
        },
        {
          type: "Select",
          label: "Lead Stage (Optional)",
          mainKey: "lead_stage_id",
          OptionMainKey: "LeadStages",
          menuKey: "organization_ems_lead_stage_id",
          formatValue: (val) => `${val.lead_stage_name}`,
        },
        {
          type: "Select",
          label: "Training Program (Optional)",
          mainKey: "training_program_id",
          OptionMainKey: "TrainingPrograms",
          menuKey: "organization_ems_training_program_id",
          formatValue: (val) => `${val.training_program_name}`,
        },
        {
          type: "Select",
          label: "Country (Optional)",
          mainKey: "country_id",
          OptionMainKey: "Countries",
          menuKey: "country_id",
          formatValue: (val) => `${val.country_name}`,
        },
        {
          type: "Select",
          label: "State (Optional)",
          mainKey: "state_id",
          OptionMainKey: "States",
          menuKey: "state_id",
          formatValue: (val) => `${val.state_name}`,
        },
        {
          type: "Select",
          label: "City (Optional)",
          mainKey: "city_id",
          OptionMainKey: "Cities",
          menuKey: "city_id",
          formatValue: (val) => `${val.city_name}`,
        },
        {
          type: "DateTime",
          label: "Lead DateTime *",
          mainKey: "lead_datetime",
        },
        {
          type: "Text",
          label: "Person Full Name *",
          mainKey: "person_full_name",
        },
        {
          type: "Text",
          label: "Email (Optional)",
          mainKey: "email",
        },
        {
          type: "Text",
          label: "Phone (Optional)",
          mainKey: "phone",
        },
        {
          type: "Text",
          label: "Alternate Phone (Optional)",
          mainKey: "alternate_phone",
        },
        {
          type: "MultiRow",
          label: "Interested Program Remarks (Optional)",
          mainKey: "interested_program_remarks",
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
        {
          type: "Checkbox",
          label: "Is Spam (Optional)",
          mainKey: "is_spam",
        },
        {
          type: "MultiRow",
          label: "Spam Reason (Optional)",
          mainKey: "spam_reason",
        },
      ],
      DataFetchers: [
        { name: "LeadSources", Type: "Fetch", link: "/api/ems/lead-sources" },
        { name: "LeadStages", Type: "Fetch", link: "/api/ems/lead-stages" },
        {
          name: "TrainingPrograms",
          Type: "Fetch",
          link: "/api/ems/training-programs",
        },

        { name: "Countries", Type: "Fetch", link: "/api/general/countries" },
        {
          name: "States",
          Type: "FetchDepend",
          dependKey: "country_id",
          link: "/api/general/countries/${country_id}/states/v1",
        },
        {
          name: "Cities",
          Type: "FetchDepend",
          dependKey: "state_id",
          link: "/api/general/countries/${country_id}/states/${state_id}/cities",
        },
      ],
    },
  },
  {
    route: "/lead-stages",
    ListProps: {
      title: "Leads",
      apiEndpoint: "/api/ems/lead-stages",
      addRoute: "/lead-stages",
      editRouteBase: "/lead-stages/edit",
      tablePrimaryKey: "organization_ems_lead_stage_id",
      tableName: "Leads",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_lead_stage_id,

          lead_stage_name: item?.lead_stage_name || "-",
          lead_stage_short_name: item.lead_stage_short_name || "-",
          description: item.description || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          lead_stage_name,
          lead_stage_short_name,
          description,
        } = formData;

        // ===== REQUIRED NUMERIC IDS =====
        if (!organization_id) {
          errors.organization_id = "Organization ID is required.";
        } else if (isNaN(organization_id)) {
          errors.organization_id = "Organization ID must be a number.";
        }

        // ===== LEAD STAGE NAME =====
        if (!lead_stage_name?.trim()) {
          errors.lead_stage_name = "Lead stage name is required.";
        } else if (lead_stage_name?.length > 100) {
          errors.lead_stage_name =
            "Lead stage name cannot exceed 100 characters.";
        }
        // Note: frontend cannot fully validate uniqueness per organization without an API call.

        // ===== OPTIONAL FIELDS =====
        if (lead_stage_short_name && lead_stage_short_name?.length > 10) {
          errors.lead_stage_short_name =
            "Short name cannot exceed 10 characters.";
        }

        if (description && description?.length > 255) {
          errors.description = "Description cannot exceed 255 characters.";
        }

        console.log("errors is : ", errors);

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/lead-stages",
      initialData: {
        organization_entity_id: "",
        lead_stage_name: "",
        lead_stage_short_name: "",
        description: "",
      },
      successMessages: {
        add: "Lead Stage added!",
        update: "Lead Stage updated!",
      },
      redirectPath: "/lead-stages",
      headerProps: {
        addMessage: "Add Lead Stage",
        updateMessage: "Update Lead Stage",
        homeLink: "/lead-stages",
        homeText: "Lead Stage",
      },
      Inputs: [
        {
          type: "Text",
          label: "Lead Stage Name *",
          mainKey: "lead_stage_name",
        },
        {
          type: "Text",
          label: "Lead Stage Short Name (Optional)",
          mainKey: "lead_stage_short_name",
        },
        {
          type: "MultiRow",
          label: "Description (Optional)",
          mainKey: "description",
        },
      ],
      DataFetchers: [],
    },
  },
  {
    route: "/lead-sources",
    ListProps: {
      title: "Lead Sources",
      apiEndpoint: "/api/ems/lead-sources",
      addRoute: "/lead-sources",
      editRouteBase: "/lead-sources/edit",
      tablePrimaryKey: "organization_ems_lead_stage_id",
      tableName: "Lead Sources",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_lead_stage_id,
          lead_source_name: item?.lead_source_name || "-",
          lead_source_short_name: item.lead_source_short_name || "-",
          description: item.description || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          lead_source_name,
          lead_source_short_name,
          description,
        } = formData;

        // ===== REQUIRED NUMERIC IDS =====
        if (!organization_id) {
          errors.organization_id = "Organization ID is required.";
        } else if (isNaN(organization_id)) {
          errors.organization_id = "Organization ID must be a number.";
        }

        // ===== LEAD STAGE NAME =====
        if (!lead_source_name?.trim()) {
          errors.lead_source_name = "Lead source name is required.";
        } else if (lead_source_name?.length > 100) {
          errors.lead_source_name =
            "Lead source name cannot exceed 100 characters.";
        }
        // Note: frontend cannot fully validate uniqueness per organization without an API call.

        // ===== OPTIONAL FIELDS =====
        if (lead_source_short_name && lead_source_short_name?.length > 10) {
          errors.lead_source_short_name =
            "Short name cannot exceed 10 characters.";
        }

        if (description && description?.length > 255) {
          errors.description = "Description cannot exceed 255 characters.";
        }

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/lead-sources",
      initialData: {
        organization_entity_id: "",
        lead_source_name: "",
        lead_source_short_name: "",
        description: "",
      },
      successMessages: {
        add: "Lead Source added!",
        update: "Lead Source updated!",
      },
      redirectPath: "/lead-sources",
      headerProps: {
        addMessage: "Add Lead Source",
        updateMessage: "Update Lead Source",
        homeLink: "/lead-sources",
        homeText: "Lead Source",
      },
      Inputs: [
        {
          type: "Text",
          label: "Lead Source Name *",
          mainKey: "lead_source_name",
        },
        {
          type: "Text",
          label: "Lead Source Short Name (Optional)",
          mainKey: "lead_source_short_name",
        },
        {
          type: "MultiRow",
          label: "Description (Optional)",
          mainKey: "description",
        },
      ],
      DataFetchers: [],
    },
  },
  {
    route: "/lead-activities",
    ListProps: {
      title: "Lead Activities",
      apiEndpoint: "/api/ems/lead-activities",
      addRoute: "/lead-activities",
      editRouteBase: "/lead-activities/edit",
      tablePrimaryKey: "organization_ems_lead_activity_id",
      tableName: "Lead Activities",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_lead_activity_id,
          lead: item?.lead?.person_full_name || "-",
          employee:
            `${item?.employee?.first_name} (${item?.employee?.employee_code})` ||
            "",

          activity_type: item.activity_type || "-",
          activity_datetime: item.activity_datetime || "-",
          activity_summary: item.activity_summary || "-",
          remarks: item.remarks || "-",
          was_within_preferred_time: item.was_within_preferred_time || "-",
          call_status: item.call_status || "-",
          email_read_flag: item.email_read_flag || "-",
          email_response_flag: item.email_response_flag || "-",
          whatsapp_read_flag: item.whatsapp_read_flag || "-",
          whatsapp_response_flag: item.whatsapp_response_flag || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_lead_id,
          employee_id,
          activity_type,
          activity_datetime,
          activity_summary,
          remarks,
          was_within_preferred_time,
          call_status,
          email_read_flag,
          email_response_flag,
          whatsapp_read_flag,
          whatsapp_response_flag,
        } = formData;

        // ===== REQUIRED FIELDS =====
        if (!organization_id) {
          errors.organization_id = "Organization is required.";
        } else if (isNaN(organization_id)) {
          errors.organization_id = "Organization ID must be a number.";
        }

        if (!organization_ems_lead_id) {
          errors.organization_ems_lead_id = "Lead is required.";
        } else if (isNaN(organization_ems_lead_id)) {
          errors.organization_ems_lead_id = "Lead ID must be a number.";
        }

        if (!employee_id) {
          errors.employee_id = "Employee (Counsellor) is required.";
        } else if (isNaN(employee_id)) {
          errors.employee_id = "Employee ID must be a number.";
        }

        // ===== ACTIVITY TYPE =====
        const validActivityTypes = [
          "Call",
          "Email",
          "WhatsApp",
          "SMS",
          "Telegram",
          "Meeting",
          "Other",
        ];

        if (!activity_type) {
          errors.activity_type = "Activity type is required.";
        } else if (!validActivityTypes.includes(activity_type)) {
          errors.activity_type = "Invalid activity type selected.";
        }

        // ===== ACTIVITY DATETIME =====
        if (!activity_datetime) {
          errors.activity_datetime = "Activity date & time is required.";
        } else if (isNaN(Date.parse(activity_datetime))) {
          errors.activity_datetime = "Invalid date & time format.";
        }

        // ===== OPTIONAL FIELDS =====
        if (activity_summary && activity_summary?.length > 255) {
          errors.activity_summary =
            "Activity summary cannot exceed 255 characters.";
        }

        if (remarks && typeof remarks !== "string") {
          errors.remarks = "Remarks must be a valid string.";
        }

        // ===== BOOLEAN FIELDS =====
        if (typeof was_within_preferred_time !== "boolean") {
          errors.was_within_preferred_time =
            "Please specify if it was within preferred time.";
        }

        const booleanFields = {
          email_read_flag,
          email_response_flag,
          whatsapp_read_flag,
          whatsapp_response_flag,
        };

        Object.entries(booleanFields).forEach(([key, value]) => {
          if (value !== undefined && typeof value !== "boolean") {
            errors[key] = "Invalid value.";
          }
        });

        // ===== ENUM FIELD: CALL STATUS =====
        const validCallStatuses = [
          "Attended",
          "Missed",
          "Rejected",
          "No Answer",
        ];
        if (call_status && !validCallStatuses.includes(call_status)) {
          errors.call_status = "Invalid call status selected.";
        }

        // ===== SET ERRORS =====
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/lead-activities",
      initialData: {
        organization_entity_id: "",
        organization_ems_lead_id: "",
        employee_id: "",
        activity_type: "",
        activity_datetime: "",
        activity_summary: "",
        remarks: "",
        was_within_preferred_time: false,
        call_status: "",
        email_read_flag: false,
        email_response_flag: false,
        whatsapp_read_flag: false,
        whatsapp_response_flag: false,
      },
      successMessages: {
        add: "Lead Activity added!",
        update: "Lead Activity updated!",
      },
      redirectPath: "/lead-activities",
      headerProps: {
        addMessage: "Add Lead Activity",
        updateMessage: "Update Lead Activity",
        homeLink: "/lead-activities",
        homeText: "Lead Activity",
      },
      Inputs: [
        {
          type: "Select",
          label: "Lead *",
          mainKey: "organization_ems_lead_id",
          OptionMainKey: "Leads",
          menuKey: "organization_ems_lead_id",
          formatValue: (val) => `${val.person_full_name}`,
        },
        {
          type: "Select",
          label: "Employee *",
          mainKey: "employee_id",
          OptionMainKey: "Employees",
          menuKey: "employee_id",
          formatValue: (val) => `${val.first_name} (${val.employee_code})`,
        },
        {
          type: "Select",
          label: "Activity Type *",
          mainKey: "activity_type",
          OptionMainKey: "ActivityTypes",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "DateTime",
          label: "Activity DateTime *",
          mainKey: "activity_datetime",
        },
        {
          type: "MultiRow",
          label: "Activity Summary (Optional)",
          mainKey: "activity_summary",
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
        {
          type: "Checkbox",
          label: "Was Within Preferred Time ? (Optional)",
          mainKey: "was_within_preferred_time",
        },
        {
          type: "Select",
          label: "Call Status (Optional)",
          mainKey: "call_status",
          OptionMainKey: "CallStatuses",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Checkbox",
          label: "Email Read Flag (Optional)",
          mainKey: "email_read_flag",
        },
        {
          type: "Checkbox",
          label: "Email Response Flag (Optional)",
          mainKey: "email_response_flag",
        },
        {
          type: "Checkbox",
          label: "Whatsapp Read Flag (Optional)",
          mainKey: "whatsapp_read_flag",
        },
        {
          type: "Checkbox",
          label: "Whatsapp Response Flag (Optional)",
          mainKey: "whatsapp_response_flag",
        },
      ],
      DataFetchers: [
        { name: "Leads", Type: "Fetch", link: "/api/ems/leads" },
        {
          name: "Employees",
          Type: "Fetch",
          link: "/api/organizations/employees",
        },
        {
          name: "ActivityTypes",
          Type: "NoFetch",
          Options: [
            "Call",
            "Email",
            "WhatsApp",
            "SMS",
            "Telegram",
            "Meeting",
            "Other",
          ],
        },
        {
          name: "CallStatuses",
          Type: "NoFetch",
          Options: ["Attended", "Missed", "Rejected", "No Answer"],
        },
      ],
    },
  },
  {
    route: "/lead-contact-timings",
    ListProps: {
      title: "Lead Contact Timings",
      apiEndpoint: "/api/ems/lead-contact-timings",
      addRoute: "/lead-contact-timings",
      editRouteBase: "/lead-contact-timings/edit",
      tablePrimaryKey: "organization_ems_lead_contact_timing_id",
      tableName: "Lead Contact Timings",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_lead_contact_timing_id,
          lead: item?.lead?.person_full_name || "-",
          preferred_contact_mode: item.preferred_contact_mode || "-",
          preferred_contact_timezone: item.preferred_contact_timezone || "-",

          morning_student_time_start: item.morning_student_time_start || "-",
          morning_student_time_end: item.morning_student_time_end || "-",
          morning_ist_time_start: item.morning_ist_time_start || "-",
          morning_ist_time_end: item.morning_ist_time_end || "-",
          evening_student_time_start: item.evening_student_time_start || "-",
          evening_student_time_end: item.evening_student_time_end || "-",
          evening_ist_time_start: item.evening_ist_time_start || "-",
          evening_ist_time_end: item.evening_ist_time_end || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_lead_id,
          preferred_contact_mode,
          preferred_contact_timezone,
          morning_student_time_start,
          morning_student_time_end,
          morning_ist_time_start,
          morning_ist_time_end,
          evening_student_time_start,
          evening_student_time_end,
          evening_ist_time_start,
          evening_ist_time_end,
        } = formData;

        // ===== BASIC REQUIRED FIELDS =====
        if (!organization_id)
          errors.organization_id = "Organization is required.";

        if (!organization_ems_lead_id)
          errors.organization_ems_lead_id = "Lead is required.";

        // ===== PREFERRED CONTACT MODE =====
        const validContactModes = [
          "Call",
          "WhatsApp",
          "Email",
          "SMS",
          "Telegram",
          "Other",
        ];
        if (
          preferred_contact_mode &&
          !validContactModes.includes(preferred_contact_mode)
        ) {
          errors.preferred_contact_mode =
            "Preferred contact mode must be one of Call, WhatsApp, Email, SMS, Telegram, or Other.";
        }

        // ===== TIMEZONE VALIDATION =====
        if (
          preferred_contact_timezone &&
          typeof preferred_contact_timezone !== "string"
        ) {
          errors.preferred_contact_timezone =
            "Preferred contact timezone must be a valid string.";
        }

        console.log("erro si : ", errors);

        // ===== SET ERRORS =====
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/lead-contact-timings",
      initialData: {
        organization_entity_id: "",
        organization_ems_lead_id: "",
        preferred_contact_mode: "",
        preferred_contact_timezone: "",
        morning_student_time_start: "",
        morning_student_time_end: "",
        morning_ist_time_start: "",
        morning_ist_time_end: "",
        evening_student_time_start: "",
        evening_student_time_end: "",
        evening_ist_time_start: "",
        evening_ist_time_end: "",
      },
      successMessages: {
        add: "Lead Contact Timing added!",
        update: "Lead Contact Timing updated!",
      },
      redirectPath: "/lead-contact-timings",
      headerProps: {
        addMessage: "Add Lead Contact Timing",
        updateMessage: "Update Lead Contact Timing",
        homeLink: "/lead-contact-timings",
        homeText: "Lead Contact Timing",
      },
      Inputs: [
        {
          type: "Select",
          label: "Lead *",
          mainKey: "organization_ems_lead_id",
          OptionMainKey: "Leads",
          menuKey: "organization_ems_lead_id",
          formatValue: (val) => `${val.person_full_name}`,
        },
        {
          type: "Select",
          label: "Preferred Contact Mode (Optional)",
          mainKey: "preferred_contact_mode",
          OptionMainKey: "PreferredContactMode",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Text",
          label: "Preferred Contact Timezone (Optional)",
          mainKey: "preferred_contact_timezone",
        },

        {
          type: "Time",
          label: "Morning Student Time Start (Optional)",
          mainKey: "morning_student_time_start",
        },
        {
          type: "Time",
          label: "Morning Student Time End (Optional)",
          mainKey: "morning_student_time_end",
        },
        {
          type: "Time",
          label: "Morning IST Time Start *",
          mainKey: "morning_ist_time_start",
        },
        {
          type: "Time",
          label: "Morning IST Time End *",
          mainKey: "morning_ist_time_end",
        },

        {
          type: "Time",
          label: "Evening Student Time Start (Optional)",
          mainKey: "evening_student_time_start",
        },
        {
          type: "Time",
          label: "Evening Student Time End (Optional)",
          mainKey: "evening_student_time_end",
        },
        {
          type: "Time",
          label: "Evening IST Time Start *",
          mainKey: "evening_ist_time_start",
        },
        {
          type: "Time",
          label: "Evening IST Time End *",
          mainKey: "evening_ist_time_end",
        },
      ],
      DataFetchers: [{ name: "Leads", Type: "Fetch", link: "/api/ems/leads" }],
    },
  },

  {
    route: "/assesments",
    ListProps: {
      title: "Assesments",
      apiEndpoint: "/api/ems/assesments",
      addRoute: "/assesments",
      editRouteBase: "/assesments/edit",
      tablePrimaryKey: "organization_ems_assessment_id",
      tableName: "Assesments",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_assessment_id,
          training_program:
            item?.training_program?.training_program_name || "-",
          batch: item?.batch?.batch_name || "-",

          assessment_name: item.assessment_name || "-",
          assessment_type: item.assessment_type || "-",
          max_score: item.max_score || "-",
          passing_score: item.passing_score || "-",

          assessment_date: FormatDateV1(item.assessment_date) || "-",
          status: item.status || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          training_program_id,
          organization_ems_batch_id,
          assessment_name,
          assessment_type,
          max_score,
          passing_score,
          assessment_date,
          status,
          remarks,
        } = formData;

        // ===== REQUIRED FIELDS =====
        if (!organization_id)
          errors.organization_id = "Organization ID is required.";
        if (!training_program_id)
          errors.training_program_id = "Training program is required.";
        if (!assessment_name)
          errors.assessment_name = "Assessment name is required.";
        if (!assessment_type)
          errors.assessment_type = "Assessment type is required.";
        if (!max_score && max_score !== 0)
          errors.max_score = "Maximum score is required.";
        if (!assessment_date)
          errors.assessment_date = "Assessment date is required.";

        // ===== VALIDATION: assessment_type =====
        const validAssessmentTypes = [
          "Quiz",
          "Assignment",
          "Project",
          "Final Exam",
          "Practical",
          "Other",
        ];
        if (
          assessment_type &&
          !validAssessmentTypes.includes(assessment_type)
        ) {
          errors.assessment_type =
            "Assessment type must be one of: Quiz, Assignment, Project, Final Exam, Practical, Other.";
        }

        // ===== VALIDATION: max_score =====
        if (
          max_score &&
          (isNaN(max_score) ||
            Number(max_score) < 0 ||
            Number(max_score) > 999999.99)
        ) {
          errors.max_score =
            "Maximum score must be a valid number between 0 and 999999.99.";
        }

        // ===== VALIDATION: passing_score =====
        if (passing_score) {
          if (
            isNaN(passing_score) ||
            Number(passing_score) < 0 ||
            Number(passing_score) > 999999.99
          ) {
            errors.passing_score =
              "Passing score must be a valid number between 0 and 999999.99.";
          } else if (Number(passing_score) > Number(max_score)) {
            errors.passing_score =
              "Passing score must be less than or equal to maximum score.";
          }
        }

        // ===== VALIDATION: assessment_date =====
        if (assessment_date) {
          const selectedDate = new Date(assessment_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            errors.assessment_date = "Assessment date cannot be in the past.";
          }
        }

        // ===== VALIDATION: status =====
        const validStatuses = ["Scheduled", "Conducted", "Cancelled"];
        if (status && !validStatuses.includes(status)) {
          errors.status =
            "Status must be one of: Scheduled, Conducted, or Cancelled.";
        }

        // ===== VALIDATION: remarks =====
        if (remarks && remarks?.length > 1000) {
          errors.remarks = "Remarks cannot exceed 1000 characters.";
        }

        // ===== SET ERRORS =====
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/assesments",
      initialData: {
        organization_entity_id: "",
        training_program_id: "",
        organization_ems_batch_id: "",
        assessment_name: "",
        assessment_type: "",
        max_score: "",
        passing_score: "",
        assessment_date: "",
        status: "",
        remarks: "",
      },
      successMessages: {
        add: "Assesment added!",
        update: "Assesment updated!",
      },
      redirectPath: "/assesments",
      headerProps: {
        addMessage: "Add Assesment",
        updateMessage: "Update Assesment",
        homeLink: "/assesments",
        homeText: "Assesment",
      },
      Inputs: [
        {
          type: "Select",
          label: "Training Program *",
          mainKey: "training_program_id",
          OptionMainKey: "TrainingPrograms",
          menuKey: "organization_ems_training_program_id",
          formatValue: (val) => `${val.training_program_name}`,
        },
        {
          type: "Select",
          label: "Batch (Optional)",
          mainKey: "organization_ems_batch_id",
          OptionMainKey: "Batches",
          menuKey: "organization_ems_batch_id",
          formatValue: (val) => `${val.batch_name}`,
        },
        {
          type: "Text",
          label: "Assesment Name *",
          mainKey: "assessment_name",
        },
        {
          type: "Select",
          label: "Assesment Type *",
          mainKey: "assessment_type",
          OptionMainKey: "AssesmentTypes",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Number",
          label: "Max Score *",
          mainKey: "max_score",
        },
        {
          type: "Number",
          label: "Passing Score (Optional)",
          mainKey: "passing_score",
        },
        {
          type: "Date",
          label: "Assesment Date *",
          mainKey: "assessment_date",
        },
        {
          type: "Select",
          label: "Status *",
          mainKey: "status",
          OptionMainKey: "Status",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        {
          name: "TrainingPrograms",
          Type: "Fetch",
          link: "/api/ems/training-programs",
        },
        { name: "Batches", Type: "Fetch", link: "/api/ems/batches" },
        {
          name: "AssesmentTypes",
          Type: "NoFetch",
          Options: [
            "Quiz",
            "Assignment",
            "Project",
            "Final Exam",
            "Practical",
            "Other",
          ],
        },
        {
          name: "Status",
          Type: "NoFetch",
          Options: ["Scheduled", "Conducted", "Cancelled"],
        },
      ],
    },
  },
  {
    route: "/assesment-results",
    ListProps: {
      title: "Assesment Results",
      apiEndpoint: "/api/ems/assesment-results",
      addRoute: "/assesment-results",
      editRouteBase: "/assesment-results/edit",
      tablePrimaryKey: "organization_ems_assessment_result_id",
      tableName: "Assesment Results",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_assessment_result_id,

          assesment: item?.assesment?.assessment_name || "-",
          student:
            `${item?.student?.first_name} (${item?.student?.student_id})` ||
            "-",
          admission: item?.admission?.admission_number || "-",

          score_obtained: item.score_obtained || "-",
          result_status: item.result_status || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_assessment_id,
          organization_ems_student_id,
          organization_ems_admission_id,
          score_obtained,
          result_status,
          remarks,
        } = formData;

        // ===== REQUIRED FIELDS =====
        if (!organization_id)
          errors.organization_id = "Organization is required.";
        if (!organization_ems_assessment_id)
          errors.organization_ems_assessment_id = "Assessment is required.";
        if (!organization_ems_student_id)
          errors.organization_ems_student_id = "Student is required.";
        if (!organization_ems_admission_id)
          errors.organization_ems_admission_id = "Admission is required.";
        if (
          score_obtained === "" ||
          score_obtained === null ||
          score_obtained === undefined
        )
          errors.score_obtained = "Score obtained is required.";

        // ===== NUMERIC VALIDATION: score_obtained =====
        if (score_obtained) {
          const num = Number(score_obtained);
          if (isNaN(num)) {
            errors.score_obtained = "Score must be a valid number.";
          } else if (num < 0 || num > 9999.99) {
            errors.score_obtained = "Score must be between 0 and 9999.99.";
          }
        }

        // ===== ENUM VALIDATION: result_status =====
        const validStatuses = ["Pass", "Fail", "Absent", "Pending"];
        if (result_status && !validStatuses.includes(result_status)) {
          errors.result_status =
            "Result status must be Pass, Fail, Absent, or Pending.";
        }

        // ===== LENGTH VALIDATION: remarks =====
        if (remarks && remarks?.length > 1000) {
          errors.remarks = "Remarks cannot exceed 1000 characters.";
        }

        // ===== SET ERRORS =====
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/assesment-results",
      initialData: {
        organization_entity_id: "",
        organization_ems_assessment_id: "",
        organization_ems_student_id: "",
        organization_ems_admission_id: "",
        score_obtained: "",
        result_status: "",
        remarks: "",
      },
      successMessages: {
        add: "Assesment Results added!",
        update: "Assesment Results updated!",
      },
      redirectPath: "/assesment-results",
      headerProps: {
        addMessage: "Add Assesment Results",
        updateMessage: "Update Assesment Results",
        homeLink: "/assesment-results",
        homeText: "Assesment Results",
      },
      Inputs: [
        {
          type: "Select",
          label: "Assesment *",
          mainKey: "organization_ems_assessment_id",
          OptionMainKey: "Assesments",
          menuKey: "organization_ems_assessment_id",
          formatValue: (val) => `${val.assessment_name}`,
        },
        {
          type: "Select",
          label: "Student *",
          mainKey: "organization_ems_student_id",
          OptionMainKey: "Students",
          menuKey: "organization_ems_student_id",
          formatValue: (val) => `${val?.first_name} (${val?.student_id})`,
        },
        {
          type: "Select",
          label: "Admission *",
          mainKey: "organization_ems_admission_id",
          OptionMainKey: "Admissions",
          menuKey: "organization_ems_admission_id",
          formatValue: (val) => `${val?.admission_number}`,
        },
        {
          type: "Number",
          label: "Score Obtained *",
          mainKey: "score_obtained",
        },
        {
          type: "Select",
          label: "Result Status *",
          mainKey: "result_status",
          OptionMainKey: "ResultStatuses",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        {
          name: "Assesments",
          Type: "Fetch",
          link: "/api/ems/assesments",
        },
        { name: "Students", Type: "Fetch", link: "/api/ems/students" },
        { name: "Admissions", Type: "Fetch", link: "/api/ems/admissions" },
        {
          name: "ResultStatuses",
          Type: "NoFetch",
          Options: ["Pass", "Fail", "Absent", "Pending"],
        },
      ],
    },
  },

  {
    route: "/batches",
    ListProps: {
      title: "Batches",
      apiEndpoint: "/api/ems/batches",
      addRoute: "/batches",
      editRouteBase: "/batches/edit",
      tablePrimaryKey: "organization_ems_batch_id",
      tableName: "Batches",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_batch_id,

          training_program:
            item?.training_program?.training_program_name || "-",

          batch_code: item.batch_code || "-",
          batch_name: item.batch_name || "-",
          start_date: item.start_date || "-",
          end_date: item.end_date || "-",
          batch_mode: item.batch_mode || "-",
          status: item.status || "-",
          preferred_study_slot: item.preferred_study_slot || "-",
          timing_details: item.timing_details || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          training_program_id,
          batch_code,
          batch_name,
          start_date,
          end_date,
          batch_mode,
          status,
          preferred_study_slot,
          timing_details,
          remarks,
        } = formData;

        // Organization ID
        if (!organization_id)
          errors.organization_id = "Organization is required.";

        // Entity ID (optional, integer check)
        if (organization_entity_id && isNaN(Number(organization_entity_id))) {
          errors.organization_entity_id = "Entity ID must be a valid number.";
        }

        // Training Program ID
        if (!training_program_id)
          errors.training_program_id = "Training program is required.";

        // Batch Code
        if (!batch_code?.trim()) {
          errors.batch_code = "Batch code is required.";
        } else if (batch_code?.length > 50) {
          errors.batch_code = "Batch code cannot exceed 50 characters.";
        }

        // Batch Name
        if (!batch_name?.trim()) {
          errors.batch_name = "Batch name is required.";
        } else if (batch_name?.length > 100) {
          errors.batch_name = "Batch name cannot exceed 100 characters.";
        }

        // Start Date
        if (!start_date) {
          errors.start_date = "Start date is required.";
        }

        // End Date
        if (end_date) {
          const start = new Date(start_date);
          const end = new Date(end_date);
          if (end < start)
            errors.end_date = "End date must be same or after start date.";
        }

        // Batch Mode
        const validModes = ["Online", "Offline", "Hybrid"];
        if (!batch_mode) {
          errors.batch_mode = "Batch mode is required.";
        } else if (!validModes.includes(batch_mode)) {
          errors.batch_mode = "Invalid batch mode.";
        }

        // Status
        const validStatuses = [
          "Scheduled",
          "Ongoing",
          "Completed",
          "Cancelled",
        ];
        if (!status) {
          errors.status = "Status is required.";
        } else if (!validStatuses.includes(status)) {
          errors.status = "Invalid status.";
        }

        // Preferred Study Slot
        const validSlots = ["Morning", "Afternoon", "Evening", "Weekend"];
        if (
          preferred_study_slot &&
          !validSlots.includes(preferred_study_slot)
        ) {
          errors.preferred_study_slot = "Invalid preferred study slot.";
        }

        // Timing Details
        if (timing_details && timing_details?.length > 150) {
          errors.timing_details =
            "Timing details cannot exceed 150 characters.";
        }

        // Remarks
        if (remarks && remarks?.length > 1000) {
          errors.remarks = "Remarks cannot exceed 1000 characters.";
        }

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/batches",
      initialData: {
        organization_entity_id: "",
        training_program_id: "",
        batch_code: "",
        batch_name: "",
        start_date: "",
        end_date: "",
        batch_mode: "",
        status: "",
        preferred_study_slot: "",
        timing_details: "",
        remarks: "",
      },
      successMessages: {
        add: "Batch added!",
        update: "Batch updated!",
      },
      redirectPath: "/batches",
      headerProps: {
        addMessage: "Add Batch",
        updateMessage: "Update Batch",
        homeLink: "/batches",
        homeText: "Batch",
      },
      Inputs: [
        {
          type: "Select",
          label: "Training Program *",
          mainKey: "training_program_id",
          OptionMainKey: "TrainingPrograms",
          menuKey: "organization_ems_training_program_id",
          formatValue: (val) => `${val.training_program_name}`,
        },

        {
          type: "Text",
          label: "Batch Code *",
          mainKey: "batch_code",
        },
        {
          type: "Text",
          label: "Batch Name *",
          mainKey: "batch_name",
        },
        {
          type: "Date",
          label: "Start Date *",
          mainKey: "start_date",
        },
        {
          type: "Date",
          label: "End Date (Optional)",
          mainKey: "end_date",
        },
        {
          type: "Select",
          label: "Batch Mode *",
          mainKey: "batch_mode",
          OptionMainKey: "BatchModes",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Select",
          label: "Status *",
          mainKey: "status",
          OptionMainKey: "Statuses",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Select",
          label: "Preferred Study Slot (Optional)",
          mainKey: "preferred_study_slot",
          OptionMainKey: "PreferredStudySlots",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "MultiRow",
          label: "Training Details (Optional)",
          mainKey: "timing_details",
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        {
          name: "TrainingPrograms",
          Type: "Fetch",
          link: "/api/ems/training-programs",
        },

        {
          name: "BatchModes",
          Type: "NoFetch",
          Options: ["Online", "Offline", "Hybrid"],
        },
        {
          name: "Statuses",
          Type: "NoFetch",
          Options: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
        },
        {
          name: "PreferredStudySlots",
          Type: "NoFetch",
          Options: ["Morning", "Afternoon", "Evening", "Weekend"],
        },
      ],
    },
  },
  {
    route: "/batch-classes",
    ListProps: {
      title: "Batch Classes",
      apiEndpoint: "/api/ems/batch-classes",
      addRoute: "/batch-classes",
      editRouteBase: "/batch-classes/edit",
      tablePrimaryKey: "organization_ems_batch_class_id",
      tableName: "Batch Classes",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_batch_class_id,
          batch:
            `${item?.batch?.batch_name} (${item?.batch?.batch_code})` || "-",
          trainer:
            `${item?.trainer?.first_name} ${item?.trainer?.employee_code}` ||
            "",

          class_date: item.class_date || "-",
          start_time: item.start_time || "-",
          end_time: item.end_time || "-",
          topic: item.topic || "-",
          class_status: item.class_status || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_batch_id,
          trainer_employee_id,
          class_date,
          start_time,
          end_time,
          topic,
          class_status,
          remarks,
        } = formData;

        // 1️⃣ Organization ID
        if (!organization_id) {
          errors.organization_id = "Organization is required.";
        } else if (isNaN(Number(organization_id))) {
          errors.organization_id = "Organization ID must be a valid number.";
        }

        // 2️⃣ Organization Entity ID (optional)
        if (organization_entity_id && isNaN(Number(organization_entity_id))) {
          errors.organization_entity_id = "Entity ID must be a valid number.";
        }

        // 3️⃣ Batch ID
        if (!organization_ems_batch_id) {
          errors.organization_ems_batch_id = "Batch is required.";
        } else if (isNaN(Number(organization_ems_batch_id))) {
          errors.organization_ems_batch_id = "Batch ID must be a valid number.";
        }

        // 4️⃣ Trainer ID
        if (!trainer_employee_id) {
          errors.trainer_employee_id = "Trainer is required.";
        } else if (isNaN(Number(trainer_employee_id))) {
          errors.trainer_employee_id = "Trainer ID must be a valid number.";
        }

        // 5️⃣ Class Date
        if (!class_date) {
          errors.class_date = "Class date is required.";
        } else if (isNaN(Date.parse(class_date))) {
          errors.class_date = "Invalid class date.";
        }

        // 6️⃣ Start Time
        if (!start_time) {
          errors.start_time = "Start time is required.";
        } else if (!/^\d{2}:\d{2}$/.test(start_time)) {
          errors.start_time = "Invalid time format (expected HH:mm).";
        }

        // 7️⃣ End Time
        if (!end_time) {
          errors.end_time = "End time is required.";
        } else if (!/^\d{2}:\d{2}$/.test(end_time)) {
          errors.end_time = "Invalid time format (expected HH:mm).";
        } else if (start_time && end_time <= start_time) {
          errors.end_time = "End time must be after start time.";
        }

        // 8️⃣ Topic (optional)
        if (topic && topic?.length > 255) {
          errors.topic = "Topic cannot exceed 255 characters.";
        }

        // 9️⃣ Class Status (optional)
        const validStatuses = [
          "Scheduled",
          "Conducted",
          "Cancelled",
          "Trainer Absent",
        ];
        if (class_status && !validStatuses.includes(class_status)) {
          errors.class_status = "Invalid class status.";
        }

        // 🔟 Remarks (optional)
        if (remarks && remarks?.length > 1000) {
          errors.remarks = "Remarks cannot exceed 1000 characters.";
        }

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/batch-classes",
      initialData: {
        organization_entity_id: "",
        organization_ems_batch_id: "",
        trainer_employee_id: "",
        class_date: "",
        start_time: "",
        end_time: "",
        topic: "",
        class_status: "",
        remarks: "",
      },
      successMessages: {
        add: "Batch Class added!",
        update: "Batch Class updated!",
      },
      redirectPath: "/batch-classes",
      headerProps: {
        addMessage: "Add Batch Class",
        updateMessage: "Update Batch Class",
        homeLink: "/batch-classes",
        homeText: "Batch Class",
      },
      Inputs: [
        {
          type: "Select",
          label: "Batch *",
          mainKey: "organization_ems_batch_id",
          OptionMainKey: "Batches",
          menuKey: "organization_ems_batch_id",
          formatValue: (val) => `${val.batch_name} (${val.batch_code})`,
        },
        {
          type: "Select",
          label: "Trainer *",
          mainKey: "trainer_employee_id",
          OptionMainKey: "Trainers",
          menuKey: "employee_id",
          formatValue: (val) => `${val.first_name} (${val.employee_code})`,
        },
        {
          type: "Date",
          label: "Class Date *",
          mainKey: "class_date",
        },
        {
          type: "Time",
          label: "Start Time *",
          mainKey: "end_time",
        },
        {
          type: "Time",
          label: "End Time *",
          mainKey: "start_time",
        },
        {
          type: "Text",
          label: "Topic (Optional)",
          mainKey: "topic",
        },
        {
          type: "Select",
          label: "Class Status *",
          mainKey: "class_status",
          OptionMainKey: "ClassStatuses",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        {
          name: "Batches",
          Type: "Fetch",
          link: "/api/ems/batches",
        },
        {
          name: "Trainers",
          Type: "Fetch",
          link: "/api/organizations/employees",
        },
        {
          name: "ClassStatuses",
          Type: "NoFetch",
          Options: ["Scheduled", "Conducted", "Cancelled", "Trainer Absent"],
        },
      ],
    },
  },
  {
    route: "/batch-students",
    ListProps: {
      title: "Batch Students",
      apiEndpoint: "/api/ems/batch-students",
      addRoute: "/batch-students",
      editRouteBase: "/batch-students/edit",
      tablePrimaryKey: "organization_ems_batch_student_id",
      tableName: "Batch Students",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_batch_student_id,
          batch:
            `${item?.batch?.batch_name} (${item?.batch?.batch_code})` || "-",
          student:
            `${item?.student?.first_name} ${item?.student?.student_id}` || "-",
          admission: `${item?.admission?.admission_number}` || "-",

          enrollment_date: FormatDateV1(item.enrollment_date) || "-",
          completion_date: FormatDateV1(item.completion_date) || "-",
          batch_status: item.batch_status || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_batch_id,
          organization_ems_admission_id,
          organization_ems_student_id,
          enrollment_date,
          completion_date,
          batch_status,
          remarks,
        } = formData;

        if (!organization_id) {
          errors.organization_id = "Organization is required.";
        } else if (isNaN(Number(organization_id))) {
          errors.organization_id = "Organization ID must be a valid number.";
        }

        if (organization_entity_id && isNaN(Number(organization_entity_id))) {
          errors.organization_entity_id = "Entity ID must be a valid number.";
        }

        if (!organization_ems_batch_id) {
          errors.organization_ems_batch_id = "Batch is required.";
        } else if (isNaN(Number(organization_ems_batch_id))) {
          errors.organization_ems_batch_id = "Batch ID must be a valid number.";
        }

        if (!organization_ems_admission_id) {
          errors.organization_ems_admission_id = "Admission is required.";
        } else if (isNaN(Number(organization_ems_admission_id))) {
          errors.organization_ems_admission_id =
            "Admission ID must be a valid number.";
        }

        if (!organization_ems_student_id) {
          errors.organization_ems_student_id = "Student is required.";
        } else if (isNaN(Number(organization_ems_student_id))) {
          errors.organization_ems_student_id =
            "Student ID must be a valid number.";
        }

        if (!enrollment_date) {
          errors.enrollment_date = "Enrollment date is required.";
        } else if (isNaN(Date.parse(enrollment_date))) {
          errors.enrollment_date = "Invalid enrollment date.";
        }

        if (completion_date) {
          if (isNaN(Date.parse(completion_date))) {
            errors.completion_date = "Invalid completion date.";
          } else if (
            enrollment_date &&
            new Date(completion_date) < new Date(enrollment_date)
          ) {
            errors.completion_date =
              "Completion date must be after or equal to enrollment date.";
          }
        }

        const validStatuses = ["Active", "Completed", "Dropped", "On Hold"];
        if (batch_status && !validStatuses.includes(batch_status)) {
          errors.batch_status = "Invalid batch status.";
        }

        if (remarks && remarks?.length > 1000) {
          errors.remarks = "Remarks cannot exceed 1000 characters.";
        }

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/batch-students",
      initialData: {
        organization_entity_id: "",
        organization_ems_batch_id: "",
        organization_ems_admission_id: "",
        organization_ems_student_id: "",
        enrollment_date: "",
        completion_date: "",
        batch_status: "",
        remarks: "",
      },
      successMessages: {
        add: "Batch Student added!",
        update: "Batch Student updated!",
      },
      redirectPath: "/batch-students",
      headerProps: {
        addMessage: "Add Batch Student",
        updateMessage: "Update Batch Student",
        homeLink: "/batch-students",
        homeText: "Batch Student",
      },
      Inputs: [
        {
          type: "Select",
          label: "Batch *",
          mainKey: "organization_ems_batch_id",
          OptionMainKey: "Batches",
          menuKey: "organization_ems_batch_id",
          formatValue: (val) => `${val.batch_name} (${val.batch_code})`,
        },
        {
          type: "Select",
          label: "Admission *",
          mainKey: "organization_ems_admission_id",
          OptionMainKey: "Admissions",
          menuKey: "organization_ems_admission_id",
          formatValue: (val) => `${val.admission_number}`,
        },
        {
          type: "Select",
          label: "Student *",
          mainKey: "organization_ems_student_id",
          OptionMainKey: "Students",
          menuKey: "organization_ems_student_id",
          formatValue: (val) => `${val.first_name} (${val.student_id})`,
        },
        {
          type: "Date",
          label: "Enrollment Date *",
          mainKey: "enrollment_date",
        },
        {
          type: "Date",
          label: "Completion Date (Optional)",
          mainKey: "completion_date",
        },

        {
          type: "Select",
          label: "Batch Status *",
          mainKey: "batch_status",
          OptionMainKey: "BatchStatuses",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        {
          name: "Batches",
          Type: "Fetch",
          link: "/api/ems/batches",
        },
        {
          name: "Admissions",
          Type: "Fetch",
          link: "/api/ems/admissions",
        },
        {
          name: "Students",
          Type: "Fetch",
          link: "/api/ems/students",
        },

        {
          name: "BatchStatuses",
          Type: "NoFetch",
          Options: ["Active", "Completed", "Dropped", "On Hold"],
        },
      ],
    },
  },
  {
    route: "/recruitment-agencies",
    ListProps: {
      title: "Recruitment Agencies",
      apiEndpoint: "/api/ems/recruitment-agencies",
      addRoute: "/recruitment-agencies",
      editRouteBase: "/recruitment-agencies/edit",
      tablePrimaryKey: "organization_ems_recruitment_agency_id",
      tableName: "Recruitment Agencies",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_recruitment_agency_id,
          country: item?.country?.country_name || "-",
          state: item?.state?.state_name || "-",
          city: item?.city?.city_name || "-",
          agency_name: item.agency_name || "-",
          contact_person: item.contact_person || "-",
          email: item.email || "-",
          phone: item.phone || "-",
          address: item.address || "-",
          status: item.status || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          agency_name,
          contact_person,
          email,
          phone,
          address,
          country_id,
          state_id,
          city_id,
          status,
          remarks,
        } = formData;

        // 1️⃣ Organization ID
        if (!organization_id) {
          errors.organization_id = "Organization is required.";
        } else if (isNaN(Number(organization_id))) {
          errors.organization_id = "Organization ID must be a valid number.";
        }

        // 2️⃣ Organization Entity ID (optional)
        if (organization_entity_id && isNaN(Number(organization_entity_id))) {
          errors.organization_entity_id = "Entity ID must be a valid number.";
        }

        // 3️⃣ Agency Name
        if (!agency_name || agency_name.trim() === "") {
          errors.agency_name = "Agency name is required.";
        } else if (agency_name?.length > 150) {
          errors.agency_name = "Agency name cannot exceed 150 characters.";
        }

        // 4️⃣ Contact Person (optional)
        if (contact_person && contact_person?.length > 100) {
          errors.contact_person =
            "Contact person cannot exceed 100 characters.";
        }

        // 5️⃣ Email (optional)
        if (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            errors.email = "Invalid email format.";
          } else if (email?.length > 100) {
            errors.email = "Email cannot exceed 100 characters.";
          }
        }

        // 6️⃣ Phone (optional)
        if (phone && phone?.length > 20) {
          errors.phone = "Phone number cannot exceed 20 characters.";
        }

        // 7️⃣ Address (optional)
        if (address && address?.length > 255) {
          errors.address = "Address cannot exceed 255 characters.";
        }

        // 8️⃣ Country ID (optional)
        if (country_id && isNaN(Number(country_id))) {
          errors.country_id = "Country ID must be a valid number.";
        }

        // 9️⃣ State ID (optional)
        if (state_id && isNaN(Number(state_id))) {
          errors.state_id = "State ID must be a valid number.";
        }

        // 🔟 City ID (optional)
        if (city_id && isNaN(Number(city_id))) {
          errors.city_id = "City ID must be a valid number.";
        }

        // 11️⃣ Status (required)
        const validStatuses = ["Active", "Inactive"];
        if (!status) {
          errors.status = "Status is required.";
        } else if (!validStatuses.includes(status)) {
          errors.status = "Status must be Active or Inactive.";
        }

        // 12️⃣ Remarks (optional)
        if (remarks && remarks?.length > 1000) {
          errors.remarks = "Remarks cannot exceed 1000 characters.";
        }

        // ✅ Finalize
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/recruitment-agencies",
      initialData: {
        organization_entity_id: "",
        agency_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        country_id: "",
        state_id: "",
        city_id: "",
        status: "",
        remarks: "",
      },
      successMessages: {
        add: "Recruitment Agency added!",
        update: "Recruitment Agency updated!",
      },
      redirectPath: "/recruitment-agencies",
      headerProps: {
        addMessage: "Add Recruitment Agency",
        updateMessage: "Update Recruitment Agency",
        homeLink: "/recruitment-agencies",
        homeText: "Recruitment Agency",
      },
      Inputs: [
        {
          type: "Select",
          label: "Country (Optional)",
          mainKey: "country_id",
          OptionMainKey: "Countries",
          menuKey: "general_country_id",
          formatValue: (val) => `${val.country_name}`,
        },
        {
          type: "Select",
          label: "State (Optional)",
          mainKey: "state_id",
          OptionMainKey: "States",
          menuKey: "general_state_id",
          formatValue: (val) => `${val.state_name}`,
        },
        {
          type: "Select",
          label: "City (Optional)",
          mainKey: "city_id",
          OptionMainKey: "Cities",
          menuKey: "general_city_id",
          formatValue: (val) => `${val.city_name}`,
        },

        {
          type: "Text",
          label: "Agency Name *",
          mainKey: "agency_name",
        },
        {
          type: "Text",
          label: "Contact Person (Optional)",
          mainKey: "contact_person",
        },
        {
          type: "Text",
          label: "Email (Optional)",
          mainKey: "email",
        },
        {
          type: "Text",
          label: "Phone (Optional)",
          mainKey: "phone",
        },
        {
          type: "MultiRow",
          label: "Address (Optional)",
          mainKey: "address",
        },

        {
          type: "Select",
          label: "Status *",
          mainKey: "status",
          OptionMainKey: "Statuses",
          menuKey: null,
          formatValue: (val) => val,
        },

        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        { name: "Countries", Type: "Fetch", link: "/api/general/countries" },
        {
          name: "States",
          Type: "FetchDepend",
          dependKey: "country_id",
          link: "/api/general/countries/${country_id}/states/v1",
        },
        {
          name: "Cities",
          Type: "FetchDepend",
          dependKey: "state_id",
          link: "/api/general/countries/${country_id}/states/${state_id}/cities",
        },
        {
          name: "Statuses",
          Type: "NoFetch",
          Options: ["Active", "InActive"],
        },
      ],
    },
  },
  {
    route: "/companies",
    ListProps: {
      title: "Companies",
      apiEndpoint: "/api/ems/companies",
      addRoute: "/companies",
      editRouteBase: "/companies/edit",
      tablePrimaryKey: "organization_ems_company_id",
      tableName: "Companies",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_company_id,

          company_name: item.company_name || "-",
          industry: item.industry || "-",
          contact_person: item.contact_person || "-",
          email: item.email || "-",
          phone: item.phone || "-",
          address: item.address || "-",
          status: item.status || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          company_name,
          industry,
          contact_person,
          email,
          phone,
          address,
          status,
        } = formData;

        if (!organization_id) {
          errors.organization_id = "Organization is required.";
        } else if (isNaN(Number(organization_id))) {
          errors.organization_id = "Organization ID must be a valid number.";
        }

        if (organization_entity_id && isNaN(Number(organization_entity_id))) {
          errors.organization_entity_id = "Entity ID must be a valid number.";
        }

        if (!company_name || company_name.trim() === "") {
          errors.company_name = "Company name is required.";
        } else if (company_name?.length > 150) {
          errors.company_name = "Company name cannot exceed 150 characters.";
        }

        if (industry && industry?.length > 100) {
          errors.industry = "Industry cannot exceed 150 characters.";
        }

        if (contact_person && contact_person?.length > 100) {
          errors.contact_person =
            "Contact person cannot exceed 100 characters.";
        }

        if (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            errors.email = "Invalid email format.";
          } else if (email?.length > 100) {
            errors.email = "Email cannot exceed 100 characters.";
          }
        }

        if (phone && phone?.length > 20) {
          errors.phone = "Phone number cannot exceed 20 characters.";
        }

        if (address && address?.length > 255) {
          errors.address = "Address cannot exceed 255 characters.";
        }

        const validStatuses = ["Active", "Inactive"];
        if (!status) {
          errors.status = "Status is required.";
        } else if (!validStatuses.includes(status)) {
          errors.status = "Status must be Active or Inactive.";
        }

        // ✅ Finalize
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/companies",
      initialData: {
        organization_entity_id: "",
        company_name: "",
        industry: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        status: "",
      },
      successMessages: {
        add: "Company added!",
        update: "Company updated!",
      },
      redirectPath: "/companies",
      headerProps: {
        addMessage: "Add Company",
        updateMessage: "Update Company",
        homeLink: "/companies",
        homeText: "Company",
      },
      Inputs: [
        {
          type: "Text",
          label: "Company Name *",
          mainKey: "company_name",
        },
        {
          type: "Text",
          label: "Industry (Optional)",
          mainKey: "industry",
        },
        {
          type: "Text",
          label: "Contact Person (Optional)",
          mainKey: "contact_person",
        },
        {
          type: "Text",
          label: "Email (Optional)",
          mainKey: "email",
        },
        {
          type: "Text",
          label: "Phone (Optional)",
          mainKey: "phone",
        },
        {
          type: "MultiRow",
          label: "Address (Optional)",
          mainKey: "address",
        },
        {
          type: "Select",
          label: "Status *",
          mainKey: "status",
          OptionMainKey: "Statuses",
          menuKey: null,
          formatValue: (val) => val,
        },
      ],
      DataFetchers: [
        {
          name: "Statuses",
          Type: "NoFetch",
          Options: ["Active", "InActive"],
        },
      ],
    },
  },

  {
    route: "/admissions",
    ListProps: {
      title: "Admissions",
      apiEndpoint: "/api/ems/admissions",
      addRoute: "/admissions",
      editRouteBase: "/admissions/edit",
      tablePrimaryKey: "organization_ems_admission_id",
      tableName: "Admissions",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_admission_id,
          student:
            `${item?.student?.first_name} ${item?.student?.last_name}` || "-",
          training_program:
            item?.training_program?.training_program_name || "-",
          lead: item?.lead?.person_full_name || "-",
          demo_session: item?.demo_session?.demo_date || "-",

          admission_number: item.admission_number || "-",
          admission_date: item.admission_date || "-",
          admission_status: item.admission_status || "-",
          total_fee_amount: item.total_fee_amount || "-",
          discount_amount: item.discount_amount || "-",
          discount_reason: item.discount_reason || "-",
          net_fee_amount: item.net_fee_amount || "-",
          installment_count: item.installment_count || "-",
          currency_code: item.currency_code || "-",
          preferred_study_slot: item.preferred_study_slot || "-",
          preferred_study_times: item.preferred_study_times || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_student_id,
          organization_ems_lead_id,
          training_program_id,
          organization_ems_demo_session_id,
          admission_number,
          admission_date,
          admission_status,
          total_fee_amount,
          discount_amount,
          discount_reason,
          net_fee_amount,
          installment_count,
          currency_code,
          preferred_study_slot,
          preferred_study_times,
          remarks,
        } = formData;

        // --- Required + Integer validations ---
        if (!organization_id)
          errors.organization_id = "Organization is required.";
        else if (isNaN(organization_id))
          errors.organization_id = "Organization ID must be a number.";

        if (!organization_ems_student_id)
          errors.organization_ems_student_id = "Student is required.";
        else if (isNaN(organization_ems_student_id))
          errors.organization_ems_student_id = "Student ID must be a number.";

        if (!organization_ems_lead_id)
          errors.organization_ems_lead_id = "Lead is required.";
        else if (isNaN(organization_ems_lead_id))
          errors.organization_ems_lead_id = "Lead ID must be a number.";

        if (!training_program_id)
          errors.training_program_id = "Training program is required.";
        else if (isNaN(training_program_id))
          errors.training_program_id = "Program ID must be a number.";

        if (
          organization_ems_demo_session_id &&
          isNaN(organization_ems_demo_session_id)
        )
          errors.organization_ems_demo_session_id =
            "Demo Session ID must be a number.";

        // --- Admission Number ---
        if (!admission_number)
          errors.admission_number = "Admission number is required.";
        else if (admission_number?.length > 50)
          errors.admission_number = "Maximum 50 characters allowed.";

        // --- Admission Date ---
        if (!admission_date)
          errors.admission_date = "Admission date is required.";

        // --- Admission Status ---
        const validStatuses = [
          "Pending",
          "Confirmed",
          "Cancelled",
          "Completed",
        ];
        if (!admission_status)
          errors.admission_status = "Admission status is required.";
        else if (!validStatuses.includes(admission_status))
          errors.admission_status = "Invalid admission status.";

        // --- Fee Validations ---
        if (!total_fee_amount && total_fee_amount !== 0)
          errors.total_fee_amount = "Total fee amount is required.";
        else if (isNaN(total_fee_amount) || total_fee_amount < 0)
          errors.total_fee_amount = "Must be a valid non-negative number.";

        if (discount_amount && (isNaN(discount_amount) || discount_amount < 0))
          errors.discount_amount =
            "Discount amount must be a valid non-negative number.";

        if (discount_reason && discount_reason?.length > 255)
          errors.discount_reason = "Maximum 255 characters allowed.";

        if (!net_fee_amount && net_fee_amount !== 0)
          errors.net_fee_amount = "Net fee amount is required.";
        else if (isNaN(net_fee_amount) || net_fee_amount < 0)
          errors.net_fee_amount = "Must be a valid non-negative number.";

        // --- Installment Count ---
        if (!installment_count)
          errors.installment_count = "Installment count is required.";
        else if (isNaN(installment_count) || installment_count < 1)
          errors.installment_count = "Installment count must be at least 1.";

        // --- Currency ---
        if (currency_code && currency_code?.length > 10)
          errors.currency_code = "Currency code must not exceed 10 characters.";

        // --- Preferred Study Slot ---
        const validSlots = ["Morning", "Afternoon", "Evening", "Weekend"];
        if (preferred_study_slot && !validSlots.includes(preferred_study_slot))
          errors.preferred_study_slot = "Invalid study slot.";

        if (preferred_study_times && preferred_study_times?.length > 100)
          errors.preferred_study_times = "Maximum 100 characters allowed.";

        if (remarks && remarks.trim()?.length > 500)
          errors.remarks = "Remarks too long (max 500 characters).";

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },
      baseUrl: "/api/ems/admissions",
      initialData: {
        organization_entity_id: "",
        organization_ems_student_id: "",
        organization_ems_lead_id: "",
        training_program_id: "",
        organization_ems_demo_session_id: "",
        admission_number: "",
        admission_date: "",
        admission_status: "",
        total_fee_amount: "",
        discount_amount: "",
        discount_reason: "",
        net_fee_amount: "",
        installment_count: "",
        currency_code: "",
        preferred_study_slot: "",
        preferred_study_times: "",
        remarks: "",
      },
      successMessages: {
        add: "Admission added!",
        update: "Admission updated!",
      },
      redirectPath: "/admissions",
      headerProps: {
        addMessage: "Add Admission",
        updateMessage: "Update Admission",
        homeLink: "/admissions",
        homeText: "Admission",
      },
      Inputs: [
        {
          type: "Select",
          label: "Student *",
          mainKey: "organization_ems_student_id",
          OptionMainKey: "Students",
          menuKey: "organization_ems_student_id",
          formatValue: (val) =>
            `${val.first_name} ${val.first_name} (${val.phone})`,
        },
        {
          type: "Select",
          label: "Lead *",
          mainKey: "organization_ems_lead_id",
          OptionMainKey: "Leads",
          menuKey: "organization_ems_lead_id",
          formatValue: (val) => `${val.person_full_name}`,
        },
        {
          type: "Select",
          label: "Training Program *",
          mainKey: "training_program_id",
          OptionMainKey: "TrainingPrograms",
          menuKey: "organization_ems_training_program_id",
          formatValue: (val) => `${val.training_program_name}`,
        },
        {
          type: "Select",
          label: "Demo Session (Optional)",
          mainKey: "organization_ems_demo_session_id",
          OptionMainKey: "DemoSessions",
          menuKey: "organization_ems_organization_ems_demo_session_id",
          formatValue: (val) => `${val.demo_date}`,
        },
        {
          type: "Text",
          label: "Admission Number *",
          mainKey: "admission_number",
        },
        {
          type: "Date",
          label: "Admission Date *",
          mainKey: "admission_date",
        },
        {
          type: "Select",
          label: "Admission Status *",
          mainKey: "admission_status",
          OptionMainKey: "Status",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Number",
          label: "Total Fee Amount *",
          mainKey: "total_fee_amount",
        },
        {
          type: "Number",
          label: "Discount Amount (Optional)",
          mainKey: "discount_amount",
        },
        {
          type: "Text",
          label: "Discount Reason (Optional)",
          mainKey: "discount_reason",
        },
        {
          type: "Number",
          label: "Net Fee Amount *",
          mainKey: "net_fee_amount",
        },
        {
          type: "Number",
          label: "Installment Count *",
          mainKey: "installment_count",
        },
        {
          type: "Text",
          label: "Currency Code (Optional)",
          mainKey: "currency_code",
        },
        {
          type: "Select",
          label: "Preferred Study Slot (Optional)",
          mainKey: "preferred_study_slot",
          OptionMainKey: "StudySlot",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Text",
          label: "Preferred Study Times (Optional)",
          mainKey: "preferred_study_times",
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        { name: "Students", Type: "Fetch", link: "/api/ems/students" },
        { name: "Leads", Type: "Fetch", link: "/api/ems/leads" },
        {
          name: "TrainingPrograms",
          Type: "Fetch",
          link: "/api/ems/training-programs",
        },
        {
          name: "DemoSessions",
          Type: "Fetch",
          link: "/api/ems/demo-sessions",
        },
        {
          name: "Status",
          Type: "NoFetch",
          Options: ["Pending", "Confirmed", "Cancelled", "Completed"],
        },
        {
          name: "StudySlot",
          Type: "NoFetch",
          Options: ["Morning", "Afternoon", "Evening", "Weekend"],
        },
      ],
    },
  },
  {
    route: "/fee-installments",
    ListProps: {
      title: "Fee Installments",
      apiEndpoint: "/api/ems/fee-installments",
      addRoute: "/fee-installments",
      editRouteBase: "/fee-installments/edit",
      tablePrimaryKey: "organization_ems_fee_installment_id",
      tableName: "Fee Installments",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_fee_installment_id,
          student:
            `${item?.student?.first_name} ${item?.student?.last_name}` || "-",
          admission: item?.admission.admission_number || "-",

          installment_number: item.installment_number || "-",
          due_date: FormatDateV1(item.due_date) || "-",
          amount_due: item.amount_due || "-",
          currency_code: item.currency_code || "-",
          status: item.status || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_admission_id,
          organization_ems_student_id,
          installment_number,
          due_date,
          amount_due,
          currency_code,
          status,
          remarks,
        } = formData;

        if (!organization_id) {
          errors.organization_id = "Organization is required.";
        } else if (isNaN(Number(organization_id))) {
          errors.organization_id = "Organization ID must be a number.";
        }

        if (organization_entity_id && isNaN(Number(organization_entity_id))) {
          errors.organization_entity_id = "Entity ID must be a number.";
        }

        if (!organization_ems_admission_id) {
          errors.organization_ems_admission_id = "Admission is required.";
        } else if (isNaN(Number(organization_ems_admission_id))) {
          errors.organization_ems_admission_id =
            "Admission ID must be a number.";
        }

        if (!organization_ems_student_id) {
          errors.organization_ems_student_id = "Student is required.";
        } else if (isNaN(Number(organization_ems_student_id))) {
          errors.organization_ems_student_id = "Student ID must be a number.";
        }

        if (!installment_number) {
          errors.installment_number = "Installment number is required.";
        } else if (isNaN(Number(installment_number))) {
          errors.installment_number = "Installment number must be numeric.";
        } else if (Number(installment_number) < 1) {
          errors.installment_number = "Installment number must be at least 1.";
        }

        if (!currency_code) {
          errors.currency_code = "Currency Code is required.";
        } else if (currency_code.trim()?.length > 10) {
          errors.currency_code = "Currency code cannot exceed 10 characters.";
        }

        if (!due_date) {
          errors.due_date = "Due date is required.";
        } else {
          const parsedDate = new Date(due_date);
          if (isNaN(parsedDate.getTime())) {
            errors.due_date = "Invalid due date format.";
          }
        }

        if (
          amount_due === "" ||
          amount_due === null ||
          amount_due === undefined
        ) {
          errors.amount_due = "Amount due is required.";
        } else if (isNaN(Number(amount_due))) {
          errors.amount_due = "Amount due must be numeric.";
        } else if (Number(amount_due) < 0) {
          errors.amount_due = "Amount due cannot be negative.";
        }

        const validStatuses = ["Pending", "Paid", "Overdue", "Cancelled"];
        if (!status) {
          errors.status = "Status is required.";
        } else if (!validStatuses.includes(status)) {
          errors.status =
            "Status must be one of: Pending, Paid, Overdue, or Cancelled.";
        }

        if (remarks && remarks.trim()?.length > 500) {
          errors.remarks = "Remarks too long (max 500 characters).";
        }

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/fee-installments",
      initialData: {
        organization_entity_id: "",
        organization_ems_admission_id: "",
        organization_ems_student_id: "",
        installment_number: "",
        due_date: "",
        amount_due: "",
        currency_code: "",
        status: "",
        remarks: "",
      },
      successMessages: {
        add: "Fee Installment added!",
        update: "Fee Installment updated!",
      },
      redirectPath: "/fee-installments",
      headerProps: {
        addMessage: "Add Fee Installment",
        updateMessage: "Update Fee Installment",
        homeLink: "/fee-installments",
        homeText: "Fee Installment",
      },
      Inputs: [
        {
          type: "Select",
          label: "Admission *",
          mainKey: "organization_ems_admission_id",
          OptionMainKey: "Admissions",
          menuKey: "organization_ems_admission_id",
          formatValue: (val) => `${val.admission_number}`,
        },
        {
          type: "Select",
          label: "Student *",
          mainKey: "organization_ems_student_id",
          OptionMainKey: "Students",
          menuKey: "organization_ems_student_id",
          formatValue: (val) =>
            `${val.first_name} ${val.first_name} (${val.phone})`,
        },

        {
          type: "Number",
          label: "Installment Number *",
          mainKey: "installment_number",
        },
        {
          type: "Date",
          label: "Due Date *",
          mainKey: "due_date",
        },
        {
          type: "Number",
          label: "Amount Due *",
          mainKey: "amount_due",
        },
        {
          type: "Text",
          label: "Currency Code *",
          mainKey: "currency_code",
        },
        {
          type: "Select",
          label: "Status *",
          mainKey: "status",
          OptionMainKey: "Statuses",
          menuKey: null,
          formatValue: (val) => val,
        },

        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        { name: "Admissions", Type: "Fetch", link: "/api/ems/admissions" },
        { name: "Students", Type: "Fetch", link: "/api/ems/students" },

        {
          name: "Statuses",
          Type: "NoFetch",
          Options: ["Pending", "Paid", "Overdue", "Cancelled"],
        },
      ],
    },
  },

  {
    route: "/classes-attendance",
    ListProps: {
      title: "Classes Attendance",
      apiEndpoint: "/api/ems/classes-attendance",
      addRoute: "/classes-attendance",
      editRouteBase: "/classes-attendance/edit",
      tablePrimaryKey: "organization_ems_class_attendance_id",
      tableName: "Classes Attendance",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_class_attendance_id,
          student:
            `${item?.student?.first_name} ${item?.student?.last_name}` || "-",
          batch_class: `${item?.batch_class.topic}` || "-",

          attendance_status: item.attendance_status || "-",

          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_batch_class_id,
          organization_ems_student_id,
          attendance_status,

          remarks,
        } = formData;

        if (!organization_id) {
          errors.organization_id = "Organization is required.";
        } else if (isNaN(Number(organization_id))) {
          errors.organization_id = "Organization ID must be a number.";
        }

        if (organization_entity_id && isNaN(Number(organization_entity_id))) {
          errors.organization_entity_id = "Entity ID must be a number.";
        }

        if (!organization_ems_batch_class_id) {
          errors.organization_ems_batch_class_id = "Batch Class is required.";
        } else if (isNaN(Number(organization_ems_batch_class_id))) {
          errors.organization_ems_batch_class_id =
            "Batch Class ID must be a number.";
        }

        if (!organization_ems_student_id) {
          errors.organization_ems_student_id = "Student is required.";
        } else if (isNaN(Number(organization_ems_student_id))) {
          errors.organization_ems_student_id = "Student ID must be a number.";
        }

        const validStatuses = ["Present", "Absent", "Late", "Excused"];
        if (!attendance_status)
          errors.attendance_status = "Attendance status is required.";
        else if (!validStatuses.includes(attendance_status))
          errors.attendance_status = "Invalid attendance status.";

        if (remarks && remarks.trim()?.length > 500) {
          errors.remarks = "Remarks too long (max 500 characters).";
        }

        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/classes-attendance",
      initialData: {
        organization_entity_id: "",
        organization_ems_batch_class_id: "",
        organization_ems_student_id: "",
        attendance_status: "",
        remarks: "",
      },
      successMessages: {
        add: "Class Attendance added!",
        update: "Class Attendance updated!",
      },
      redirectPath: "/classes-attendance",
      headerProps: {
        addMessage: "Add Class Attendance",
        updateMessage: "Update Class Attendance",
        homeLink: "/classes-attendance",
        homeText: "Class Attendance",
      },
      Inputs: [
        {
          type: "Select",
          label: "Batch Class *",
          mainKey: "organization_ems_batch_class_id",
          OptionMainKey: "BatchClasses",
          menuKey: "organization_ems_batch_class_id",
          formatValue: (val) => `${val.topic}`,
        },
        {
          type: "Select",
          label: "Student *",
          mainKey: "organization_ems_student_id",
          OptionMainKey: "Students",
          menuKey: "organization_ems_student_id",
          formatValue: (val) =>
            `${val.first_name} ${val.first_name} (${val.phone})`,
        },
        {
          type: "Select",
          label: "Attendance Status *",
          mainKey: "attendance_status",
          OptionMainKey: "AttendanceStatuses",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        { name: "BatchClasses", Type: "Fetch", link: "/api/ems/batch-classes" },
        { name: "Students", Type: "Fetch", link: "/api/ems/students" },
        {
          name: "AttendanceStatuses",
          Type: "NoFetch",
          Options: ["Present", "Absent", "Late", "Excused"],
        },
      ],
    },
  },

  {
    route: "/certificates",
    ListProps: {
      title: "Certificates",
      apiEndpoint: "/api/ems/certificates",
      addRoute: "/certificates",
      editRouteBase: "/certificates/edit",
      tablePrimaryKey: "organization_ems_certificate_id",
      tableName: "Certificates",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_certificate_id,

          student:
            `${item?.student?.first_name} (${item?.student?.student_id})` ||
            "-",
          admission: `${item?.admission?.admission_number}` || "-",
          batch:
            `${item?.batch?.batch_name} (${item?.batch?.batch_code})` || "-",
          training_program:
            `${item?.training_program?.training_program_name} (${item?.training_program?.training_program_code})` ||
            "",

          certificate_number: item?.certificate_number || "-",
          issue_date: FormatDateV1(item.issue_date) || "-",
          valid_until: FormatDateV1(item.valid_until) || "-",
          certificate_status: item.certificate_status || "-",
          certificate_name: item.certificate_name || "-",
          certificate_url: item.certificate_url || "-",
          qr_code_url: item.qr_code_url || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_student_id,
          organization_ems_admission_id,
          organization_ems_batch_id,
          training_program_id,
          certificate_number,
          issue_date,
          valid_until,
          certificate_status,
          certificate_name,
          certificate_url,
          qr_code_url,
          remarks,
        } = formData;

        // --- organization_id (required|integer|exists) ---
        if (!organization_id)
          errors.organization_id = "Organization is required.";
        else if (isNaN(organization_id))
          errors.organization_id = "Organization ID must be a valid number.";

        // --- organization_entity_id (sometimes|nullable|integer) ---
        if (organization_entity_id && isNaN(organization_entity_id))
          errors.organization_entity_id =
            "Organization Entity ID must be a valid number.";

        // --- organization_ems_student_id (required|integer|exists) ---
        if (!organization_ems_student_id)
          errors.organization_ems_student_id = "Student is required.";
        else if (isNaN(organization_ems_student_id))
          errors.organization_ems_student_id =
            "Student ID must be a valid number.";

        // --- organization_ems_admission_id (required|integer|exists) ---
        if (!organization_ems_admission_id)
          errors.organization_ems_admission_id = "Admission is required.";
        else if (isNaN(organization_ems_admission_id))
          errors.organization_ems_admission_id =
            "Admission ID must be a valid number.";

        // --- organization_ems_batch_id (sometimes|nullable|integer|exists) ---
        if (organization_ems_batch_id && isNaN(organization_ems_batch_id))
          errors.organization_ems_batch_id = "Batch ID must be a valid number.";

        // --- training_program_id (required|integer|exists) ---
        if (!training_program_id)
          errors.training_program_id = "Training program is required.";
        else if (isNaN(training_program_id))
          errors.training_program_id =
            "Training program ID must be a valid number.";

        // --- certificate_number (required|string|max:50|unique) ---
        if (!certificate_number)
          errors.certificate_number = "Certificate number is required.";
        else if (typeof certificate_number !== "string")
          errors.certificate_number = "Certificate number must be text.";
        else if (certificate_number.trim()?.length > 50)
          errors.certificate_number =
            "Certificate number too long (max 50 chars).";

        // --- issue_date (required|date) ---
        if (!issue_date) errors.issue_date = "Issue date is required.";
        else if (isNaN(Date.parse(issue_date)))
          errors.issue_date = "Issue date must be a valid date.";

        // --- valid_until (nullable|date|after_or_equal:issue_date) ---
        if (valid_until) {
          if (isNaN(Date.parse(valid_until)))
            errors.valid_until = "Valid until must be a valid date.";
          else if (issue_date && new Date(valid_until) < new Date(issue_date))
            errors.valid_until =
              "Valid until must be after or equal to the issue date.";
        }

        // --- certificate_status (sometimes|in:Issued,Revoked,Expired,Reissued) ---
        const validStatuses = ["Issued", "Revoked", "Expired", "Reissued"];
         if (!certificate_status){
           errors.certificate_status = "Certificate Status is required.";
         } else if (certificate_status && !validStatuses.includes(certificate_status))
          errors.certificate_status = "Invalid certificate status selected.";

        // --- certificate_name (nullable|string|max:150) ---
        if (certificate_name) {
          if (typeof certificate_name !== "string")
            errors.certificate_name = "Certificate name must be text.";
          else if (certificate_name.trim()?.length > 150)
            errors.certificate_name =
              "Certificate name too long (max 150 chars).";
        }

        // --- certificate_url (file upload check) ---
        if (certificate_url) {
          if (!(certificate_url instanceof File))
            errors.certificate_url = "Invalid file format for certificate.";
          else if (
            !certificate_url.type.startsWith("image/") &&
            !certificate_url.type.startsWith("application/pdf")
          )
            errors.certificate_url =
              "Certificate file must be an image or PDF.";
        }

        // --- qr_code_url (file upload check) ---
        if (qr_code_url) {
          if (!(qr_code_url instanceof File))
            errors.qr_code_url = "Invalid file format for QR code.";
          else if (!qr_code_url.type.startsWith("image/"))
            errors.qr_code_url =
              "QR code must be an image file (PNG, JPG, etc.).";
        }

        // --- remarks (nullable|string|max:500) ---
        if (remarks) {
          if (typeof remarks !== "string")
            errors.remarks = "Remarks must be text.";
          else if (remarks.trim()?.length > 500)
            errors.remarks = "Remarks too long (max 500 chars).";
        }

        // --- Set and return ---
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/certificates",
      initialData: {
        organization_entity_id: "",
        organization_ems_student_id: "",
        organization_ems_admission_id: "",
        organization_ems_batch_id: "",
        training_program_id: "",
        certificate_number: "",
        issue_date: "",
        valid_until: "",
        certificate_status: "",
        certificate_name: "",
        remarks: "",
      },
      successMessages: {
        add: "Certificate added!",
        update: "Certificate updated!",
      },
      redirectPath: "/certificates",
      headerProps: {
        addMessage: "Add Certificate",
        updateMessage: "Update Certificate",
        homeLink: "/certificates",
        homeText: "Certificate",
      },
      Inputs: [
        {
          type: "Select",
          label: "Student *",
          mainKey: "organization_ems_student_id",
          OptionMainKey: "Students",
          menuKey: "organization_ems_student_id",
          formatValue: (val) => `${val.first_name} (${val.student_id})`,
        },
        {
          type: "Select",
          label: "Admission *",
          mainKey: "organization_ems_admission_id",
          OptionMainKey: "Admissions",
          menuKey: "organization_ems_admission_id",
          formatValue: (val) => `${val.admission_number}`,
        },
        {
          type: "Select",
          label: "Batch (Optional)",
          mainKey: "organization_ems_batch_id",
          OptionMainKey: "Batches",
          menuKey: "organization_ems_batch_id",
          formatValue: (val) => `${val.batch_name} (${val.batch_code})`,
        },
        {
          type: "Select",
          label: "Training Program (Optional)",
          mainKey: "training_program_id",
          OptionMainKey: "TrainingPrograms",
          menuKey: "organization_ems_training_program_id",
          formatValue: (val) =>
            `${val.training_program_name} (${val.training_program_code})`,
        },

        {
          type: "Number",
          label: "Certificate Number *",
          mainKey: "certificate_number",
        },
        {
          type: "Date",
          label: "Issue Date *",
          mainKey: "issue_date",
        },
        {
          type: "Date",
          label: "Valid Until Date (Optional)",
          mainKey: "valid_until",
        },
        {
          type: "Select",
          label: "Certificate Statuses *",
          mainKey: "certificate_status",
          OptionMainKey: "CertificateStatuses",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "File",
          label: "Certificate File",
          mainKey: "certificate_url",
        },
        {
          type: "File",
          label: "Certificate Qr Code File",
          mainKey: "qr_code_url",
        },
        {
          type: "Text",
          label: "Certificate Name (Optional)",
          mainKey: "certificate_name",
        },
        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        { name: "Students", Type: "Fetch", link: "/api/ems/students" },
        { name: "Admissions", Type: "Fetch", link: "/api/ems/admissions" },
        { name: "Batches", Type: "Fetch", link: "/api/ems/batches" },
        {
          name: "TrainingPrograms",
          Type: "Fetch",
          link: "/api/ems/training-programs",
        },
        {
          name: "CertificateStatuses",
          Type: "NoFetch",
          Options: ["Issued", "Revoked", "Expired", "Reissued"],
        },
      ],
    },
  },
  {
    route: "/placement-referrals",
    ListProps: {
      title: "Placement Referrals",
      apiEndpoint: "/api/ems/placement-referrals",
      addRoute: "/placement-referrals",
      editRouteBase: "/placement-referrals/edit",
      tablePrimaryKey: "organization_ems_placement_referral_id",
      tableName: "Placement Referrals",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_placement_referral_id,

          student:
            `${item?.student?.first_name} (${item?.student?.student_id})` ||
            "-",
          admission: `${item?.admission?.admission_number}` || "-",
          training_program:
            `${item?.training_program?.training_program_name} (${item?.training_program?.training_program_code})` ||
            "",
          agency: `${item?.agency?.agency_name}` || "-",
          company: `${item?.company?.company_name}` || "-",

          referral_date: FormatDateV1(item.referral_date) || "-",
          referral_status: item?.referral_status || "-",
          job_role: item?.job_role || "-",
          package_amount: item?.package_amount || "-",
          currency_code: item?.currency_code || "-",
          joining_date: FormatDateV1(item.joining_date) || "-",
          remarks: item.remarks || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          organization_ems_student_id,
          organization_ems_admission_id,
          training_program_id,
          organization_ems_recruitment_agency_id,
          organization_ems_company_id,
          referral_date,
          referral_status,
          job_role,
          package_amount,
          currency_code,
          joining_date,
          remarks,
        } = formData;

        // --- organization_id (required|integer|exists) ---
        if (!organization_id)
          errors.organization_id = "Organization is required.";
        else if (isNaN(organization_id))
          errors.organization_id = "Organization ID must be a valid number.";

        // --- organization_entity_id (sometimes|nullable|integer) ---
        if (organization_entity_id && isNaN(organization_entity_id))
          errors.organization_entity_id =
            "Organization Entity ID must be a valid number.";

        // --- organization_ems_student_id (required|integer|exists) ---
        if (!organization_ems_student_id)
          errors.organization_ems_student_id = "Student is required.";
        else if (isNaN(organization_ems_student_id))
          errors.organization_ems_student_id =
            "Student ID must be a valid number.";

        // --- organization_ems_admission_id (required|integer|exists) ---
        if (!organization_ems_admission_id)
          errors.organization_ems_admission_id = "Admission is required.";
        else if (isNaN(organization_ems_admission_id))
          errors.organization_ems_admission_id =
            "Admission ID must be a valid number.";

        // --- training_program_id (required|integer|exists) ---
        if (!training_program_id)
          errors.training_program_id = "Training program is required.";
        else if (isNaN(training_program_id))
          errors.training_program_id =
            "Training program ID must be a valid number.";

        // --- organization_ems_recruitment_agency_id (sometimes|nullable|integer) ---
        if (
          organization_ems_recruitment_agency_id &&
          isNaN(organization_ems_recruitment_agency_id)
        )
          errors.organization_ems_recruitment_agency_id =
            "Recruitment agency ID must be a valid number.";

        // --- organization_ems_company_id (sometimes|nullable|integer) ---
        if (organization_ems_company_id && isNaN(organization_ems_company_id))
          errors.organization_ems_company_id =
            "Company ID must be a valid number.";

        // --- referral_date (required|date) ---
        if (!referral_date) errors.referral_date = "Referral date is required.";
        else if (isNaN(Date.parse(referral_date)))
          errors.referral_date = "Referral date must be a valid date.";

        // --- referral_status (sometimes|in:Referred,In Process,Interview Scheduled,Offer Received,Rejected,Placed) ---
        const validStatuses = [
          "Referred",
          "In Process",
          "Interview Scheduled",
          "Offer Received",
          "Rejected",
          "Placed",
        ];
        if (referral_status && !validStatuses.includes(referral_status))
          errors.referral_status = "Invalid referral status selected.";

        // --- job_role (nullable|string|max:100) ---
        if (job_role) {
          if (typeof job_role !== "string")
            errors.job_role = "Job role must be text.";
          else if (job_role.trim()?.length > 100)
            errors.job_role = "Job role too long (max 100 characters).";
        }

        // --- package_amount (nullable|numeric|min:0) ---
        if (package_amount) {
          if (isNaN(package_amount))
            errors.package_amount = "Package amount must be numeric.";
          else if (Number(package_amount) < 0)
            errors.package_amount = "Package amount cannot be negative.";
        }

        // --- currency_code (required|string|max:10) ---
        if (!currency_code) errors.currency_code = "Currency code is required.";
        else if (typeof currency_code !== "string")
          errors.currency_code = "Currency code must be text.";
        else if (currency_code.trim()?.length > 10)
          errors.currency_code = "Currency code too long (max 10 characters).";

        // --- joining_date (nullable|date|after_or_equal:referral_date) ---
        if (joining_date) {
          if (isNaN(Date.parse(joining_date)))
            errors.joining_date = "Joining date must be a valid date.";
          else if (
            referral_date &&
            new Date(joining_date) < new Date(referral_date)
          )
            errors.joining_date =
              "Joining date must be after or equal to referral date.";
        }

        // --- remarks (nullable|string|max:500) ---
        if (remarks) {
          if (typeof remarks !== "string")
            errors.remarks = "Remarks must be text.";
          else if (remarks.trim()?.length > 500)
            errors.remarks = "Remarks too long (max 500 chars).";
        }

        // --- Set & Return ---
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/placement-referrals",
      initialData: {
        organization_entity_id: "",
        organization_ems_student_id: "",
        organization_ems_admission_id: "",
        training_program_id: "",
        organization_ems_recruitment_agency_id: "",
        organization_ems_company_id: "",
        referral_date: "",
        referral_status: "",
        job_role: "",
        package_amount: "",
        currency_code: "",
        joining_date: "",
        remarks: "",
      },
      successMessages: {
        add: "Placement Referral added!",
        update: "Placement Referral updated!",
      },
      redirectPath: "/placement-referrals",
      headerProps: {
        addMessage: "Add Placement Referral",
        updateMessage: "Update Placement Referral",
        homeLink: "/placement-referrals",
        homeText: "Placement Referral",
      },
      Inputs: [
        {
          type: "Select",
          label: "Student *",
          mainKey: "organization_ems_student_id",
          OptionMainKey: "Students",
          menuKey: "organization_ems_student_id",
          formatValue: (val) => `${val.first_name} (${val.student_id})`,
        },
        {
          type: "Select",
          label: "Admission *",
          mainKey: "organization_ems_admission_id",
          OptionMainKey: "Admissions",
          menuKey: "organization_ems_admission_id",
          formatValue: (val) => `${val.admission_number}`,
        },
        {
          type: "Select",
          label: "Training Program *",
          mainKey: "training_program_id",
          OptionMainKey: "TrainingPrograms",
          menuKey: "organization_ems_training_program_id",
          formatValue: (val) =>
            `${val.training_program_name} (${val.training_program_code})`,
        },
        {
          type: "Select",
          label: "Recruitment Agency (Optional)",
          mainKey: "organization_ems_recruitment_agency_id",
          OptionMainKey: "RecruitmentAgencies",
          menuKey: "organization_ems_recruitment_agency_id",
          formatValue: (val) => `${val.agency_name}`,
        },
        {
          type: "Select",
          label: "Company (Optional)",
          mainKey: "organization_ems_company_id",
          OptionMainKey: "Companies",
          menuKey: "organization_ems_company_id",
          formatValue: (val) => `${val.company_name}`,
        },

        {
          type: "Date",
          label: "Referral Date *",
          mainKey: "referral_date",
        },

        {
          type: "Select",
          label: "Referral Status (Optional)",
          mainKey: "referral_status",
          OptionMainKey: "ReferralStatuses",
          menuKey: null,
          formatValue: (val) => val,
        },

        {
          type: "Text",
          label: "Job Role (Optional)",
          mainKey: "job_role",
        },
        {
          type: "Number",
          label: "Package Amount (Optional)",
          mainKey: "package_amount",
        },
        {
          type: "Date",
          label: "Valid Until Date (Optional)",
          mainKey: "valid_until",
        },
        {
          type: "Text",
          label: "Currency Code *",
          mainKey: "currency_code",
        },
        {
          type: "Date",
          label: "Joining Date (Optional)",
          mainKey: "joining_date",
        },

        {
          type: "MultiRow",
          label: "Remarks (Optional)",
          mainKey: "remarks",
        },
      ],
      DataFetchers: [
        { name: "Students", Type: "Fetch", link: "/api/ems/students" },
        { name: "Admissions", Type: "Fetch", link: "/api/ems/admissions" },

        {
          name: "TrainingPrograms",
          Type: "Fetch",
          link: "/api/ems/training-programs",
        },
        {
          name: "RecruitmentAgencies",
          Type: "Fetch",
          link: "/api/ems/recruitment-agencies",
        },
        {
          name: "Companies",
          Type: "Fetch",
          link: "/api/ems/companies",
        },
        {
          name: "ReferralStatuses",
          Type: "NoFetch",
          Options: [
            "Referred",
            "In Process",
            "Interview Scheduled",
            "Offer Received",
            "Rejected",
            "Placed",
          ],
        },
      ],
    },
  },
  {
    route: "/demo-sessions",
    ListProps: {
      title: "Demo Sessions",
      apiEndpoint: "/api/ems/demo-sessions",
      addRoute: "/demo-sessions",
      editRouteBase: "/demo-sessions/edit",
      tablePrimaryKey: "organization_ems_demo_session_id",
      tableName: "Demo Sessions",
      showAddButton: true,
      mapResponseToRows: (data) =>
        data.map((item) => ({
          id: item.organization_ems_demo_session_id,

          trainer:
            `${item?.trainer?.first_name} (${item?.trainer?.employee_code})` ||
            "",
          training_program:
            `${item?.training_program?.training_program_name} (${item?.training_program?.training_program_code})` ||
            "",

          demo_date: FormatDateV1(item.demo_date) || "-",
          start_time_ist: item?.start_time_ist || "-",
          end_time_ist: item?.end_time_ist || "-",
          start_time_client: item?.start_time_client || "-",
          end_time_client: item?.end_time_client || "-",
          client_timezone: item?.client_timezone || "-",
          demo_notes: item?.demo_notes || "-",
          demo_mode: item?.demo_mode || "-",
          trainer_location: item?.trainer_location || "-",
          meeting_link: item?.meeting_link || "-",
          student_remarks: item?.student_remarks || "-",
          trainer_remarks: item?.trainer_remarks || "-",
          counsellor_remarks: item?.counsellor_remarks || "-",
          status: item?.status || "-",
          demo_duration_minutes: item?.demo_duration_minutes || "-",
        })),
    },
    FormProps: {
      validateForm: (formData, setFormErrors) => {
        const errors = {};
        const {
          organization_id,
          organization_entity_id,
          trainer_employee_id,
          training_program_id,
          demo_date,
          start_time_ist,
          end_time_ist,
          start_time_client,
          end_time_client,
          client_timezone,
          demo_notes,
          demo_mode,
          trainer_location,
          meeting_link,
          student_remarks,
          trainer_remarks,
          counsellor_remarks,
          status,
          demo_duration_minutes,
        } = formData;

        // --- organization_id ---
        if (!organization_id)
          errors.organization_id = "Organization is required.";
        else if (isNaN(organization_id))
          errors.organization_id = "Organization ID must be a valid number.";

        // --- organization_entity_id ---
        if (organization_entity_id && isNaN(organization_entity_id))
          errors.organization_entity_id =
            "Organization Entity ID must be a valid number.";

        // --- trainer_employee_id ---
        if (!trainer_employee_id)
          errors.trainer_employee_id = "Trainer is required.";
        else if (isNaN(trainer_employee_id))
          errors.trainer_employee_id = "Trainer ID must be a valid number.";

        // --- training_program_id ---
        if (!training_program_id)
          errors.training_program_id =
            "Training program is required.";
        else if (isNaN(training_program_id))
          errors.training_program_id =
            "Training program ID must be a valid number.";

        // --- demo_date ---
        if (!demo_date) errors.demo_date = "Demo date is required.";

        // --- start_time_ist & end_time_ist ---
        if (!start_time_ist)
          errors.start_time_ist = "Start time (IST) is required.";
        if (!end_time_ist) errors.end_time_ist = "End time (IST) is required.";
        if (start_time_ist && end_time_ist && end_time_ist <= start_time_ist)
          errors.end_time_ist =
            "End time (IST) must be after start time (IST).";

        // --- start_time_client & end_time_client ---
        if (!start_time_client)
          errors.start_time_client = "Start time (Client) is required.";
        if (!end_time_client)
          errors.end_time_client = "End time (Client) is required.";
        if (
          start_time_client &&
          end_time_client &&
          end_time_client <= start_time_client
        )
          errors.end_time_client =
            "End time (Client) must be after start time (Client).";

        // --- client_timezone ---
        if (!client_timezone)
          errors.client_timezone = "Client timezone is required.";
        else if (client_timezone?.length > 100)
          errors.client_timezone =
            "Client timezone must be under 100 characters.";

        // --- demo_notes ---
        if (demo_notes && demo_notes?.length > 255)
          errors.demo_notes = "Demo notes cannot exceed 255 characters.";

        // --- demo_mode ---
        const validDemoModes = ["online", "offline", "hybrid"];
        if (!demo_mode) errors.demo_mode = "Demo mode is required.";
        else if (!validDemoModes.includes(demo_mode))
          errors.demo_mode = "Demo mode must be Online, Offline, or Hybrid.";

        // --- trainer_location ---
        const validLocations = ["office", "home"];
        if (!trainer_location)
          errors.trainer_location = "Trainer location is required.";
        else if (!validLocations.includes(trainer_location))
          errors.trainer_location = "Trainer location must be Office or Home.";

        // --- meeting_link ---
        if (meeting_link && meeting_link?.length > 255)
          errors.meeting_link = "Meeting link cannot exceed 255 characters.";

        // --- student_remarks ---
        if (student_remarks && student_remarks?.length > 255)
          errors.student_remarks =
            "Student remarks cannot exceed 255 characters.";

        // --- trainer_remarks ---
        if (trainer_remarks && trainer_remarks?.length > 255)
          errors.trainer_remarks =
            "Trainer remarks cannot exceed 255 characters.";

        // --- counsellor_remarks ---
        if (counsellor_remarks && counsellor_remarks?.length > 255)
          errors.counsellor_remarks =
            "Counsellor remarks cannot exceed 255 characters.";

        // --- status ---
        const validStatuses = [
          "scheduled",
          "completed",
          "cancelled",
          "postponed",
        ];
        if (!status) errors.status = "Status is required.";
        else if (!validStatuses.includes(status))
          errors.status = "Invalid status selected.";

        // --- demo_duration_minutes ---
        if (demo_duration_minutes) {
          if (isNaN(demo_duration_minutes))
            errors.demo_duration_minutes = "Duration must be a number.";
          else if (demo_duration_minutes < 1)
            errors.demo_duration_minutes =
              "Duration must be at least 1 minute.";
          else if (demo_duration_minutes > 600)
            errors.demo_duration_minutes =
              "Duration cannot exceed 600 minutes.";
        }

        console.log("errop is : " , errors);
        
        // --- Finalize ---
        setFormErrors(errors);
        return Object.keys(errors)?.length === 0;
      },

      baseUrl: "/api/ems/demo-sessions",
      initialData: {
        organization_entity_id: "",
        trainer_employee_id: "",
        training_program_id: "",
        demo_date: "",
        start_time_ist: "",
        end_time_ist: "",
        start_time_client: "",
        end_time_client: "",
        client_timezone: "",
        demo_notes: "",
        demo_mode: "",
        trainer_location: "",
        meeting_link: "",
        student_remarks: "",
        trainer_remarks: "",
        counsellor_remarks: "",
        status: "",
        demo_duration_minutes: "",
      },
      successMessages: {
        add: "Demo Session added!",
        update: "Demo Session updated!",
      },
      redirectPath: "/demo-sessions",
      headerProps: {
        addMessage: "Add Demo Session",
        updateMessage: "Update Demo Session",
        homeLink: "/demo-sessions",
        homeText: "Demo Session",
      },
      Inputs: [
        {
          type: "Select",
          label: "Trainer *",
          mainKey: "trainer_employee_id",
          OptionMainKey: "Trainers",
          menuKey: "employee_id",
          formatValue: (val) => `${val.first_name} (${val.employee_code})`,
        },
        {
          type: "Select",
          label: "Training Program *",
          mainKey: "training_program_id",
          OptionMainKey: "TrainingPrograms",
          menuKey: "organization_ems_training_program_id",
          formatValue: (val) =>
            `${val.training_program_name} (${val.training_program_code})`,
        },
        {
          type: "Date",
          label: "Demo Date *",
          mainKey: "demo_date",
        },
        {
          type: "Time",
          label: "Start Time IST *",
          mainKey: "start_time_ist",
        },
        {
          type: "Time",
          label: "End Time IST *",
          mainKey: "end_time_ist",
        },
        {
          type: "Time",
          label: "Start Time Client *",
          mainKey: "start_time_client",
        },
        {
          type: "Time",
          label: "End Time Client *",
          mainKey: "end_time_client",
        },
        {
          type: "Text",
          label: "Client Time Zone *",
          mainKey: "client_timezone",
        },
        {
          type: "Text",
          label: "Demo Notes (Optional)",
          mainKey: "demo_notes",
        },
        {
          type: "Select",
          label: "Demo Mode *",
          mainKey: "demo_mode",
          OptionMainKey: "DemoModes",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Select",
          label: "Trainer Location *",
          mainKey: "trainer_location",
          OptionMainKey: "TrainerLocations",
          menuKey: null,
          formatValue: (val) => val,
        },

        {
          type: "Text",
          label: "Meeting Link (Optional)",
          mainKey: "meeting_link",
        },
        {
          type: "MultiRow",
          label: "Student Remarks (Optional)",
          mainKey: "student_remarks",
        },
        {
          type: "MultiRow",
          label: "Trainer Remarks (Optional)",
          mainKey: "trainer_remarks",
        },
        {
          type: "MultiRow",
          label: "Counsellor Remarks (Optional)",
          mainKey: "counsellor_remarks",
        },

        {
          type: "Select",
          label: "Status *",
          mainKey: "status",
          OptionMainKey: "Statuses",
          menuKey: null,
          formatValue: (val) => val,
        },
        {
          type: "Number",
          label: "Demo Duration Minutes (Optional)",
          mainKey: "demo_duration_minutes",
        },
      ],
      DataFetchers: [
        {
          name: "Trainers",
          Type: "Fetch",
          link: "/api/organizations/employees",
        },
        {
          name: "TrainingPrograms",
          Type: "Fetch",
          link: "/api/ems/training-programs",
        },
        {
          name: "DemoModes",
          Type: "NoFetch",
          Options: ["online", "offline", "hybrid"],
        },
        {
          name: "TrainerLocations",
          Type: "NoFetch",
          Options: ["office", "home"],
        },
        {
          name: "Statuses",
          Type: "NoFetch",
          Options: ["scheduled", "completed", "cancelled", "postponed"],
        },
      ],
    },
  },



  // {
  //   route: "/employment-stages",
  //   ListProps: {
  //     title: "Employment Stages",
  //     apiEndpoint: "/api/organizations/${org_id}/employment-stages",
  //     addRoute: "/employment-stages",
  //     editRouteBase: "/employment-stages/edit",
  //     tablePrimaryKey: "organization_employment_stage_id",
  //     tableName: "Employment Stages",
  //     showAddButton: true,
  //     mapResponseToRows: (data) =>
  //       data.map((item) => ({
  //         id: item.organization_employment_stage_id,
  //         employment_status:
  //           `${item?.Status?.employment_status_name}` ||
  //           "",
  //         employment_stage_name: item?.employment_stage_name || "-",
  //         description: item?.description || "-",
  //       })),
  //   },
  //   FormProps: {
  //     validateForm: (formData, setFormErrors) => {
  //       const errors = {};
  //       const {
  //         organization_id,
  //         organization_entity_id,
  //         organization_employment_status_id,
  //         employment_stage_name,
  //         description,
  //       } = formData;

  //       // --- organization_id ---
  //       // if (!organization_id)
  //       //   errors.organization_id = "Organization is required.";
  //       // else if (isNaN(organization_id))
  //       //   errors.organization_id = "Organization ID must be a valid number.";

  //       // // --- organization_entity_id ---
  //       // if (organization_entity_id && isNaN(organization_entity_id))
  //       //   errors.organization_entity_id =
  //       //     "Organization Entity ID must be a valid number.";

  //       // --- trainer_employee_id ---
  //       if (!organization_employment_status_id)
  //         errors.organization_employment_status_id = "Employment Status required.";
  //       else if (isNaN(organization_employment_status_id ))
  //         errors.organization_employment_status_id  = "Employement Status must be a valid number.";

  //       // --- training_program_id ---
     
  //       // --- demo_date ---
  //       if (!employment_stage_name) errors.employment_stage_name = "Employment Stage is required.";

      
  //       // --- meeting_link ---
  //       if (employment_stage_name && employment_stage_name?.length > 100)
  //         errors.employment_stage_name = "Employment Status cannot exceed 100 characters.";

  //       // --- student_remarks ---
  //       if (description && description?.length > 255)
  //         errors.description =
  //           "Description cannot exceed 255 characters.";


  //       console.log("errop is : " , errors);
        
  //       // --- Finalize ---
  //       setFormErrors(errors);
  //       return Object.keys(errors)?.length === 0;
  //     },

  //     baseUrl: "/api/organizations/${org_id}/employment-stages",
  //     initialData: {
  //       organization_configuration_template_id : "",
  //       organization_employment_status_id : "",
  //       employment_stage_name: "",
  //       description: "",
       
  //     },
  //     successMessages: {
  //       add: "Employment Stages added!",
  //       update: "Employment Stages updated!",
  //     },
  //     redirectPath: "/employment-stages",
  //     headerProps: {
  //       addMessage: "Add Employment Stages",
  //       updateMessage: "Update Employment Stages",
  //       homeLink: "/employment-stages",
  //       homeText: "Employment Stages",
  //     },
  //     Inputs: [
  //       {
  //         type: "Select",
  //         label: "Employment Status *",
  //         mainKey: "organization_employment_status_id",
  //         OptionMainKey: "employment_status",
  //         menuKey: "organization_employment_status_id",
  //         formatValue: (val) => `${val.employment_status_name}`,
  //       },
        
  //       {
  //         type: "Text",
  //         label: "Employment Stages Name*",
  //         mainKey: "employment_stage_name",
  //       },
  //       {
  //         type: "Text",
  //         label: "Description",
  //         mainKey: "description",
  //       },

  //     ],
  //     DataFetchers: [
  //       {
  //         name: "employment_status",
  //         Type: "Fetch",
  //         link: "/api/organizations/${org_id}/employment-status",
  //       },
  //     ],
  //   },
  // },



];
