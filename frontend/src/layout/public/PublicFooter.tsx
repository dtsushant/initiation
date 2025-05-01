import React from "react";
import { Layout as AntdLayout } from "antd";

const { Footer } = AntdLayout;

export function PublicFooter() {
  return (
    <Footer className="bg-white text-center text-sm text-gray-500 py-4 border-t">
      © {new Date().getFullYear()} Initiation — All rights reserved. |{" "}
      <a href="#" className="text-blue-500 hover:underline">
        Contact Us
      </a>{" "}
      |{" "}
      <a href="#" className="text-blue-500 hover:underline">
        Privacy Policy
      </a>
    </Footer>
  );
}
