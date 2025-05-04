import React from 'react';
import Navbar from '@/components/Navbar';
import AuthWrapper from '@/components/AuthWrapper';


const Dashboard: React.FC = () => {
    return (
        <AuthWrapper allowedRoles={['coach']}>
            <div>
                <Navbar />
                <div className="dashboard-content">
                    <h1>Coache Dashboard</h1>
                    <p>Welcome to the coache dashboard. Manage your application here.</p>
                    {/* Add more dashboard content here */}
                </div>
            </div>
        </AuthWrapper>
    );
};

export default Dashboard;