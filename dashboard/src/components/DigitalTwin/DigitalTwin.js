import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, BarChart2 } from 'lucide-react';

const API_URL = 'https://cmti-edge.online/OPCUA/digitaltwin.php';
const FETCH_INTERVAL = 100; // 100 milliseconds

const Card = ({ children, title, icon: Icon }) => (
  <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg p-6 mb-8 w-full lg:w-[calc(50%-1rem)] transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 mr-3 text-blue-600" />
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const DigitalTwin = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const newData = response.data;

        setData1(prevData => {
          const updatedData = [...prevData, newData.graph1];
          return updatedData.slice(-100); // Keep only the last 100 data points
        });

        setData2(prevData => {
          const updatedData = [...prevData, newData.graph2];
          return updatedData.slice(-100); // Keep only the last 100 data points
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(fetchData, FETCH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const renderGraph = (data, title, icon) => (
    <Card title={title} icon={icon}>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="timestamp" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="pulse" stroke="#3b82f6" strokeWidth={2} name="Pulse Line" dot={false} />
            <Line type="monotone" dataKey="position" stroke="#10b981" strokeWidth={2} name="Realtime Position Output" dot={false} />
            <Line type="monotone" dataKey="modal" stroke="#f59e0b" strokeWidth={2} name="Modal Output" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-9">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-12">
          Digital Twin Graphs
        </h1>
        <div className="flex flex-col lg:flex-row justify-between items-start space-y-8 lg:space-y-0 lg:space-x-8">
          {renderGraph(data1, "Response Plot", Activity)}
          {renderGraph(data2, "Degradation Plot", TrendingUp)}
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;