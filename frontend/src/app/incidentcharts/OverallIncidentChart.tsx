// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// interface OverallIncidentChartProps {
//     incidents: Array<{ timestamp: string; count: number }>;
// }

// const OverallIncidentChart: React.FC<OverallIncidentChartProps> = ({ incidents }) => {
//     const labels = incidents.map(incident => new Date(incident.timestamp).toLocaleString());
//     const data = {
//         labels,
//         datasets: [
//             {
//                 label: 'Overall Reported Incidents',
//                 data: incidents.map(incident => incident.count),
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: { position: 'top' as const },
//             title: { display: true, text: 'Overall Incident Status' },
//         },
//     };

//     return <Line data={data} options={options} />;
// };

// export default OverallIncidentChart;
