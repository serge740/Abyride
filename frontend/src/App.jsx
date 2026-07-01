import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { DriverAuthProvider } from './contexts/DriverAuthContext';
import { SocketProvider } from './contexts/SocketContext';
import router from './routes';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <DriverAuthProvider>
            <SocketProvider>
              <RouterProvider router={router} />
            </SocketProvider>
          </DriverAuthProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;