import { navigate, RouteComponentProps } from '@reach/router';
import { useEffect } from 'react';
import { useSession } from 'utils/useSession';

const LogoutPage: React.FC<RouteComponentProps> = () => {
  const [, setSession] = useSession();

  useEffect(() => {
    setSession(undefined);

    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default LogoutPage;
