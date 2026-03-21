import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateResume from "./pages/CreateResume";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateResume />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/preview/:id" element={<Preview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
