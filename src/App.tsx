import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AdminLayout } from '@/components/AdminLayout';
import { Layout } from '@/components/Layout';
import { AdminFacilityFormPage } from '@/pages/AdminFacilityFormPage';
import { AdminPage } from '@/pages/AdminPage';
import { FacilityDetailPage } from '@/pages/FacilityDetailPage';
import { HomePage } from '@/pages/HomePage';
import { NewsPage } from '@/pages/NewsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { RecordWaitPage } from '@/pages/RecordWaitPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/facility/:slug" element={<FacilityDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPage />} />
            <Route path="facility/new" element={<AdminFacilityFormPage />} />
            <Route path="facility/:id" element={<AdminFacilityFormPage />} />
            <Route path="facility/:id/wait" element={<RecordWaitPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
