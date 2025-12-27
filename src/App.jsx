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
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import EditorialGuidelines from "./pages/EditorialGuidelines";
import Disclaimer from "./pages/Disclaimer";
import PublicUserProfile from "./components/PublicUserProfile";

// import ChatContainer from "./components/ChatContainer";
// import ChatClient from "./components/ChatClient";
import UpdatePostForm from "./components/UpdatePostForm";
import StoryZone from "./components/StoryZone"; // Import the new component
import HashtagPosts from "./components/HashtagPosts";
import ShortsFeed from "./components/ShortsFeed";
import ShortVideoForm from "./components/ShortVideoForm";
import ShortVideoUpdateForm from "./components/ShortVideoUpdateForm";
import CategoryPosts from "./components/CategoryPosts";
import Footer from "./components/Footer";


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
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/editorial-guidelines" element={<EditorialGuidelines />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/profile/:userId" element={<PublicUserProfile />} />
        <Route path="/shorts/:Id" element={<ShortsFeed />} />
        <Route path="/shorts/" element={<ShortsFeed />} />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-short"
          element={
            <ProtectedRoute>
              <ShortVideoForm />
            </ProtectedRoute>
          }
        />
        <Route path="/stories" element={<StoryZone />} />
        <Route
          path="/posts/:postId/edit"
          element={
            <ProtectedRoute>
              <UpdatePostForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shorts/:shortId/edit"
          element={
            <ProtectedRoute>
              <ShortVideoUpdateForm />
            </ProtectedRoute>
          }
        />

        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route path="/posts/hashtag/:hashtag" element={<HashtagPosts />} />
        <Route path="/posts/category/:category" element={<CategoryPosts />} />

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
        {/* <Route
          path="/chat"
          element={<ProtectedRoute>{<ChatClient />}</ProtectedRoute>}
        /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
