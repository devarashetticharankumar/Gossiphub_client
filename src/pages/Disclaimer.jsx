import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/GossippHublogo.svg";

const Disclaimer = () => {
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
                    Disclaimer
                </h1>
                <div
                    className={`${isDarkMode ? "bg-gray-900" : "bg-white"
                        } rounded-lg p-6 shadow-lg transition-colors duration-500`}
                >
                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            General Disclaimer
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            The information provided on GossipHub (gossiphub.in) is for general informational and entertainment purposes only.
                            All information on the site is provided in good faith; however, we make no representation or warranty of any kind,
                            express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any
                            information on the site.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            External Links Disclaimer
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            The site may contain (or you may be sent through the site to) links to other websites or content belonging to or
                            originating from third parties or links to websites and features in banners or other advertising. Such external links
                            are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness
                            by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information
                            offered by third-party websites linked through the site.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Professional Disclaimer
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            The site cannot and does not contain medical/legal/financial advice. The entertainment information is provided for
                            general informational and educational purposes only and is not a substitute for professional advice. Accordingly,
                            before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
                            We do not provide any kind of medical/legal/financial advice. The use or reliance of any information contained on the
                            site is solely at your own risk.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Rumors / Gossip Disclaimer
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            Rumors are clearly labeled as such and should not be treated as verified facts.
                        </p>
                    </section>


                    <section className="mb-6">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Affiliates Disclaimer
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            The site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by
                            you on the affiliate website using such links.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
