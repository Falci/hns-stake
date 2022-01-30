import { useForm } from 'react-hook-form';
import Layout from './Layout';
import { useLoginLazyQuery } from 'graphql/auth';
import { toast } from 'react-toastify';
import { useSession } from 'utils/useSession';
import { LoginSession } from 'graphql/schema';
import { navigate, RouteComponentProps } from '@reach/router';
import { useSearchParam } from 'react-use';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC<RouteComponentProps> = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [login] = useLoginLazyQuery();
  const [, setSession] = useSession();
  const returnUrl = useSearchParam('returnUrl');

  const onSubmit = async (data: LoginFormData) =>
    login({ variables: data })
      .then(({ data }) => {
        setSession(data?.login as LoginSession);

        navigate(returnUrl || '/dashboard');
      })
      .catch((e) => toast.error(e.message));

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="w-full p-2 mt-8 border border-gray-300 rounded shadow-sm"
          placeholder="Email"
          type="email"
          autoFocus
          {...register('email', { required: true })}
        />
        <input
          className="w-full p-2 mt-2 border border-gray-300 rounded shadow-sm"
          placeholder="Password"
          type="password"
          {...register('password', { required: true })}
        />

        <button
          type="submit"
          className="w-full p-2 mt-2 text-white transition duration-300 bg-indigo-400 rounded shadow-sm hover:bg-indigo-500"
        >
          Login
        </button>
      </form>
    </Layout>
  );
};

export default LoginPage;
