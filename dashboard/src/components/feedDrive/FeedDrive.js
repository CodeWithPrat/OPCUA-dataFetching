import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { Zap, Thermometer, Activity, Gauge, Truck, ArrowLeft, ArrowRight } from 'lucide-react';

HighchartsMore(Highcharts);

// Enhanced Position Tracker Component with full-width design
const PositionTracker = ({ position = 0, onDoubleClick }) => {
    const normalizedPosition = Math.min(Math.max(position, 0), 720);
    const positionPercentage = (normalizedPosition / 720) * 100;
    const [prevPosition, setPrevPosition] = useState(position);
    const [direction, setDirection] = useState('none');
    
    useEffect(() => {
        if (position > prevPosition) setDirection('right');
        else if (position < prevPosition) setDirection('left');
        setPrevPosition(position);
    }, [position]);

    return (
        <div className="col-span-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Position Tracking</h2>
                    <p className="text-blue-400">Real-time feed drive position monitor</p>
                </div>
                <div className="flex items-center space-x-4 bg-gray-900/50 rounded-lg p-3">
                    {direction === 'left' && <ArrowLeft className="w-6 h-6 text-blue-400 animate-pulse" />}
                    {direction === 'right' && <ArrowRight className="w-6 h-6 text-blue-400 animate-pulse" />}
                    <span className="text-2xl font-bold text-blue-400 font-mono">{normalizedPosition.toFixed(2)}</span>
                    <span className="text-gray-400">units</span>
                </div>
            </div>

            <div className="relative h-40 mb-6">
                <div className="absolute inset-0 bg-gray-900/50 backdrop-blur rounded-lg overflow-hidden">
                    {/* Enhanced position markers */}
                    <div className="absolute inset-0 flex justify-between px-4">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-full flex flex-col items-center justify-end pb-2">
                                <div className="w-px h-4 bg-gray-600"></div>
                                <span className="text-sm text-gray-400 mt-1 font-mono">{i * 90}</span>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced motion track */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-400/20 to-blue-600/10"></div>
                        <div className="absolute inset-0 flex items-center">
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                        </div>
                    </div>

                    {/* Enhanced moving element */}
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                        style={{ left: `${positionPercentage}%` }}
                    >
                        <div className="absolute -inset-4 bg-blue-500/30 blur-xl rounded-full"></div>
                        <div className={`relative bg-blue-600 p-3 rounded-xl shadow-lg transform -translate-x-1/2 
                            ${direction === 'right' ? 'scale-x-1' : direction === 'left' ? 'scale-x-[-1]' : ''}`}>
                            <Truck className="w-10 h-10 text-white animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-900/50 backdrop-blur rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Range</div>
                    <div className="text-white font-bold text-lg">0-720 units</div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Current</div>
                    <div className="text-blue-400 font-bold text-lg">{normalizedPosition.toFixed(1)} units</div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Progress</div>
                    <div className="text-green-400 font-bold text-lg">{(positionPercentage).toFixed(1)}%</div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Direction</div>
                    <div className="text-purple-400 font-bold text-lg capitalize">{direction}</div>
                </div>
            </div>
        </div>
    );
};

// Enhanced GaugeChart Component
const GaugeChart = ({ title, unit, maxValue, data, color, icon: Icon, onDoubleClick }) => {
    const options = {
        chart: {
            type: 'gauge',
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor: 'transparent',
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
            className="bg-gray-800/50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onDoubleClick={onDoubleClick}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <p className="text-gray-400 text-sm">{unit}</p>
                </div>
                <Icon className="w-8 h-8" style={{ color }} />
            </div>
            <div className="relative">
                <HighchartsReact highcharts={Highcharts} options={options} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/80  rounded-lg p-3 shadow-lg">
                    <p className="text-3xl font-bold" style={{ color }}>
                        {data.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
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
                animation: false
            }
        },
    } : {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
            <div className="container mx-auto">
                <div className="flex flex-col items-center justify-center mb-12">
                    <h1 className="text-5xl font-extrabold text-center text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Real-Time FeedDrive Dashboard
                    </h1>
                    <p className="text-gray-400 text-xl">Monitoring system performance metrics</p>
                </div>

                {/* Main grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* First row */}
                    <GaugeChart 
                        title="Current" 
                        unit="A" 
                        maxValue={100} 
                        data={gaugeData.current} 
                        color="#3b82f6" 
                        icon={Zap} 
                        onDoubleClick={() => plotLogGraph('current')} 
                    />
                    <GaugeChart 
                        title="Torque" 
                        unit="Nm" 
                        maxValue={100} 
                        data={gaugeData.torque} 
                        color="#10b981" 
                        icon={Activity} 
                        onDoubleClick={() => plotLogGraph('torque')} 
                    />
                    <GaugeChart 
                        title="Speed" 
                        unit="RPM" 
                        maxValue={5000} 
                        data={gaugeData.speed} 
                        color="#ec4899" 
                        icon={Gauge} 
                        onDoubleClick={() => plotLogGraph('speed')} 
                    />

                    {/* Second row */}
                    <GaugeChart 
                        title="Power" 
                        unit="kW" 
                        maxValue={200} 
                        data={gaugeData.power} 
                        color="#f59e0b" 
                        icon={Zap} 
                        onDoubleClick={() => plotLogGraph('power')} 
                    />
                    <GaugeChart 
                        title="Voltage" 
                        unit="V" 
                        maxValue={240} 
                        data={gaugeData.voltage} 
                        color="#6366f1" 
                        icon={Zap} 
                        onDoubleClick={() => plotLogGraph('voltage')} 
                    />
                    <GaugeChart 
                        title="Temperature" 
                        unit="°C" 
                        maxValue={120} 
                        data={gaugeData.temperature} 
                        color="#ef4444" 
                        icon={Thermometer} 
                        onDoubleClick={() => plotLogGraph('temperature')} 
                    />
                </div>

                {/* Position tracker in full width */}
                <PositionTracker 
                    position={gaugeData.position} 
                    onDoubleClick={() => plotLogGraph('position')} 
                />

                {/* Log graph */}
                {selectedLog && (
                    <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleGaugesFD;