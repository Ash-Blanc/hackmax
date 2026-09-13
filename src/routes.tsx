import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Hackathons from './pages/Hackathons';
import HackathonWorkspace from './pages/HackathonWorkspace';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Judge from './pages/Judge';
import Opportunities from './pages/Opportunities';
import Analytics from './pages/Analytics';
import GithubView from './pages/Github';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
  // Full-bleed landing and auth routes
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/onboarding', element: <Onboarding /> },

  // Command Center & App workspace routes with persistent layout
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'hackathons', element: <Hackathons /> },
      { path: 'hackathons/:id', element: <HackathonWorkspace /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'judge', element: <Judge /> },
      { path: 'opportunities', element: <Opportunities /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'github', element: <GithubView /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default router;