import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { MantineProvider } from '@mantine/core';

// Import layouts and pages (we'll create these next)
import MainLayout from './layouts/MainLayout';
import WorkflowBuilder from './components/workflow/WorkflowBuilder';
import WorkflowList from './components/workflow/WorkflowList';
import WorkflowDetails from './components/workflow/WorkflowDetails';
import ExecutionView from './components/workflow/ExecutionView';

function App() {
  return (
    <Provider store={store}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
          primaryColor: 'blue',
          components: {
            Button: {
              defaultProps: {
                size: 'md',
              },
            },
          },
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<WorkflowList />} />
              <Route path="workflows">
                <Route index element={<WorkflowList />} />
                <Route path="new" element={<WorkflowBuilder />} />
                <Route path=":id">
                  <Route index element={<WorkflowDetails />} />
                  <Route path="edit" element={<WorkflowBuilder />} />
                  <Route path="execution/:executionId" element={<ExecutionView />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </MantineProvider>
    </Provider>
  );
}

export default App;
