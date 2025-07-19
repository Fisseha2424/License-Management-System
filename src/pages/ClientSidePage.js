
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLicense } from '../slices/ClientSideSlice';

function ClientSidePage() {
  const [companyId] = useState('8cc83358-ce28-4810-a56c-887ae7196d54'); // Hardcoded companyId
  const dispatch = useDispatch();
  const { licenseData, message, loading, error } = useSelector((state) => state.clientSide);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchLicense(companyId));
    }
  }, [dispatch, companyId]);

  const handleCheckExpiryDate = () => {
    if (licenseData) {
      const currentDate = new Date('2025-07-16T15:18:00+03:00'); // Current date: 03:18 PM EAT, July 16, 2025
      const expiryDate = new Date(licenseData.expiryDate);
      if (expiryDate.toDateString() === currentDate.toDateString()) {
        dispatch({ type: 'clientSide/setMessage', payload: 'No update' });
      } else if (expiryDate > currentDate) {
        dispatch({ type: 'clientSide/setMessage', payload: 'The license will update' });
      } else {
        dispatch({ type: 'clientSide/setMessage', payload: 'License has expired' });
      }
    }
  };

  return (
    <div>
      <h2>License Expiry Check</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {licenseData && (
        <div>
          <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '10px' }}>License Details</h3>
          <pre style={{ marginBottom: '10px', borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
            {JSON.stringify(licenseData, null, 2)}
          </pre>
          {licenseData.validityMessage && <p style={{ color: 'red' }}>{licenseData.validityMessage}</p>}
          <div style={{ textAlign: 'left', marginTop: '10px' }}>
            <button
              onClick={handleCheckExpiryDate}
              disabled={loading}
              style={{
                backgroundColor: '#8B4513', // Brown rectangle
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Check Expiry Date
            </button>
          </div>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
}

export default ClientSidePage;



// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchLicense, fetchLocalExpiryDate, fetchUpdateLicense } from './clientSideSlice';

// function ClientSidePage() {
//   const [companyId] = useState('0a636d14-0771-4b12-ad0e-71a49ffae9b8'); // Hardcoded companyId
//   const dispatch = useDispatch();
//   const { licenseData, localExpiryDate, message, loading, error } = useSelector((state) => state.clientSide);

//   useEffect(() => {
//     if (companyId) {
//       dispatch(fetchLicense(companyId));
//     }
//   }, [dispatch, companyId]);

//   const handleCheckExpiryDate = () => {
//     if (companyId && !localExpiryDate) {
//       dispatch(fetchLocalExpiryDate());
//     }
//   };

//   const handleUpdateLicense = () => {
//     if (companyId && message === 'The license will update') {
//       dispatch(fetchUpdateLicense(companyId));
//     }
//   };

//   return (
//     <div>
//       <h2>License Expiry Check</h2>
//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}
//       {licenseData && (
//         <div>
//           <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '10px' }}>License Details</h3>
//           <pre style={{ marginBottom: '10px', borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
//             {JSON.stringify(licenseData, null, 2)}
//           </pre>
//           {licenseData.validityMessage && <p style={{ color: 'red' }}>{licenseData.validityMessage}</p>}
//           <div style={{ textAlign: 'left', marginTop: '10px' }}>
//             <button
//               onClick={handleCheckExpiryDate}
//               disabled={loading}
//               style={{
//                 backgroundColor: '#8B4513', // Brown rectangle
//                 color: 'white',
//                 padding: '10px 20px',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//               }}
//             >
//               Check Expiry Date
//             </button>
//             {message === 'The license will update' && (
//               <button
//                 onClick={handleUpdateLicense}
//                 disabled={loading}
//                 style={{
//                   backgroundColor: '#006400', // Dark green rectangle
//                   color: 'white',
//                   padding: '10px 20px',
//                   border: 'none',
//                   borderRadius: '5px',
//                   cursor: 'pointer',
//                   marginLeft: '10px',
//                 }}
//               >
//                 Update License
//               </button>
//             )}
//           </div>
//           {message && <p>{message}</p>}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ClientSidePage;