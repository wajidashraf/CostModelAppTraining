import { useState } from 'react'
import './App.css'
// import type { ToastType } from './components/Toast';
import { ModelList } from './pages/ModelList';
import { models } from './Utilities/mockdata'; 
import { ModelDetail } from './pages/ModelDetail';

type PageType = 'list' | 'detail';

// interface ToastItem {
//   id: string;
//   message: string;
//   type: ToastType;
// }

function App() {
  // Routing state - which page to show
  const [currentPage, setCurrentPage] = useState<PageType>('list');

  // Selected model ID for detail page
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Toast notifications state
  // const [toasts, setToasts] = useState<ToastItem[]>([]) ;

  // Event handler: Navigate to model detail page
  const handleSelectModel = (modelId: string) => {
    console.log('App: Navigating to model', modelId);
    setSelectedModelId(modelId);
    setCurrentPage('detail');
  };

  // Event handler: Navigate back to model list
  const handleBackToList = () => {
    console.log('App: Navigating back to list');
    setCurrentPage('list');
    setSelectedModelId(null);
  };


return (
    <div className="app">
      <header>
        <h1>Cost Insight Dashboard</h1>

      </header>

      <main>
        {/*
          Conditional Rendering - Simple Routing

          Show either ModelList OR ModelDetail based on currentPage state.
          Components now fetch their own data from the backend API!
        */}
        {currentPage === 'list' && (
          <ModelList models={models} handleViewDetails={handleSelectModel} />
        )}

        {currentPage === 'detail' && selectedModelId && (
          <ModelDetail modelId={selectedModelId} onBack={handleBackToList} />
        )}
      </main>



    <footer className="app-footer">
      <div className="composition-info type-info">
        <h3>Frontend-Backend Integration</h3>
        
        <p>
          <strong>Current State:</strong>

          • Page: {currentPage}

          • Selected Model ID: <code>{selectedModelId || 'none'}</code>

        </p>
        <p>
          <strong>How API integration works:</strong>

          1. <strong>Vite proxy:</strong> Forwards /api requests to backend (localhost:3001)

          2. <strong>Components fetch data:</strong> ModelList and ModelDetail use custom hooks

          3. <strong>Loading states:</strong> Components show loading while fetching

          4. <strong>Error handling:</strong> Graceful error messages with retry

          5. <strong>Real-time updates:</strong> Refresh button re-fetches data
        </p>
        <p>
          <strong>Phase 5 patterns demonstrated:</strong>

          ✅ Vite proxy configuration for API

          ✅ Fetch API with async/await

          ✅ Custom hooks (useFetchModels, useFetchModelById)

          ✅ Loading and error states

          ✅ useEffect for data fetching on mount

          ✅ Type-safe API client

          ✅ Error handling and user feedback
        </p>
      </div>
    </footer>
  </div>
);
};
export default App;