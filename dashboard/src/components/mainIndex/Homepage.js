import React, { useEffect, useState } from 'react';
import { Activity, Thermometer, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import cmtilogo from "../../assets/cmti.png";
import orthogif from "../../assets/orthogonal.gif";

const HomePage = () => {
  const navigate = useNavigate();
  const [machineStatus, setMachineStatus] = useState('off');
  const [tempData, setTempData] = useState({});
  const [vibrationData, setVibrationData] = useState({});

  useEffect(() => {
    const tempSource = new EventSource('https://cmti-edge.online/OPCUA/temperature.php');
    const vibrationSource = new EventSource('https://cmti-edge.online/OPCUA/Vibration.php');

    tempSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTempData(data);
    };

    vibrationSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setVibrationData(data);
    };

    return () => {
      tempSource.close();
      vibrationSource.close();
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <img src={cmtilogo} alt="CMTI Logo" className="h-12 sm:h-16" />
          <h1 className="text-2xl sm:text-4xl font-bold text-center font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Central Manufacturing Technology Institute
          </h1>
        </header>

        <div className="relative py-8 mb-12">
          <div className="absolute inset-0 bg-blue-500 opacity-10 transform -skew-y-2"></div>
          <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white leading-tight">
            Development of Digital Twin Of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
              Induction Motor and Feed Drive Axis
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DashboardCard title="Spindle" icon={<Activity className="w-8 h-8 text-blue-400" />}>
            <img src={orthogif} alt="Spindle" className="w-full h-48 object-cover rounded-lg mb-4" />
            <button onClick={() => navigate('/spindle')} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mb-4">
              Spindle Page
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataTable
                title="Temperature Data (°C)"
                headers={['Xp', 'Xm', 'Xb', 'Y', 'Yb']}
                data={tempData}
                icon={<Thermometer className="w-6 h-6 text-red-400" />}
              />
              <DataTable 
                title="Vibration Data (mm/sec)"
                headers={['X', 'Y', 'Z', 'Couple']}
                data={vibrationData}
                icon={<Activity className="w-6 h-6 text-green-400" />}
              />
            </div>
          </DashboardCard>

          <DashboardCard title="Feed Drive" icon={<Zap className="w-8 h-8 text-yellow-400" />}>
            <img src={orthogif} alt="Feed Drive" className="w-full h-48 object-cover rounded-lg mb-4" />
            <button onClick={() => navigate('/feed-drive')} className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mb-4">
              Feed Drive Page
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataTable 
                title="Temperature Data (°C)" 
                headers={['Xp', 'Xm', 'Xb', 'Y', 'Yb']}
                data={tempData}
                icon={<Thermometer className="w-6 h-6 text-red-400" />}
              />
              <DataTable 
                title="Vibration Data (mm/sec)" 
                headers={['X', 'Y', 'Z', 'Couple']}
                data={vibrationData}
                icon={<Activity className="w-6 h-6 text-green-400" />}
              />
            </div>
          </DashboardCard>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
          <StatusIndicator status={machineStatus} />
          <StatusIndicator status={machineStatus} />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, icon, children }) => (
  <div className="bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold ml-2">{title}</h3>
    </div>
    {children}
  </div>
);

const DataTable = ({ title, headers, data, icon }) => (
  <div className="overflow-x-auto">
    <div className="flex items-center mb-2">
      {icon}
      <h4 className="text-lg font-semibold ml-2">{title}</h4>
    </div>
    <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="py-2 px-4 border-b border-gray-600 text-left">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {headers.map((header, index) => (
            <td key={index} className="py-2 px-4 border-b border-gray-600">{data[header] !== undefined ? data[header].toFixed(2) : 'N/A'}</td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

const StatusIndicator = ({ status }) => (
  <div className="flex items-center bg-gray-700 rounded-full px-4 py-2">
    <span className={`h-3 w-3 rounded-full ${getStatusColor(status)} animate-pulse mr-2`}></span>
    <span className="text-lg">Machine Status: {status.charAt(0).toUpperCase() + status.slice(1)}</span>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'on': return 'bg-green-500';
    case 'ideal': return 'bg-yellow-500';
    default: return 'bg-red-500';
  }
};

export default HomePage;