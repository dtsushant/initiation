import React from "react";
import { Outlet } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";

interface LoginLayoutProps {
  children: React.ReactNode; // Content to be rendered within the main section
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Initiation</h1>
          <nav className="space-x-4">
            <a
              href="#"
              className="text-white hover:text-indigo-200 transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-white hover:text-indigo-200 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area - This is where your login form (children) will be rendered */}
      <main className="flex-grow flex items-center justify-center p-8">
        <Content className="p-6">
          <Outlet />
        </Content>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-sm text-center shadow-inner">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="mb-2 sm:mb-0">
            &copy; 2025 Initiation. All rights reserved.
          </p>
          <nav className="space-x-4">
            <a href="#" className="hover:text-blue-200 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Terms of Service
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LoginLayout;
