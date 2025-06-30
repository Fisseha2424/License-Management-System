// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';

// const NotificationAlert = () => {
//   const { licenses, companies } = useSelector((state) => state.license);

//   useEffect(() => {
//     const today = new Date();
//     licenses.forEach((license) => {
//       const expiryDate = new Date(license.ExpiryDate);
//       const notifyDays = license.NotifyBeforeXDays || 30;
//       const notifyDate = new Date(expiryDate);
//       notifyDate.setDate(expiryDate.getDate() - notifyDays);

//       if (today >= notifyDate && today <= expiryDate) {
//         const company = companies.find((c) => c.CompanyID === license.CompanyID);
//         toast.warn(
//           `License for ${license.ProductName} (Company: ${company?.CompanyName || 'Unknown'}) is expiring on ${expiryDate.toLocaleDateString()}`,
//           { autoClose: 5000 }
//         );
//       }
//     });
//   }, [licenses, companies]);

//   return null; // Component doesn't render UI
// };

// export default NotificationAlert;

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const NotificationAlert = () => {
  const { licenses, companies } = useSelector((state) => state.license);

  // useEffect(() => {
  //   const today = new Date();
  //   licenses.forEach((license) => {
  //     const expiryDate = new Date(license.ExpiryDate);
  //     const notifyDays = license.NotifyBeforeXDays || 30;
  //     const notifyDate = new Date(expiryDate);
  //     notifyDate.setDate(expiryDate.getDate() - notifyDays);

  //     if (today >= notifyDate && today <= expiryDate) {
  //       const company = companies.find((c) => c.companyID === license.CompanyID); // Adjusted to companyID
  //       toast.warn(
  //         `License for ${license.ProductName} (Company: ${company?.companyName || 'Unknown'}) is expiring on ${expiryDate.toLocaleDateString()}`,
  //         { autoClose: 5000 }
  //       );
  //     }
  //   });
  // }, [licenses, companies]);

  return null; // Component doesn't render UI
};

export default NotificationAlert;