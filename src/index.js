import React from 'react';
import ReactDOM from 'react-dom/client'; // Notez l'import de createRoot ici
import { Provider } from 'react-redux';
import configureAppStore from './Redux/store';
import App from './App';
import './index.css';

const store = configureAppStore();

// Utilisez createRoot ici
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

