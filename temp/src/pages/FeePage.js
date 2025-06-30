import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeeStructures } from '../slices/feeSlice';
import FeeStructureForm from '../components/FeeStructureForm';
import { Button } from 'antd'; // Added import

const FeePage = () => {
  const dispatch = useDispatch();
  const { feeStructures} = useSelector((state) => state.fee?.feeStructures||[]);
   const { status } = useSelector((state) => state.fee?.status||"idle");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getFeeStructures());
  }, [dispatch]);

  return (
    <div>
      <h1>Fees</h1>
      {status === 'loading' ? <p>Loading...</p> : <div>{/* Add fee structure list if needed */}</div>}
      <Button type="primary" onClick={() => setIsFormOpen(true)} style={{ marginTop: '20px' }}>
        Add Fee Structure
      </Button>
      <FeeStructureForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default FeePage;