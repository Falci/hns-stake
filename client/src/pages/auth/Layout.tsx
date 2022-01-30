import React from 'react';
import MainLayout from 'components/Layout';

interface Props {
  title: string;
}
const Layout: React.FC<Props> = ({ children, title }) => {
  return (
    <MainLayout>
      <div className="flex mt-4 md:mt-48">
        <div className="border border-hray-200 md:w-[30rem] m-auto rounded p-4 shadow">
          <h2 className="text-6xl font-extrabold">{title}</h2>

          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default Layout;
