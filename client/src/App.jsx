import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertyList from './pages/PropertyList';
import PropertyDetails from './pages/PropertyDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;