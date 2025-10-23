// import { Autocomplete, Box, TextField, Popper, createFilterOptions } from "@mui/material";
// import React from "react";

// function CustomPopper(props) {
//   return <Popper {...props} style={{ width: "auto", minWidth: props.style?.width }} placement="bottom-start" />;
// }

// // Create filter with custom stringify function
// const filter = createFilterOptions({
//   stringify: (option) =>
//     `${option?.name || ""} ${option?.phone_code || ""} ${option?.code || ""}`,
// });

// function SelectWithImage({
//   label,
//   value,
//   options,
//   optionkey,
//   onChange,
//   error,
//   width,
//   minWidth,
//   fs,
//   disabled,
// }) {
//   return (
//     <Autocomplete
//       PopperComponent={CustomPopper}
//       value={value || null}
//       filterOptions={(options, params) => {
//         const { inputValue } = params;
//         const filtered = filter(options, params);

//         return filtered;
//       }}
//       sx={{
//         fontSize: fs,
//         width,
//         marginTop: "3px",
//         marginRight: "10px",
//         minWidth: minWidth || width,
//         marginBottom: "8px",
//         "& .MuiInputLabel-root": {
//           fontSize: fs,
//           top: -6,
//         },
//         "& .MuiInputBase-root": {
//           height: "45px",
//           padding: "0 !important",
//           maxHeight: "45px",
//         },
//         "& .MuiOutlinedInput-root": {
//           boxShadow: "none !important",
//           "&:hover .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#999",
//             border: "none",
//             maxHeight: "45px",
//           },
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#666",
//             border: "none",
//             maxHeight: "45px",
//           },
//         },
//         "& .MuiInputBase-input": {
//           fontSize: fs,
//           padding: "2px 8px !important",
//           border: "none",
//           maxHeight: "45px",
//         },
//         "& .MuiOutlinedInput-notchedOutline": {
//           padding: 0,
//           border: "none",
//           maxHeight: "45px",
//         },
//         "& .MuiFormHelperText-root": {
//           fontSize: "10px",
//           border: "none",
//           maxHeight: "45px",
//         },
//       }}
//       size="small"
//       options={options}
//       getOptionLabel={(option) =>
//         typeof option === "string" ? option : option[optionkey] || ""
//       }
//       onChange={onChange}
//       renderOption={(props, option) => (
//         <Box
//           key={option.code}
//           component="li"
//           {...props}
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             fontSize: "12px",
//             fontFamily: "Roboto, sans-serif",
//             fontWeight: 400,
//             "& > img": {
//               marginRight: "8px",
//               flexShrink: 0,
//             },
//             paddingRight: "12px",
//           }}
//         >
//           <img
//             loading="lazy"
//             width="20"
//             srcSet={`https://flagcdn.com/w40/${option?.code?.toLowerCase()}.png 2x`}
//             src={`https://flagcdn.com/w20/${option?.code?.toLowerCase()}.png`}
//             alt=""
//           />
//           {option.name} ({option.phone_code})
//         </Box>
//       )}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           sx={{ maxHeight: "45px" }}
//           error={!!error}
//           helperText={!!error && error}
//           label={label}
//           inputProps={{
//             ...params.inputProps,
//             autoComplete: "new-password",
//           }}
//         />
//       )}
//       disabled={disabled}
//     />
//   );
// }

// export default SelectWithImage;

import { Autocomplete, Box, TextField, Popper, createFilterOptions } from "@mui/material";
import React from "react";

function CustomPopper(props) {
  return <Popper {...props} style={{ width: "auto", minWidth: props.style?.width }} placement="bottom-start" />;
}

// Enable search by name, code, or phone_code (+phone_code included in search)
const filter = createFilterOptions({
  stringify: (option) =>
    `${option?.name?.toLowerCase() || ""} ${option?.code?.toLowerCase() || ""} ${option?.phone_code || ""} +${option?.phone_code?.toLowerCase || ""}`,
});

function SelectWithImage({
  label,
  value,
  options,
  onChange,
  error,
  width,
  minWidth,
  fs,
  disabled,
}) {
  return (
    <Autocomplete
      PopperComponent={CustomPopper}
      value={value || null}
      filterOptions={(options, params) => filter(options, params)}
      sx={{
        fontSize: fs,
        width,
        marginTop: "3px",
        marginRight: "10px",
        minWidth: minWidth || width,
        marginBottom: "8px",
        "& .MuiInputLabel-root": { fontSize: fs, top: -6 },
        "& .MuiInputBase-root": {
          height: "45px",
          padding: "0 !important",
          maxHeight: "45px",
        },
        "& .MuiOutlinedInput-root": {
          boxShadow: "none !important",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999", border: "none", maxHeight: "45px" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#666", border: "none", maxHeight: "45px" },
        },
        "& .MuiInputBase-input": {
          fontSize: fs,
          padding: "2px 8px !important",
          border: "none",
          maxHeight: "45px",
        },
        "& .MuiOutlinedInput-notchedOutline": { padding: 0, border: "none", maxHeight: "45px" },
        "& .MuiFormHelperText-root": { fontSize: "10px", border: "none", maxHeight: "45px" },
      }}
      size="small"
      options={options}
      getOptionLabel={(option) => {
        if (!option || typeof option !== "object") return "";
        return option?.phone_code ? `${option.phone_code}` : "";
      }}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      onChange={onChange}
      renderOption={(props, option) => (
        <Box
          key={option.code}
          component="li"
          {...props}
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 400,
            "& > img": { marginRight: "8px", flexShrink: 0 },
            paddingRight: "12px",
          }}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option?.code?.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option?.code?.toLowerCase()}.png`}
            alt=""
          />
          {option.name} ({option.code}) {option.phone_code}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ maxHeight: "45px" }}
          error={!!error}
          helperText={!!error && error}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
      disabled={disabled}
    />
  );
}

export default SelectWithImage;
