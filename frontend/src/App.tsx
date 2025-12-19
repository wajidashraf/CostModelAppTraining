import { useState } from 'react'
import './App.css'
// import type { ToastType } from './components/Toast';
import { ModelList } from './pages/ModelList';
import { ModelDetail } from './pages/ModelDetail';
import { useFetchModels } from './hooks/useApi';

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

  // Trigger to refresh models list when returning from detail
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Toast notifications state
  // const [toasts, setToasts] = useState<ToastItem[]>([]) ;

  // Event handler: Navigate to model detail page
  const handleSelectModel = (modelId: string) => {
    console.log('App: Navigating to model', modelId);
    setSelectedModelId(modelId);
    setCurrentPage('detail');
  };

  // Event handler: Navigate back to model list and refresh data
  const handleBackToList = () => {
    console.log('App: Navigating back to list');
    setCurrentPage('list');
    setSelectedModelId(null);
    // Trigger refresh of models list to get updated costs
    setRefreshCounter(prev => prev + 1);
  };

  // Fetch models from backend API with refresh trigger
  const { models, loading, error } = useFetchModels(refreshCounter);

  return (
    <div className="app">
      <header>
        <h1>Cost Insight Dashboard</h1>
      </header>

      <main>
        {loading && <p>Loading models...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!loading && !error && (
          <>
            {currentPage === 'list' && (
              <ModelList models={models} handleViewDetails={handleSelectModel} />
            )}

            {currentPage === 'detail' && selectedModelId && (
              <ModelDetail modelId={selectedModelId} onBack={handleBackToList} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;