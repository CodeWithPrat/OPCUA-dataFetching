import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more'; // Import the Highcharts more module for additional chart types
import axios from 'axios';

// Initialize the gauge module
HighchartsMore(Highcharts);

// Reusable component for individual gauges
const GaugeChart = ({ title, unit, maxValue, data, color1 }) => {
    const options = {
        chart: {
            type: 'gauge',
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor: null, // Optional: set background color
        },
        title: {
            text: title,
            style: { color: '#ffffff', fontSize: '22px', fontWeight: 'bold' },
        },
        pane: {
            startAngle: -150,
            endAngle: 150,
        },
        yAxis: {
            min: 0,
            max: maxValue,
            lineColor: color1,
            tickColor: color1,
            minorTickColor: color1,
            offset: -25,
            lineWidth: 3,
            labels: {
                distance: -20,
                rotation: 'auto',
                style: { color: '#ffffff' },
            },
            tickLength: 15,
            minorTickLength: 8,
        },
        series: [
            {
                name: title,
                data: [data],
                dataLabels: {
                    format: `<span style="color:${color1}; font-size: 18px;">{y} ${unit}</span>`,
                },
                tooltip: {
                    valueSuffix: ` ${unit}`,
                },
            },
        ],
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

const MultipleGaugesFD = () => {
    const [gaugeData, setGaugeData] = useState({
        current: 0,
        torque: 0,
        power: 0,
        voltage: 0,
        temperature: 0,
        Position: 0,
        speed: 0,
    });

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/gauge-data'); // Replace with actual API endpoint
                setGaugeData(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold text-center text-white mb-8">Real-Time FeedDrive Readings</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <GaugeChart title="Current" unit="A" maxValue={100} data={gaugeData.current} color1="#1f2937" />
                <GaugeChart title="Torque" unit="Nm" maxValue={100} data={gaugeData.torque} color1="#3b82f6" />
                <GaugeChart title="Power" unit="kW" maxValue={200} data={gaugeData.power} color1="#f59e0b" />
                <GaugeChart title="Voltage" unit="V" maxValue={240} data={gaugeData.voltage} color1="#10b981" />
                <GaugeChart title="Temperature" unit="°C" maxValue={120} data={gaugeData.temperature} color1="#ef4444" />
                <GaugeChart title="Position" unit="" maxValue={120} data={gaugeData.Position} color1="#ef4444" />
                <GaugeChart title="Speed" unit="RPM" maxValue={5000} data={gaugeData.speed} color1="#9333ea" />
            </div>
        </div>
    );
};

export default MultipleGaugesFD;
