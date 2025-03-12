
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import TutorDashboard from './pages/TutorDashboard';
import CourseCreation from './pages/CourseCreation';
import NotFound from './pages/NotFound';
import AIAssistant from './pages/AIAssistant';
import HTMLTranscript from './pages/HTMLTranscript';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/courses',
    element: <Courses />
  },
  {
    path: '/courses/:id',
    element: <CourseDetails />
  },
  {
    path: '/tutor-dashboard',
    element: <TutorDashboard />
  },
  {
    path: '/course-creation',
    element: <CourseCreation />
  },
  {
    path: '/ai-assistant',
    element: <AIAssistant />
  },
  {
    path: '/html-transcript',
    element: <HTMLTranscript />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
