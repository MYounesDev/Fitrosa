import React from 'react';
import Navbar from '@/components/Navbar';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="dashboard-content">
                <h1>Coache Dashboard</h1>
                <p>Welcome to the coache dashboard. Manage your application here.</p>
                {/* Add more dashboard content here */}
            </div>
        </div>
    );
};

export default Dashboard;