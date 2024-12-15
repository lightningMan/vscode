import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Layout } from './components/layout/Layout';
import { ColorPicker } from './components/features/ColorPicker/ColorPicker';
import ColorManagement from './components/features/ColorManagement/ColorManagement';
import { ColorDecomposition } from './components/features/ColorDecomposition/ColorDecomposition';
import { AuthModal } from './components/features/Auth/AuthModal';
import { UserColorConfig } from './components/features/UserColorConfig/UserColorConfig';
import { wsService } from './lib/websocket';
import './App.css';

function App() {
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    wsService.connect();
    return () => wsService.disconnect();
  }, []);

  return (
    <Provider store={store}>
      <Layout>
        <div className="flex flex-col space-y-8 items-center justify-center p-4 w-full">
          <ColorPicker />
          <ColorDecomposition />
          <ColorManagement />
          <UserColorConfig />
          <AuthModal
            isOpen={showAuth}
            onOpenChange={(open) => {
              setShowAuth(open);
            }}
          />
        </div>
      </Layout>
    </Provider>
  );
}

export default App;
