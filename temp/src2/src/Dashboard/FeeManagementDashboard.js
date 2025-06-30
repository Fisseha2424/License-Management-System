// import React from "react";
// import { Link } from "react-router-dom";
// import CardView from "../components/CardView";

// const FeeManagementDashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <CardView>
//         <h1 className="text-2xl font-bold mb-4">Manage Fees</h1>
//         <Link to="/fees" className="block mt-4 text-blue-500 hover:underline">
//           Go to Manage Fees
//         </Link>
//       </CardView>
//
//</div>
//   );
// };

// export default FeeManagementDashboard;

"use client";
import { Link } from "react-router-dom";
import { Card, Row, Col, Button } from "antd";
import {
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import CardView from "../components/CardView";

const FeeManagementDashboard = () => {
  const cardStyle = {
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const cardHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  };

  return (
    <div className="fee-management-dashboard p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Fee Management
        </h1>
        <p className="text-gray-600">
          Manage fee structures, reports, and adjustments
        </p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={cardStyle}
            hoverable
            className="h-full"
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, cardStyle);
            }}
          >
            <div className="text-center p-4">
              <DollarOutlined
                style={{
                  fontSize: "48px",
                  color: "#1890ff",
                  marginBottom: "16px",
                }}
              />
              <CardView>
                <h1 className="text-2xl font-bold mb-4">Manage Fee</h1>
                <Link
                  to="/fee-management/manage"
                  className="block mt-4 text-blue-500 hover:underline"
                >
                  Go to Fee Management
                </Link>
              </CardView>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FeeManagementDashboard;
