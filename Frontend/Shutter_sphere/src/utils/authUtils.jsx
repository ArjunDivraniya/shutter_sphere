// authUtils.js
export const getUserRole = () => {
    const token = localStorage.getItem("token"); // JWT token
    if (!token) return null;
  
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      return decodedToken.role; // Role: "photographer" or "client"
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };
  
  export const isAuthenticated = () => !!localStorage.getItem("token");
  