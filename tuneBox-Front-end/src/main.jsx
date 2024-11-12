import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import 'jquery/dist/jquery.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = "28392767205-kjh3koov94lcf8d2dhh83o15siro23m7.apps.googleusercontent.com"; 
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
     <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
)