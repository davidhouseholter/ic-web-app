import '@fontsource/inter/variable.css'
import './index.css'

import { Route } from 'react-router-dom'

import { App, Router } from '@/components'
import { Home } from '@/pages/Home'
import { ProvideAuth } from './uilts'

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); root.render(

  <ProvideAuth>
    <App>
      <Router>
        <Route path="/" element={<Home />} />
      </Router>
    </App>
  </ProvideAuth>
);