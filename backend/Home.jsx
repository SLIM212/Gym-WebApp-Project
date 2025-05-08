import React from 'react';
//import './Home.css'; // Optional: Add your custom CSS styles here



const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to the Home Page</h1>
        <p>Why was this so hard</p>
        <a
          className="home-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default Home;
