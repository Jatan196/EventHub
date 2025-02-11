import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import Footer from './components/footer';
import Header from './components/header';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import NewEvent from './components/NewEvent';
import EventHomePage from './components/EventHomePage';
import EventDashboard from './components/EventDashboard';

// Layout component that includes Header and Footer
const Layout = () => {
  return (
    <div className="">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/events",
        element: <EventHomePage />
      },
      {
        path: "/dashboard",
        element: <EventDashboard />
      },
      {
        path: "/events/new",
        element: <NewEvent />
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
