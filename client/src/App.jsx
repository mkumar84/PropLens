import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import CustomCursor from './components/CustomCursor';
import Nav from './components/Nav';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';

import Home      from './pages/Home';
import Chat      from './pages/Chat';
import MapPage   from './pages/Map';
import CMA       from './pages/CMA';
import Property  from './pages/Property';
import OpenHouse from './pages/OpenHouse';
import About     from './pages/About';
import Privacy   from './pages/Privacy';
import Terms     from './pages/Terms';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <CustomCursor />
          <div className="min-h-screen bg-cream flex flex-col">
            <Nav />
            <main className="flex-1">
              <Routes>
                <Route path="/"           element={<Home />} />
                <Route path="/chat"       element={<Chat />} />
                <Route path="/map"        element={<MapPage />} />
                <Route path="/cma"        element={<CMA />} />
                <Route path="/property/:id" element={<Property />} />
                <Route path="/open-house" element={<OpenHouse />} />
                <Route path="/about"      element={<About />} />
                <Route path="/privacy"    element={<Privacy />} />
                <Route path="/terms"      element={<Terms />} />
              </Routes>
            </main>
            <Footer />
            <MobileNav />
          </div>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
