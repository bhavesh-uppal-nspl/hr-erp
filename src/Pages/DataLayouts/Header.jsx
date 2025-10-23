import {
    Box,
    Typography,
    Breadcrumbs,
    Divider,
    Link as MuiLink,
} from "@mui/material";
import { Business } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = ({ mode, updateMessage, addMessage, homeLink, homeText }) => {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h5" fontWeight="semibold" gutterBottom>
                {mode === "edit" ? updateMessage : addMessage}
            </Typography>
            <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ mb: 2 }}>
                <MuiLink
                    color="inherit"
                    onClick={() => navigate(homeLink)}
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                >
                    <Business fontSize="small" sx={{ mr: 0.5 }} />
                    {homeText}
                </MuiLink>
                <Typography
                    color="text.primary"
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    {mode === "edit" ? (
                        <>
                            Edit
                        </>
                    ) : (
                        <>
                            Add
                        </>
                    )}
                </Typography>
            </Breadcrumbs>
            <Divider sx={{ mb: 3 }} />
        </Box>
    );
};

export default Header;
