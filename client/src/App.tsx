import { Router } from '@reach/router';
import { ApolloProvider } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import client from 'utils/apolloClient';
import NotFound from 'pages/NotFound';
import Home from 'pages/home/Main';
import Dashboard from 'pages/dashboard/Main';
import Wallet from 'pages/wallet/Main';

import Login from 'pages/auth/Login';
import Signup from 'pages/auth/Signup';
import Logout from 'pages/auth/Logout';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <NotFound default />
        <Home path="/" />
        <Dashboard path="/dashboard" />
        <Wallet path="/wallet" />

        <Login path="/login" />
        <Signup path="/signup" />
        <Logout path="/logout" />
      </Router>

      <ToastContainer />
    </ApolloProvider>
  );
}

export default App;
