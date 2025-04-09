import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-2 text-2xl font-bold text-gray-800">
              <span className="text-green-500">Fin</span>Track
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Take Control of Your{" "}
            <span className="text-indigo-600">Finances</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Track your expenses, visualize spending patterns, and reach your
            financial goals with our intuitive expense management tool.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="py-3 px-8 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors text-center"
            >
              Get Started Free
            </Link>
            <a
              href="#demo"
              className="py-3 px-8 bg-white text-indigo-600 border border-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors text-center"
            >
              View Demo
            </a>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="bg-white rounded-lg shadow-xl p-6 md:ml-12">
            <div className="mb-4">
              <h3 className="text-gray-500 text-sm font-medium">
                Expenses this week
              </h3>
              <p className="text-2xl font-bold text-gray-900">$127.93</p>
              <span className="text-sm font-medium text-green-500">
                8.5% ↓ from last week
              </span>
            </div>
            <div className="h-48 bg-gray-50 rounded-md p-4 flex items-center justify-center mb-4">
              <div className="w-full h-full relative">
                {/* SVG Path simulating a chart */}
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  <path
                    d="M0,80 Q50,70 100,50 T200,30 L300,10"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="3"
                  />
                  <path
                    d="M0,80 Q50,70 100,50 T200,30 L300,10 L300,100 L0,100 Z"
                    fill="url(#gradient)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                      <stop
                        offset="100%"
                        stopColor="#14b8a6"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Expenses
                </h3>
                <p className="text-xl font-bold text-gray-900">$527.35</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Categories
                </h3>
                <p className="text-xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-indigo-100 rounded-lg h-full w-full -z-10"></div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Everything you need to track, analyze, and optimize your spending
              habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-indigo-100 p-2 rounded-lg inline-block mb-4">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expense Analytics</h3>
              <p className="text-gray-600">
                Visualize your spending patterns with intuitive charts and
                graphs. Identify trends and make informed decisions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-indigo-100 p-2 rounded-lg inline-block mb-4">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Category Management
              </h3>
              <p className="text-gray-600">
                Organize expenses by custom categories. Track spending by
                category and set individual budgets.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-indigo-100 p-2 rounded-lg inline-block mb-4">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Bank-level encryption keeps your financial data safe. Your
                information never leaves your device without your permission.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Start tracking your expenses in three simple steps
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img
                src="/image.png"
                alt="ExpenseTracker Dashboard"
                className="rounded-lg shadow-lg"
              />
            </div>

            <div className="md:w-2/5">
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold mr-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">Create an account</h3>
                </div>
                <p className="text-gray-600 ml-12">
                  Sign up in seconds with just your email address. No credit
                  card required for our free plan.
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold mr-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">
                    Record your expenses
                  </h3>
                </div>
                <p className="text-gray-600 ml-12">
                  Quickly add expenses with our intuitive form. Categorize and
                  add notes for better organization.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold mr-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">
                    Gain financial insights
                  </h3>
                </div>
                <p className="text-gray-600 ml-12">
                  View detailed reports and visualizations of your spending
                  habits. Make informed decisions to improve your finances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-green-500">Fin</span>Track. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
