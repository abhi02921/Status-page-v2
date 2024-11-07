import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from "chart.js";
import { Incident } from "@/interface/incident.interface"; // Adjust path accordingly
import { Progress } from "@/components/ui/progress"; // Assuming you have a Progress bar component

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

interface IncidentGraphProps {
    incidents: Incident[];
}

// Enum for Incident statuses
const IncidentStatus = [
    'New', 'Acknowledged', 'In Progress', 'On Hold', 'Escalated',
    'Resolved', 'Monitoring', 'Closed', 'Reopened', 'Cancelled'
];

// Helper function to group incidents by date and count them
const groupIncidentsByDate = (incidents: Incident[]) => {
    return incidents.reduce((acc: Record<string, { count: number; descriptions: string[] }>, incident) => {
        const date = new Date(incident.createdAt).toLocaleDateString(); // Format date as string
        if (!acc[date]) {
            acc[date] = { count: 0, descriptions: [] };
        }
        acc[date].count += 1;
        acc[date].descriptions.push(incident.description); // Collect descriptions for tooltip
        return acc;
    }, {});
};

// Helper function to calculate operational percentage
const calculateOperationalPercentage = (incidents: Incident[]) => {
    if (incidents.length === 0) {
        // If there are no incidents, assume 100% operational
        return 100;
    }

    const totalIncidents = incidents.length;

    // Define the statuses that are considered operational
    const operationalStatuses = ['Resolved', 'Monitoring', 'Closed'];

    // Filter incidents by operational statuses
    const operationalCount = incidents.filter(incident => operationalStatuses.includes(incident.status)).length;

    // Calculate and return the operational percentage
    return (operationalCount / totalIncidents) * 100;
};

const IncidentGraph: React.FC<IncidentGraphProps> = ({ incidents }) => {
    // Group incidents by date
    const incidentsByDate = groupIncidentsByDate(incidents);

    // Extract labels and data points from grouped incidents
    const labels = Object.keys(incidentsByDate); // Dates as labels
    const dataPoints = labels.map((date) => incidentsByDate[date].count); // Number of incidents on each date

    // Calculate the percentage of time the service was operational
    const operationalPercentage = calculateOperationalPercentage(incidents);

    // Chart data
    const data = {
        labels,
        datasets: [
            {
                label: 'Number of Incidents Reported',
                data: dataPoints,
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const date = tooltipItem.label;
                        const incidentInfo = incidentsByDate[date];
                        const count = incidentInfo.count;
                        const descriptions = incidentInfo.descriptions.join('\n');
                        return `Incidents: ${count}\n${descriptions}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Incidents',
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Ensure steps of 1 on the y-axis
                },
            },
        },
    };

    return (
        <div className="space-y-6">
            {/* Display the operational percentage */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Operational Status</h3>
                <div className="flex items-center space-x-4">
                    <span>Operational: {operationalPercentage.toFixed(2)}%</span>
                    {/* Progress bar */}
                    <Progress value={operationalPercentage} />
                </div>
            </div>

            {/* Display the incident graph */}
            <div>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default IncidentGraph;
