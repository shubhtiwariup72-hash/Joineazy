import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Header from './components/Header';
import About from './pages/About';
import { aboutMe, contactMeData, homePageData, navData } from './utils';
import Contact from './pages/Contact';
import { useEffect, useState } from 'react';
import User from './pages/User';

function App() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [])

  return (
    <div className="App">
      <Header navData={navData} />
      <Home homePageData={homePageData} />
      <About aboutMe={aboutMe} />
      <User />
      <Contact data={contactMeData} isLoading={isLoading} />
    </div>
  );
}

export default App;
