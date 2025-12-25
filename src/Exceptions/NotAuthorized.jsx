import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
      backgroundColor: "#f8f9fa",
      padding: "20px",
    }}>
      <div style={{
        maxWidth: "500px",
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}>
        {/* Lock Icon */}
        <div style={{
          fontSize: "4rem",
          color: "#dc3545",
          marginBottom: "20px",
        }}>
          🔒
        </div>
        
        <h1 style={{ 
          fontSize: "3rem", 
          marginBottom: "10px",
          color: "#dc3545",
          fontWeight: "bold",
        }}>
          403
        </h1>
        
        <h2 style={{ 
          fontSize: "1.5rem", 
          marginBottom: "20px",
          color: "#333",
        }}>
          Access Denied
        </h2>
        
        <p style={{
          fontSize: "1rem",
          color: "#666",
          marginBottom: "10px",
          lineHeight: "1.6",
        }}>
          You do not have permission to access this page.
        </p>
        
        <p style={{
          fontSize: "0.95rem",
          color: "#888",
          marginBottom: "30px",
        }}>
          Your current role does not allow you to view this resource. Please contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
};

export default NotAuthorized;