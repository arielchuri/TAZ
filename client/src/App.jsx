// Root layout. Switches between the Give & Take form flow and the board page.
import { useState } from 'react';
import GiveTake from './GiveTake';
import BoardPage from './BoardPage';

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'board'

  return (
    <div>
      {view === 'board' ? (
        <BoardPage onBack={() => setView('home')} />
      ) : (
        <GiveTake onViewBoard={() => setView('board')} />
      )}
    </div>
  );
}
