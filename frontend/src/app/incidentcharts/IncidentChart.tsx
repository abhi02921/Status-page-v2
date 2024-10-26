// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     TooltipItem,
// } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// interface Incident {
//     _id: string;
//     title: string;
//     description: string;
//     service: string; // Assuming each incident is associated with a service
//     status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
//     createdAt: Date;
// }

// interface IncidentChartProps {
//     incidents: Incident[]; // Accept the full incident object
//     serviceName: string;
// }

// const IncidentChart: React.FC<IncidentChartProps> = ({ incidents, serviceName }) => {
//     // Prepare labels and data
//     const labels = incidents.map(incident => {
//         const date = new Date(incident.createdAt);
//         return date.toLocaleString(); // Format the timestamp
//     });

//     const data = {
//         labels,
//         datasets: [
//             {
//                 label: `Incidents for ${serviceName}`,
//                 data: incidents.map(() => 1), // Add this line
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 pointRadius: 5,
//                 pointHoverRadius: 7,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: { position: 'top' as const },
//             title: { display: true, text: `${serviceName} Incident Status` },
//             tooltip: {
//                 callbacks: {
//                     title: (tooltipItem: TooltipItem<'line'>[]) => {
//                         const index = tooltipItem[0]?.dataIndex;
//                         return index !== undefined ? labels[index] : '';
//                     },
//                     label: (tooltipItem: TooltipItem<'line'>) => {
//                         const index = tooltipItem.dataIndex;
//                         const incident = incidents[index];
//                         return `${incident.status ? `Status: ${incident.status}` : ''}${incident.description ? `, Description: ${incident.description}` : ''}`;
//                     },
//                 },
//             },
//         },
//     };

//     return <Line data={data} options={options} />;
// };

// export default IncidentChart;
