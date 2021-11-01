import React from 'react';

import 'src/styles/globals.css';
import { RecoilRoot } from 'recoil';
import Page from './pages';

function App() {
  return (
    <RecoilRoot>
      <Page />
    </RecoilRoot>
  );
}
export default App;
