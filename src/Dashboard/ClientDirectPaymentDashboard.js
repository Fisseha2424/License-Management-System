import React from "react";
import { Card, Row, Col } from "antd";
import PaymentPage from "../pages/PaymentPage";
// import AssociatePayment from "../pages/AssociatePayment";

const PaymentManagementDashboard = () => {
  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Management Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Payment Management" bordered={false}>
            <PaymentPage />
          </Card>
        </Col>
        {/* <Col span={24}>
          <Card title="Associate Payments" bordered={false}>
            <AssociatePayment />
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default PaymentManagementDashboard;
