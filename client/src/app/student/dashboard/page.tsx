"use client"
import React from 'react';

import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from '@/components/PageTemplate';

const Dashboard: React.FC = () => {

    return (
        <AuthWrapper allowedRoles={['student']}> 
            <PageTemplate>
                <div className="dashboard-content">
                    <h1>Student Dashboard</h1>
                    <p>Welcome to the Student dashboard. Manage your application here.</p>
                </div>
            </PageTemplate>
        </AuthWrapper>
    );
};

export default Dashboard;