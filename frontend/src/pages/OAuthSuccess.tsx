// frontend/src/pages/OAuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (token) {
      localStorage.setItem("token", token);
      
      if (userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          // Store in the same key that Dashboard expects
          localStorage.setItem("capsule_current_user", JSON.stringify(userData));
          navigate("/dashboard");
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Fallback: fetch user data
          fetchUserData(token, navigate);
        }
      } else {
        // If no user data in URL, fetch it
        fetchUserData(token, navigate);
      }
    } else {
      navigate("/");
    }
  }, [location.search, navigate]);

  const fetchUserData = async (token: string, navigate: any) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("capsule_current_user", JSON.stringify(userData));
        navigate("/dashboard");
      } else {
        console.error("Failed to fetch user data");
        navigate("/dashboard"); // Still try to go to dashboard
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/dashboard");
    }
  };

  return <div>Logging you in...</div>;
};

export default OAuthSuccess;