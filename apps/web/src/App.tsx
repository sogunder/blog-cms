import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthSessionSync } from './components/AuthSessionSync';

function App() {
  return (
    <>
      <AuthSessionSync />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
