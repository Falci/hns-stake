import { navigate, useLocation } from '@reach/router';
import { useEffect } from 'react';
import { useSession } from 'utils/useSession';

export const RouteGuard: React.FC = ({ children }) => {
  const [session] = useSession();
  const location = useLocation();

  useEffect(() => {
    if (!session) {
      navigate(`/login?returnUrl=${location.pathname}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return session ? <>{children}</> : <></>;
};
