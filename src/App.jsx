import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Register from "./components/Register";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import PostDetails from "./components/PostDetails";
import AdminDashboard from "./components/AdminDashboard";
import NotificationList from "./components/NotificationList";
import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PublicUserProfile from "./components/PublicUserProfile";
// import ShortsFeed from "./components/ShortsFeed";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PostList />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/profile/:userId" element={<PublicUserProfile />} />
        {/* <Route path="/shorts" element={<ShortsFeed />} /> */}

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }
        />
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationList />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
