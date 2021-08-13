import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { AuthContextProvider } from './Context/Authcontext'

ReactDOM.render(
    <AuthContextProvider>
    <App />
    </AuthContextProvider>,
    document.getElementById('root'));