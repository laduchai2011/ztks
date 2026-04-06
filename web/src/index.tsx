import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './utility/style/global.scss'; // Import SCSS global
import reportWebVitals from './reportWebVitals';
import { DEVELOPMENT, PRODUCTION } from './const/env';
import { Provider } from 'react-redux';
import { store } from './redux';

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </StrictMode>
    );
}

if (process.env.NODE_ENV === DEVELOPMENT) {
    reportWebVitals(console.log);
}
if (process.env.NODE_ENV === PRODUCTION) {
    // reportWebVitals((metric) => {
    //     fetch('/analytics', {
    //         method: 'POST',
    //         body: JSON.stringify(metric),
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // });
}
