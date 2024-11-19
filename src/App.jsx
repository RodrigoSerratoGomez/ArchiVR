import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import Level1 from "./levels/level-1/Level1";
import Level2 from "./levels/level-2/Level2";
import Level3 from "./levels/level-3/Level3";
import Level4 from "./levels/level-4/Level4";
import AvatarForm from "./pages/AvatarForm";
import FeedbackSelection from "./pages/FeedbackSelection";
import LevelSelection from "./pages/LevelSelection";
import Login from "./pages/Login";
import MainMenu from "./pages/MainMenu";
import ProgressDetail from "./pages/ProgressDetail";
import ProgressSelection from "./pages/ProgressSelection";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainMenu />
              </PrivateRoute>
            }
          />

          <Route
            path="/play"
            element={
              <PrivateRoute>
                <LevelSelection />
              </PrivateRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <ProgressSelection />
              </PrivateRoute>
            }
          />

          <Route
            path="/progress/level/:levelId"
            element={
              <PrivateRoute>
                <ProgressDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <FeedbackSelection />
              </PrivateRoute>
            }
          />

          <Route
            path="/level1"
            element={
              <PrivateRoute>
                <Level1 />
              </PrivateRoute>
            }
          />

          <Route
            path="/level2"
            element={
              <PrivateRoute>
                <Level2 />
              </PrivateRoute>
            }
          />

          <Route
            path="/level3"
            element={
              <PrivateRoute>
                <Level3 />
              </PrivateRoute>
            }
          />

          <Route
            path="/level4"
            element={
              <PrivateRoute>
                <Level4 />
              </PrivateRoute>
            }
          />

          <Route path="/avatar" element={<AvatarForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
