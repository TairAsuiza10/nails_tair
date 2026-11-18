import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Explorador from '@/pages/Explorador';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Explorador />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
