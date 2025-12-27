import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/GossippHublogo.svg";

const EditorialGuidelines = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("darkMode");
        if (saved) setIsDarkMode(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"
                } transition-colors duration-500 font-sans antialiased`}
        >
            {/* Sticky Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-md transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <img
                            src={Logo}
                            alt="GossipHub Logo"
                            className="h-10 rounded-md"
                            aria-label="GossipHub Home"
                        />
                    </Link>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
                        aria-label={
                            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                        }
                    >
                        {isDarkMode ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                <h1
                    className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"
                        } mb-6 transition-colors duration-500`}
                >
                    Editorial Guidelines
                </h1>
                <div
                    className={`${isDarkMode ? "bg-gray-900" : "bg-white"
                        } rounded-lg p-6 shadow-lg transition-colors duration-500`}
                >
                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Introduction
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            At GossipHub, we are committed to providing our readers with accurate, engaging, and ethical content.
                            Our editorial guidelines ensure that we maintain high standards of journalism while delivering the latest
                            entertainment news and updates.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Accuracy and Fact-Checking
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            We strive to verify all information before publication. Our team checks sources, cross-references claims,
                            and ensures that rumors are clearly labeled as such. If we make an error, we are committed to correcting
                            it promptly and transparently.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Corrections Policy
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            Transparency is key to trust. If a story contains factual errors, we will update the article with a
                            correction note. Readers can report errors by contacting us at gossiphub@gmail.com.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Plagiarism and Originality
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            We have a zero-tolerance policy for plagiarism. All content on GossipHub is original or properly attributed
                            to its source. We credit photographers, authors, and other publications whenever we use third-party material.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Image Usage Policy
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            Images used on GossipHub are either owned by us, used with permission, or sourced from official promotional materials for news and editorial purposes only.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Community Standards
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            We encourage healthy debate and discussion. However, hate speech, harassment, and spam are strictly prohibited
                            in our comments sections and community interactions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default EditorialGuidelines;
