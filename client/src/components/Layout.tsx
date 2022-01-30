import { CurrencyDollarIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link, RouteComponentProps } from '@reach/router';
import { forwardRef, useRef } from 'react';
import { useClickAway, useToggle } from 'react-use';
import { useSession } from 'utils/useSession';

const publicLinks = {};

const authLinks = {
  '/dashboard': 'Dashboard',
  '/wallet': 'Wallet',
};

const Layout: React.FC<RouteComponentProps> = ({ children }) => {
  const [session] = useSession();
  const [showMenu, toggleMenu] = useToggle(false);

  const ref = useRef(null);
  useClickAway(ref, () => toggleMenu(false));

  return (
    <div>
      <div className="flex flex-col h-screen">
        <header>
          <nav className="relative bg-gray-800 shadow">
            <div className="px-2 mx-auto sm:px-8">
              <div className="flex justify-between">
                <div className="flex justify-between space-x-2">
                  <div>
                    <Link
                      to="/"
                      className="flex items-center px-3 py-5 space-x-2"
                    >
                      <CurrencyDollarIcon className="w-6 h-6 text-indigo-200" />
                      <span className="font-bold text-white">HNS Stake</span>
                    </Link>
                  </div>
                  <PrimaryNav links={session ? authLinks : publicLinks} />
                </div>

                <SecondaryNav />

                {!!session && (
                  <ToggleMenu show={showMenu} toggle={toggleMenu} />
                )}
              </div>
            </div>
            <MobileMenu showMenu={showMenu} session={!!session} ref={ref} />
          </nav>
        </header>
        <div className="flex-1 px-2 sm:px-8">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

interface ToggleMenuProps {
  show: boolean;
  toggle: () => void;
}
const ToggleMenu: React.FC<ToggleMenuProps> = ({ show, toggle }) => (
  <div className="flex items-center md:hidden">
    {show ? (
      <button key="close">
        <XIcon className="w-6 h-6 text-gray-100" />
      </button>
    ) : (
      <button onClick={toggle} key="show">
        <MenuIcon className="w-6 h-6 text-gray-100" />
      </button>
    )}
  </div>
);

interface Links {
  links: { [url: string]: string };
}

const PrimaryNav: React.FC<Links> = ({ links }) => {
  return (
    <div className="items-center hidden space-x-3 md:flex">
      {Object.entries(links).map(([url, text]) => (
        <Link
          to={url}
          key={url}
          className="px-3 py-5 text-gray-100 hover:text-indigo-100 hover:underline underline-offset-4"
        >
          {text}
        </Link>
      ))}
    </div>
  );
};

const SecondaryNav = () => {
  const [session] = useSession();

  if (session) {
    return (
      <div className="items-center hidden space-x-3 md:flex">
        <Link
          to="/logout"
          className="px-2 py-2 text-gray-200 transition duration-300 rounded hover:text-gray-100 hover:bg-indigo-500"
        >
          Logout
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <Link to="/login" className="px-3 py-5 text-gray-200">
        Login
      </Link>
      <Link
        to="/signup"
        className="px-2 py-2 text-white transition duration-300 bg-indigo-400 rounded hover:text-gray-100 hover:bg-indigo-500"
      >
        Signup
      </Link>
    </div>
  );
};

const MobilePrimaryNav: React.FC<Links> = ({ links }) => (
  <>
    {Object.entries(links).map(([url, text]) => (
      <Link to={url} className="block p-4" key={url}>
        {text}
      </Link>
    ))}
  </>
);

interface MobileMenuProps {
  showMenu: boolean;
  session: boolean;
}
const MobileMenu = forwardRef<any, MobileMenuProps>(
  ({ showMenu, session }, ref) => (
    <div
      className={
        showMenu
          ? 'md:hidden border-t border-gray-200 flex flex-col items-end absolute left-0 right-0 bg-white border-b shadow'
          : 'hidden'
      }
      ref={ref}
    >
      <MobilePrimaryNav links={session ? authLinks : publicLinks} />
      <div className="block w-full border-t border-gray-200" />

      {session ? (
        <Link to="/logout" className="block p-4">
          Logout
        </Link>
      ) : (
        <div className="flex justify-end w-full p-2 space-x-2 bg-white border-b border-gray-300">
          <Link to="/login" className="px-3 py-2 text-gray-700">
            Login
          </Link>
          <Link
            to="/signup"
            className="px-2 py-2 text-white transition duration-300 bg-indigo-400 rounded hover:text-gray-100 hover:bg-indigo-500"
          >
            Signup
          </Link>
        </div>
      )}
    </div>
  )
);

const Footer = () => (
  <footer>
    <div className="py-3 text-sm text-center text-gray-500 border-t border-gray-100">
      HNS Stake
    </div>
  </footer>
);

export default Layout;
