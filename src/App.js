import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Dashboard from './Components/Dashboard/Dashboard';
import Details from './Components/DetailsPage/Details';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard/>}/> 
        <Route path='/:id' element={<Details/>}/> 
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
