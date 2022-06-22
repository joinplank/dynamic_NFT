import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages";
import ARA from "./pages/ARA";
import Manteinance from "./pages/manteinance";
import NewOwner from "./pages/newOwner";
import Owner from "./pages/owner";
import Viewer from "./pages/viewer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" exact element={<Home />} />
        <Route path="/ARA" element={<ARA />} />
        <Route path="/manteinance" element={<Manteinance />} />
        <Route path="/newOwner" element={<NewOwner />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Router>
  );
}

export default App;
// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;
