import { FC } from 'react';
import { RouteComponentProps } from '@reach/router';
import Layout from 'components/Layout';

const Home: FC<RouteComponentProps> = () => {
  return (
    <Layout>
      <div className="py-12">
        <h2 className="text-6xl font-extrabold">Hello! 👋</h2>
      </div>
    </Layout>
  );
};

export default Home;
