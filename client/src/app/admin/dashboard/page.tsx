"use client"
import React from 'react';

import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from '@/components/PageTemplate';

const Dashboard: React.FC = () => {

    return (
        <AuthWrapper allowedRoles={['admin']}> 
            <PageTemplate>
                
                <div className="dashboard-content">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome to the admin dashboard. Manage your application here.</p>
                    {/* Add more dashboard content here */}
                </div>
            </PageTemplate>
        </AuthWrapper>
    );
};

export default Dashboard;