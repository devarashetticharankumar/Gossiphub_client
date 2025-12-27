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
                            No Warranties
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-4`}>
                            GossipHub makes no representations about the suitability, reliability, availability, timeliness, and accuracy of the information, products, services and related graphics contained on the GossipHub website for any purpose. We are not responsible for any errors, omissions or representations on any of our pages or on any links on any of our pages. All such information, software, products, services and related graphics are provided “as is” without warranty of any kind. GossipHub hereby disclaim all warranties and conditions with regard to this information, software, products, services and related graphics, including all implied warranties and conditions of merchantability, fitness for a particular purpose, title and non-infringement.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Limitation of Liability
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-4`}>
                            In no event shall GossipHub be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected with the use or performance of the GossipHub websites, with the delay or inability to use the GossipHub website or related services, the provision of or failure to provide services, or for any information, software, products, services and related graphics obtained through the GossipHub websites, or otherwise arising out of the use of the GossipHub website, whether based on contract, negligence, strict liability or otherwise, even if GossipHub or any of its suppliers has been advised of the possibility of damages.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Links and Advertisers
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-4`}>
                            We do not endorse, in any way, any advertisers on our web pages. Please verify the veracity of all information on your own before undertaking any reliance. The linked sites are not under our control and we are not responsible for the contents of any linked site or any link contained in a linked site, or any changes or updates to such sites. We are providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by us of the site.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                            Jurisdiction and Terms
                        </h2>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-4`}>
                            We hereby expressly disclaim any implied warranties imputed by the laws of any jurisdiction. We consider ourselves and intend to be subject to the jurisdiction only of the courts of the state of Telangana, India. We would also like to make it clear that by visiting GossipHub you are giving us permission to edit or delete your comments posted for reasons best known to us.
                        </p>
                        <p className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                            At any stage if you are dissatisfied with any portion of the GossipHub website, or with any of these terms of use, your sole and exclusive remedy is to discontinue using the GossipHub website.
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
