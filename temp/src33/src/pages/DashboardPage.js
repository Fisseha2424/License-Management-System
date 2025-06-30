import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getLicenses, getSessions } from '../slices/dashboardSlice';
import NotificationAlert from '../components/NotificationAlert';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { licenses, sessions } = useSelector((state) => state.dashboard);

  // useEffect(() => {
  //   dispatch(getLicenses());
  //   dispatch(getSessions());
  // }, [dispatch]);

  const deviceStats = licenses.reduce((acc, license) => {
    acc[license.companyID] = (acc[license.companyID] || 0) + (license.NoOfDevices || 0);
    return acc;
  }, {});

  const data = {
    labels: Object.keys(deviceStats),
    datasets: [{
      label: 'Devices per Company',
      data: Object.values(deviceStats),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>Active Sessions: {sessions.length}</div>
      {/* Use Chart from antd or another library if needed */}
      {/* <Chart type="bar" data={data} /> */}
      <p>Chart placeholder (add Chart component if needed)</p>
      <NotificationAlert />
    </div>
  );
};

export default DashboardPage;