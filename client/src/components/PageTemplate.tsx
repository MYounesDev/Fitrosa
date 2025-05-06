import Sidebar from '@/components/Sidebar';


interface PageTemplateProps {
  children?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({  children }) => {


  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ width: '100%', transition: 'margin-left 0.3s ease' }}>
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;