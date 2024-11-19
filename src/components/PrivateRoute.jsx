import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserData } from "../firebase/firestoreService";
import Loading from "../pages/Loading";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (currentUser) {
        const userData = await getUserData("avatars", currentUser.uid);

        if (userData && userData.hasCompletedProfile) {
          setHasCompletedProfile(true);
        } else {
          setHasCompletedProfile(false);
        }
      }
      setLoading(false);
    };

    checkUserProfile();
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser && !hasCompletedProfile) {
    return <Navigate to="/avatar" />;
  }

  return children;
};

export default PrivateRoute;
