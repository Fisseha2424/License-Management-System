
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getPayments, initiatePayment } from '../slices/paymentSlice';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { payments, status } = useSelector((state) => state.payment);

  // useEffect(() => {
  //   dispatch(getPayments('someCompanyId')); // Replace with dynamic ID if needed
  // }, [dispatch]);

  return (
    <div>
      <h1>Payments</h1>
      {status === 'loading' ? <p>Loading...</p> : payments.map(payment => <div key={payment.PaymentID}>{payment.amount}</div>)}
    </div>
  );
};

export default PaymentPage;