import React from 'react';

import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from '@/components/PageTemplate';


const Dashboard: React.FC = () => {
    return (
        <AuthWrapper allowedRoles={['coach']}>
            <PageTemplate>
                <div className="dashboard-content">
                    <h1>Coache Dashboard</h1>
                    <p>Welcome to the coache dashboard. Manage your application here.</p>
                    {/* Add more dashboard content here */}
                </div>
            </PageTemplate>
        </AuthWrapper>
    );
};

export default Dashboard;