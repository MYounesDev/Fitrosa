"use client"
import React from 'react';
import Navbar from '@/components/Navbar';
import AuthWrapper from '@/components/AuthWrapper';

const Dashboard: React.FC = () => {

    return (
        <AuthWrapper allowedRoles={['admin']}> 
            <div>
                <Navbar />
                <div className="dashboard-content">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome to the admin dashboard. Manage your application here.</p>
                    {/* Add more dashboard content here */}
                </div>
            </div>
        </AuthWrapper>
    );
};

export default Dashboard;