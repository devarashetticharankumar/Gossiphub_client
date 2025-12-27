import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
} from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand & Description */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center mb-4">
                            <span className="text-2xl font-bold text-red-600 tracking-tighter">
                                GossipHub
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 mb-6">
                            Your daily source for the latest celebrity news, trending gossips, elimination updates, and entertainment stories.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://x.com/Charankumar2580"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="X (Twitter)"
                            >
                                <FaTwitter size={20} />
                            </a>
                            <a
                                href="https://www.instagram.com/gossiphub247?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={20} />
                            </a>
                            <a
                                href="https://youtube.com/@gossiphub24?si=8-DLFlpQD4OxpEmx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="YouTube"
                            >
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
                            Discover
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/posts/category/Celebrity%20News"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Celebrity News
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/posts/category/Film%20Reviews%20&%20Trailers"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Film Reviews
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/posts/category/Political"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Political
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/posts/category/Tech%20News"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Tech News
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/posts/category/Sports"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Sports
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
                            Company
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/editorial-guidelines"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Editorial Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/disclaimer"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Disclaimer
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter (Optional Placeholder) */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
                            Stay Updated
                        </h3>
                        <p className="text-gray-400 text-xs mb-4">
                            Subscribe to get the latest gossip right in your inbox.
                        </p>
                        <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-red-500 text-sm border border-gray-700"
                            />
                            <button
                                type="submit"
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        &copy; {currentYear} GossipHub. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="text-gray-500 hover:text-white text-xs transition-colors">
                            Privacy
                        </Link>
                        <Link to="/terms" className="text-gray-500 hover:text-white text-xs transition-colors">
                            Terms
                        </Link>
                        <Link to="/sitemap.xml" className="text-gray-500 hover:text-white text-xs transition-colors">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
