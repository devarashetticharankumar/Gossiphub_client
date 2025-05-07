import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiArrowUp,
  HiDocumentText,
  HiHeart,
  HiChatAlt,
  HiPlus,
  HiBell,
  HiUser,
  HiFire,
} from "react-icons/hi";
import { getPosts, getUserProfile } from "../utils/api";
import Logo from "../assets/GossippHublogo.svg";

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [displayedCount, setDisplayedCount] = useState(6);
  const POSTS_PER_PAGE = 7;
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes] = await Promise.all([getPosts()]);
        setPosts(postsRes);
        const uniqueCategories = [
          "All",
          ...new Set(postsRes.map((post) => post.category || "General")),
        ];
        setCategories(uniqueCategories);

        if (isAuthenticated) {
          try {
            const userRes = await getUserProfile();
            setUser(userRes);

            // Display toast notifications based on streak updates
            if (userRes.streak === 1 && !userRes.lastLogin) {
              toast.success("🎉 Welcome! Your streak has started: 1 day!");
            } else if (userRes.streak > userRes.streak) {
              toast.success(`🔥 Day ${userRes.streak} Streak! Keep it up!`);
            } else if (userRes.streak < userRes.streak) {
              if (userRes.streak === 0) {
                toast.info("🕒 Streak reset to 0 days. Let's start again!");
              } else {
                toast.info(
                  `🕒 Streak decreased to ${userRes.streak} days! Log in daily to keep it up!`
                );
              }
            }

            // Check for daily streak and weekly milestone rewards
            const dailyReward = `Day ${userRes.streak} Streak`;
            if (
              userRes.streak !== userRes.streak &&
              userRes.streakRewards.includes(dailyReward)
            ) {
              toast.success(`🏆 ${dailyReward} Achieved!`);
            }

            // Check for weekly milestones
            if (userRes.streak !== userRes.streak && userRes.streak % 7 === 0) {
              const weekNumber = userRes.streak / 7;
              const milestoneReward = `Week ${weekNumber} Milestone`;
              if (userRes.streakRewards.includes(milestoneReward)) {
                toast.success(`🎉 ${milestoneReward} Achieved!`);
              }
            }
          } catch (err) {
            toast.error("Failed to fetch user profile");
          }
        }
      } catch (err) {
        toast.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    setDisplayedCount(POSTS_PER_PAGE);
  }, [selectedCategory]);

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter(
          (post) => (post.category || "General") === selectedCategory
        );

  const displayedPosts = filteredPosts.slice(0, displayedCount);

  const loadMore = () => {
    setDisplayedCount((prev) => prev + POSTS_PER_PAGE);
  };

  const profileImage = isAuthenticated
    ? user?.profilePicture
      ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${
          user.profilePicture
        }`
      : "https://via.placeholder.com/150"
    : null;

  const featuredPost = displayedPosts.length > 0 ? displayedPosts[0] : null;
  const remainingPosts = displayedPosts.slice(1);

  const videoPosts = displayedPosts
    .filter((post) => post.media?.endsWith(".mp4"))
    .slice(0, 5);

  const photoPosts = displayedPosts
    .filter((post) => post.media && !post.media.endsWith(".mp4"))
    .slice(0, 5);
  const mostViewedPosts = displayedPosts
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 3);

  const latestStories = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const trends = posts
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 3)
    .map((post) => ({
      postId: post._id,
      title: post.title,
      category: post.category || "General",
    }));

  const recentComments = posts
    .flatMap((post) =>
      (post.comments || []).map((comment) => ({
        postId: post._id,
        postTitle: post.title,
        commentText: comment.text,
        commentDate: comment.createdAt,
      }))
    )
    .sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate))
    .slice(0, 4);

  // Filter milestone rewards
  const milestoneRewards =
    user?.streakRewards?.filter((reward) => reward.startsWith("Week ")) || [];

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex md:justify-between justify-center items-center">
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="GossippHub Logo"
              className="h-10 md:h-12 rounded-md"
              aria-label="GossippHub Home"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-3">
            <Link
              to="/create-post"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Create Post
            </Link>
            <Link
              to="/notifications"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Notifications
            </Link>
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-orange-500 rounded-full px-3 py-1">
                  <HiFire className="h-5 w-5 text-white mr-1" />
                  <span className="text-sm font-medium">
                    {user?.streak || 0} {user?.streak !== 1 ? " " : ""}
                  </span>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center"
                  aria-label="Profile"
                >
                  <img
                    src={profileImage || "https://via.placeholder.com/150"}
                    alt="User profile picture"
                    className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-gray-200 transition-all duration-200"
                  />
                </Link>
              </div>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="flex items-center"
                aria-label="Login"
              >
                <img
                  src="https://via.placeholder.com/150"
                  alt="Login"
                  className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-gray-200 transition-all duration-200"
                />
              </Link>
            )}
          </nav>
        </div>
        <div className="bg-white text-gray-700 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm font-medium uppercase tracking-wide ${
                  selectedCategory === category
                    ? "text-red-600 border-b-2 border-red-600"
                    : "hover:text-red-600"
                } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500`}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-40 md:pt-36 pb-12">
        {featuredPost && (
          <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <Link to={`/posts/${featuredPost._id}`}>
                  <div className="relative">
                    {featuredPost.media && (
                      <img
                        src={`${import.meta.env.VITE_API_URL.replace(
                          "/api",
                          ""
                        )}${featuredPost.media}`}
                        alt="Featured post"
                        className="w-full h-64 md:h-96 object-cover rounded-lg"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <span className="text-xs font-medium text-white bg-red-600 rounded px-2 py-1">
                        {featuredPost.category || "General"}
                      </span>
                      <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-200 mt-1 line-clamp-2">
                        {featuredPost.description
                          .split("\n\n")
                          .map((paragraph, pIdx) => (
                            <div
                              key={pIdx}
                              className="mb-4 last:mb-0"
                              dangerouslySetInnerHTML={{ __html: paragraph }}
                            />
                          ))}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Comments
                </h3>
                <ul className="space-y-3">
                  {recentComments.length > 0 ? (
                    recentComments.map((comment, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        <Link
                          to={`/posts/${comment.postId}`}
                          className="font-medium text-gray-900 hover:text-red-600"
                        >
                          {comment.postTitle.length > 40
                            ? `${comment.postTitle.slice(0, 40)}...`
                            : comment.postTitle}
                        </Link>
                        <p className="text-gray-600 mt-1 line-clamp-1">
                          {comment.commentText}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.commentDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">
                      No recent comments available.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : remainingPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <HiDocumentText className="mx-auto h-24 w-24 text-red-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  No Gossips in {selectedCategory}!
                </h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto text-sm">
                  Spill some tea and get the conversation started!
                </p>
                <Link
                  to="/create-post"
                  className="mt-6 inline-block px-6 py-2.5 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  Share Your Gossip
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {remainingPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {post.media && (
                        <div className="sm:w-1/3">
                          {post.media.endsWith(".mp4") ? (
                            <video
                              src={`${import.meta.env.VITE_API_URL.replace(
                                "/api",
                                ""
                              )}${post.media}`}
                              controls
                              className="w-full h-40 object-cover"
                            />
                          ) : (
                            <img
                              src={`${import.meta.env.VITE_API_URL.replace(
                                "/api",
                                ""
                              )}${post.media}`}
                              alt="Post media"
                              className="w-full h-40 object-cover"
                            />
                          )}
                        </div>
                      )}
                      <div className="p-4 sm:w-2/3">
                        <span className="text-xs font-medium text-white bg-red-600 rounded px-2 py-1">
                          {post.category || "General"}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-2">
                          <Link
                            to={`/posts/${post._id}`}
                            className="hover:text-red-600 transition-colors duration-200"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {post.description
                            .split("\n\n")
                            .map((paragraph, pIdx) => (
                              <div
                                key={pIdx}
                                className="mb-4 last:mb-0"
                                dangerouslySetInnerHTML={{ __html: paragraph }}
                              />
                            ))}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                          <p>
                            By{" "}
                            {post.isAnonymous
                              ? "Anonymous"
                              : post.author?.username || "Unknown"}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center">
                              <HiHeart className="h-4 w-4 text-red-400 mr-1" />
                              {post.likes?.length || 0}
                            </span>
                            <span className="flex items-center">
                              <HiChatAlt className="h-4 w-4 text-blue-400 mr-1" />
                              {post.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {remainingPosts.length < filteredPosts.length - 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Load more posts"
                >
                  Load More
                </button>
              </div>
            )}
          </div>

          <div className="md:w-1/3 space-y-6">
            {isAuthenticated && (
              <section className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <HiFire className="h-6 w-6 text-orange-500 mr-2" />
                  Your Daily Streak
                </h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {user?.streak || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Day{user?.streak !== 1 ? "s" : ""} Streak
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Streak Achievements
                  </h4>
                  {user?.streakRewards?.length > 0 ? (
                    <ul className="space-y-2">
                      {user.streakRewards.map((reward, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <span className="mr-2 text-2xl">
                            {reward.startsWith("Day ") ? "🔥" : "🎉"}
                          </span>
                          {reward}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No streak achievements yet. Log in daily to keep your
                      streak going!
                    </p>
                  )}
                </div>
              </section>
            )}

            <section className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Latest Stories
              </h3>
              <div className="space-y-4">
                {latestStories.length > 0 ? (
                  latestStories.map((story) => (
                    <Link
                      key={story._id}
                      to={`/posts/${story._id}`}
                      className="flex gap-3"
                    >
                      {story.media && (
                        <img
                          src={`${import.meta.env.VITE_API_URL.replace(
                            "/api",
                            ""
                          )}${story.media}`}
                          alt="Story thumbnail"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 hover:text-red-600">
                          {story.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {story.category || "General"}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No recent stories available.
                  </p>
                )}
              </div>
            </section>

            <section className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Most Viewed
              </h3>
              <div className="space-y-4">
                {mostViewedPosts.map((post) => (
                  <div key={post._id} className="flex gap-3">
                    {post.media && (
                      <img
                        src={`${import.meta.env.VITE_API_URL.replace(
                          "/api",
                          ""
                        )}${post.media}`}
                        alt="Most viewed post"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <Link
                        to={`/posts/${post._id}`}
                        className="text-sm font-medium text-gray-900 hover:text-red-600"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {post.category || "General"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trends</h3>
              <div className="space-y-3">
                {trends.length > 0 ? (
                  trends.map((trend, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-2 last:border-b-0"
                    >
                      <Link
                        to={`/posts/${trend.postId}`}
                        className="text-sm font-medium text-gray-900 hover:text-red-600"
                      >
                        {trend.title}
                      </Link>
                      <p className="text-xs text-gray-500">{trend.category}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No trending posts available.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        <section className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {photoPosts.length > 0 ? (
              photoPosts.map((post) => (
                <Link key={post._id} to={`/posts/${post._id}`}>
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace(
                        "/api",
                        ""
                      )}${post.media}`}
                      alt="Photo post"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                      <p className="text-xs line-clamp-1">{post.title}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No photos available.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-red-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <Link to="/about" className="text-sm hover:underline">
              About Us
            </Link>
            <Link to="/privacy" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-sm hover:underline">
              Contact Us
            </Link>
          </div>
          <p className="text-sm">© 2025 GossipHub. All rights reserved.</p>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
        <div className="flex justify-around items-center py-3 px-4">
          <Link
            to="/create-post"
            className="p-3 rounded-full bg-red-100 hover:bg-red-200 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Create Post"
            title="Create Post"
          >
            <HiPlus className="h-6 w-6 text-red-600" />
          </Link>
          <Link
            to="/notifications"
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Notifications"
            title="Notifications"
          >
            <HiBell className="h-6 w-6 text-gray-600" />
          </Link>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label={isAuthenticated ? "Profile" : "Login"}
            title={isAuthenticated ? "Profile" : "Login"}
          >
            {isAuthenticated ? (
              <div className="relative">
                <img
                  src={profileImage || "https://via.placeholder.com/150"}
                  alt="User profile picture"
                  className="h-8 w-8 rounded-full object-cover border-2 border-gray-500 hover:border-gray-600 transition-all duration-200"
                />
                <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
                  <HiFire className="h-4 w-4 text-white" />
                </div>
              </div>
            ) : (
              <HiUser className="h-6 w-6 text-gray-600" />
            )}
          </Link>
        </div>
      </nav>

      {displayedPosts.length > 5 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 md:bottom-4 right-4 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Back to top"
        >
          <HiArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default PostList;
