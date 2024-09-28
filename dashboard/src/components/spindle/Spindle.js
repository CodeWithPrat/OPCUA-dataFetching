import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { Zap, Thermometer, Activity, Gauge } from 'lucide-react';
import axios from 'axios';

HighchartsMore(Highcharts);

const GaugeChart = ({ title, unit, maxValue, data, color, icon: Icon }) => {
    const options = {
        chart: {
            type: 'gauge',
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 16,
            height: '280px',
        },
        title: {
            text: '',
        },
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#1f2937'],
                        [1, '#111827']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }],
        },
        yAxis: {
            min: 0,
            max: maxValue,
            lineColor: color,
            tickColor: color,
            minorTickColor: color,
            offset: -25,
            lineWidth: 2,
            labels: {
                distance: -20,
                rotation: 'auto',
                style: { color: '#ffffff', fontSize: '14px' },
            },
            tickLength: 13,
            minorTickLength: 7,
            tickPosition: 'inside',
            tickWidth: 2,
            minorTickWidth: 1,
        },
        series: [{
            name: title,
            data: [data],
            dataLabels: {
                format: '',
                y: 25,
            },
            dial: {
                radius: '80%',
                backgroundColor: color,
                baseWidth: 12,
                baseLength: '0%',
                rearLength: '0%'
            },
            pivot: {
                backgroundColor: color,
                radius: 6
            }
        }],
    };

    return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <Icon className="w-8 h-8" style={{ color }} />
            </div>
            <div className="relative">
                <HighchartsReact highcharts={Highcharts} options={options} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-80 rounded-lg p-3 shadow-lg">
                    <p className="text-3xl font-bold" style={{ color }}>
                        {data.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-300 text-center">{unit}</p>
                </div>
            </div>
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
        position: 0,
        speed: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://cmti-edge.online/smddc/machinedate.php');
                const data = response.data;
                setGaugeData({
                    current: parseFloat(data.current) || 0,
                    torque: parseFloat(data.torque) || 0,
                    power: parseFloat(data.power) || 0,
                    voltage: parseFloat(data.voltage) || 0,
                    temperature: parseFloat(data.temperature) || 0,
                    speed: parseFloat(data.speed) || 0,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
            <div className="container mx-auto">
                <h1 className="text-5xl font-extrabold text-center text-white mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Real-Time Spindle Readings
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    <GaugeChart title="Current" unit="A" maxValue={100} data={gaugeData.current} color="#3b82f6" icon={Zap} />
                    <GaugeChart title="Torque" unit="Nm" maxValue={100} data={gaugeData.torque} color="#10b981" icon={Activity} />
                    <GaugeChart title="Power" unit="kW" maxValue={200} data={gaugeData.power} color="#f59e0b" icon={Zap} />
                    <GaugeChart title="Voltage" unit="V" maxValue={240} data={gaugeData.voltage} color="#6366f1" icon={Zap} />
                    <GaugeChart title="Temperature" unit="°C" maxValue={120} data={gaugeData.temperature} color="#ef4444" icon={Thermometer} />
                    <GaugeChart title="Speed" unit="RPM" maxValue={5000} data={gaugeData.speed} color="#ec4899" icon={Gauge} />
                </div>
            </div>
        </div>
    );
};

export default MultipleGaugesFD;