import { RouteComponentProps } from '@reach/router';
import Layout from 'components/Layout';
import Loader from 'components/Loader';
import { RouteGuard } from 'components/RouteGuard';
import { useWalletQuery } from 'graphql/wallet';

const WalletPage: React.FC<RouteComponentProps> = () => {
  const query = useWalletQuery();

  return (
    <RouteGuard>
      <Layout>
        <div className="py-12">
          <h2 className="text-6xl font-extrabold">Wallet</h2>

          <Loader {...query}>
            {(data) => (
              <div>
                <div>Balance: {data?.wallet.balance}</div>
                <div>Pending: {data?.wallet.unconfirmed}</div>
                <div>Deposit address: {data?.wallet.address}</div>
              </div>
            )}
          </Loader>
        </div>
      </Layout>
    </RouteGuard>
  );
};

export default WalletPage;
