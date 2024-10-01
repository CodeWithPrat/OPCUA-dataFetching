import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { Zap, Thermometer, Activity, Gauge } from 'lucide-react';

HighchartsMore(Highcharts);

const GaugeChart = ({ title, unit, maxValue, data, color, icon: Icon, onDoubleClick }) => {
    const options = {
        chart: {
            type: 'gauge',
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 16,
            height: '280px',
        },
        title: { text: '' },
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
            dataLabels: { format: '', y: 25 },
            dial: {
                radius: '80%',
                backgroundColor: color,
                baseWidth: 12,
                baseLength: '0%',
                rearLength: '0%'
            },
            pivot: { backgroundColor: color, radius: 6 }
        }],
    };

    return (
        <div
            className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onDoubleClick={onDoubleClick}
        >
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
    const [selectedLog, setSelectedLog] = useState(null);
    const [logData, setLogData] = useState({});

    useEffect(() => {
        const eventSource = new EventSource('https://cmti-edge.online/OPCUA/FeedDrive.php');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setGaugeData({
                current: parseFloat(data.Current) || 0,
                torque: parseFloat(data.Torque) || 0,
                power: parseFloat(data.Power) || 0,
                voltage: parseFloat(data.Voltage) || 0,
                temperature: parseFloat(data.Temperature) || 0,
                position: parseFloat(data.Position) || 0,
                speed: parseFloat(data.Speed) || 0,
            });

            const timestamp = new Date().toLocaleTimeString();
            setLogData(prev => {
                const newData = {
                    ...prev,
                    [timestamp]: {
                        current: parseFloat(data.Current) || 0,
                        torque: parseFloat(data.Torque) || 0,
                        power: parseFloat(data.Power) || 0,
                        voltage: parseFloat(data.Voltage) || 0,
                        temperature: parseFloat(data.Temperature) || 0,
                        position: parseFloat(data.Position) || 0,
                        speed: parseFloat(data.Speed) || 0,
                    }
                };
                
                // Keep only the last 50 data points
                const keys = Object.keys(newData);
                if (keys.length > 50) {
                    const slicedKeys = keys.slice(-50);
                    return slicedKeys.reduce((obj, key) => {
                        obj[key] = newData[key];
                        return obj;
                    }, {});
                }
                
                return newData;
            });
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const plotLogGraph = (metric) => {
        setSelectedLog(metric);
    };

    const chartOptions = selectedLog ? {
        chart: {
            type: 'line',
            backgroundColor: '#1f2937',
            height: 400,
        },
        title: {
            text: `Log Data for ${selectedLog}`,
            style: { color: '#fff' },
        },
        xAxis: {
            categories: Object.keys(logData),
            labels: { 
                style: { color: '#fff' },
                rotation: -45,
                align: 'right'
            },
        },
        yAxis: {
            title: { text: selectedLog, style: { color: '#fff' } },
            labels: { style: { color: '#fff' } },
        },
        series: [{
            name: selectedLog,
            data: Object.values(logData).map(item => parseFloat(item[selectedLog]) || 0),
            color: '#3b82f6',
        }],
        plotOptions: {
            series: {
                animation: false // Disable animation for smoother updates
            }
        },
    } : {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
            <div className="container mx-auto">
                <h1 className="text-5xl font-extrabold text-center text-white mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Real-Time FeedDrive Readings
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <GaugeChart title="Current" unit="A" maxValue={100} data={gaugeData.current} color="#3b82f6" icon={Zap} onDoubleClick={() => plotLogGraph('current')} />
                    <GaugeChart title="Torque" unit="Nm" maxValue={100} data={gaugeData.torque} color="#10b981" icon={Activity} onDoubleClick={() => plotLogGraph('torque')} />
                    <GaugeChart title="Power" unit="kW" maxValue={200} data={gaugeData.power} color="#f59e0b" icon={Zap} onDoubleClick={() => plotLogGraph('power')} />
                    <GaugeChart title="Voltage" unit="V" maxValue={240} data={gaugeData.voltage} color="#6366f1" icon={Zap} onDoubleClick={() => plotLogGraph('voltage')} />
                    <GaugeChart title="Temperature" unit="°C" maxValue={120} data={gaugeData.temperature} color="#ef4444" icon={Thermometer} onDoubleClick={() => plotLogGraph('temperature')} />
                    <GaugeChart title="Position" unit="" maxValue={360} data={gaugeData.position} color="#8b5cf6" icon={Gauge} onDoubleClick={() => plotLogGraph('position')} />
                    <GaugeChart title="Speed" unit="RPM" maxValue={5000} data={gaugeData.speed} color="#ec4899" icon={Gauge} onDoubleClick={() => plotLogGraph('speed')} />
                </div>

                {selectedLog && (
                    <div className="mt-12">
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleGaugesFD;