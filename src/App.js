import logo from './logo.svg';
import './App.css';
import{
  BrowserRouter as Router,
  Route,
  Routes,
  Link } from "react-router-dom"
import PlayerAverages from './playerAverage';
import GalleryView from './GalleryView';
import SearchView from './SearchView';
import DetailsView_gallery from './DetailsView_gallery';
import NotFound from './NotFound';
function App() {
  return (
    <Router>
      <div>
        <nav className='nav'>
          <p>Home</p>
          <ul>
              <li><Link to="/">SearchView</Link></li>
              <li><Link to="/GalleryView">GalleryView</Link></li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<SearchView />} />
          <Route path="/GalleryView" element={<GalleryView/>} />
          <Route path="/DetailsView_gallery/:id" element={<DetailsView_gallery/>} /> {/* Note the :id parameter */}
          <Route path="*" element={<NotFound />} />
        </Routes>


      </div>
    </Router>
  );
}

export default App;
