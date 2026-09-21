// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { LoadingDemo } from './components/Loading/LoadingDemo';
import { useLoading } from './context/LoadingContext';
import { useEffect } from 'react';
import { KanbanPage } from './pages/KanbanPage';
import { NotepadPage } from './pages/NotepadPage';
import { CalendarPage } from './pages/CalendarPage';
import Login from './pages/LoginPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { InboxPage } from './pages/InboxPage';
import { MembersPage } from './pages/MembersPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Dashboard = () => {
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    showLoading('Loading dashboard...');
    setTimeout(() => hideLoading(), 1500);
  }, []);

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={600}
        gutterBottom
        sx={{ fontFamily: 'Poppins, sans-serif !important' }}
      >
        Dashboard
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, fontFamily: 'Poppins, sans-serif !important' }}
      >
        Welcome back! Here's what's happening with your projects.
      </Typography>

      <Grid container spacing={3}>
        {[
          { title: 'Total Tickets', value: '128', change: '+12%' },
          { title: 'In Progress', value: '34', change: '-3%' },
          { title: 'Completed', value: '67', change: '+8%' },
          { title: 'Boards', value: '12', change: '+2' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: 'Poppins, sans-serif !important' }}
                >
                  {stat.title}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  sx={{ fontFamily: 'Poppins, sans-serif !important' }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                  sx={{ fontFamily: 'Poppins, sans-serif !important' }}
                >
                  {stat.change} from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 2 }}>
        <LoadingDemo />
      </Paper>
    </Box>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />

        <Route path="/boards" element={<ProtectedRoute><Layout><KanbanPage /></Layout></ProtectedRoute>} />
        <Route path="/boards/my" element={<ProtectedRoute><Layout><KanbanPage /></Layout></ProtectedRoute>} />
        <Route path="/boards/team" element={<ProtectedRoute><Layout><KanbanPage /></Layout></ProtectedRoute>} />
        <Route path="/boards/archived" element={<ProtectedRoute><Layout><KanbanPage /></Layout></ProtectedRoute>} />

        <Route path="/notepad" element={<ProtectedRoute><Layout><NotepadPage /></Layout></ProtectedRoute>} />
        <Route path="/inbox" element={
  <ProtectedRoute>
    <Layout>
      <InboxPage />
    </Layout>
  </ProtectedRoute>
} />

        <Route path="/analytics" element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        } /><Route path="/members" element={
  <ProtectedRoute>
    <Layout>
      <MembersPage />
    </Layout>
  </ProtectedRoute>
} />

        <Route path="/calendar" element={<ProtectedRoute><Layout><CalendarPage /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Typography>Page not found</Typography>} />
      </Routes>
    </Router>
  );
}

export default App;