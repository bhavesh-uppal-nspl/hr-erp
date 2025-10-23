import { Link } from "react-router-dom";

const NotAllowed = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "10px" }}>403</h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Not Allowed</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "5px",
      }}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotAllowed;
