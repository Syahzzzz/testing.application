import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const navigate = useNavigate();

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Make sure this URL matches your backend perfectly
      const response = await fetch('http://localhost:8081/api/tasks'); 
      const data = await response.json();
      
      // Save the fetched data into our React state
      setTasks(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you submit the form
    
    if (!newTaskTitle.trim()) return; // Stops the user from submitting empty tasks

    // 1. Create the data payload
    const newTask = {
      title: newTaskTitle,
      status: "PENDING" // We will set all new tasks to PENDING by default
    };

    try {
      // 2. Send the POST request to Spring Boot
      const response = await fetch('http://localhost:8081/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask) // Convert our JavaScript object to a JSON string
      });

      if (response.ok) {
        const savedTask = await response.json(); // Get the saved task (with its new ID) back from the database
        
        // 3. Update the UI to show the new task immediately
        setTasks([...tasks, savedTask]); 
        
        // 4. Clear out the input box
        setNewTaskTitle(''); 
      }
    } catch (error) {
      console.error("Error saving task: ", error);
    }
  };

  return (
    <div className="App">
      <div className="header-container">
        <h1>MY DATABASE TASKS</h1>
        <button className="settings-toggle" onClick={() => navigate('/settings')}>
          Background Settings
        </button>
      </div>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          className="task-input"
          placeholder="What do you need to do?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit" className="task-button">Add Task</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks found. Add a task above to get started!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>Status: <strong className={`status-${task.status ? task.status.toLowerCase() : 'pending'}`}>{task.status}</strong></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SettingsPage({ bgType, setBgType, bgColor, setBgColor, bgImage, setBgImage }) {
  const navigate = useNavigate();

  const handleSaveBg = () => {
    localStorage.setItem('bgType', bgType);
    localStorage.setItem('bgColor', bgColor);
    localStorage.setItem('bgImage', bgImage);
    navigate('/'); // Go back to tasks page
  };

  const handleResetBg = () => {
    setBgType('color');
    setBgColor('#f8fafc');
    setBgImage('');
    localStorage.setItem('bgType', 'color');
    localStorage.setItem('bgColor', '#f8fafc');
    localStorage.setItem('bgImage', '');
  };

  return (
    <div className="App">
      <div className="header-container">
        <h1>SETTINGS</h1>
        <button className="settings-toggle" onClick={() => navigate('/')}>
          Back to Tasks
        </button>
      </div>

      <div className="bg-settings-panel">
        <h3>Background Settings</h3>
        
        <div className="setting-group">
          <label>Background Type:</label>
          <select value={bgType} onChange={(e) => setBgType(e.target.value)}>
            <option value="color">Solid Color</option>
            <option value="image">Image URL</option>
          </select>
        </div>

        {bgType === 'color' && (
          <div className="setting-group">
            <label>Color Picker:</label>
            <input 
              type="color" 
              value={bgColor} 
              onChange={(e) => setBgColor(e.target.value)} 
            />
            <span className="color-hex">{bgColor}</span>
          </div>
        )}

        {bgType === 'image' && (
          <div className="setting-group">
            <label>Image URL:</label>
            <input 
              type="text" 
              placeholder="https://example.com/image.jpg"
              value={bgImage} 
              onChange={(e) => setBgImage(e.target.value)} 
              className="bg-input"
            />
          </div>
        )}

        <div className="settings-actions">
          <button className="btn-save" onClick={handleSaveBg}>Apply & Save</button>
          <button className="btn-reset" onClick={handleResetBg}>Reset to Default</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Background states hoisted to App level so they persist across routes
  const [bgType, setBgType] = useState(localStorage.getItem('bgType') || 'color');
  const [bgColor, setBgColor] = useState(localStorage.getItem('bgColor') || '#f8fafc');
  const [bgImage, setBgImage] = useState(localStorage.getItem('bgImage') || '');

  // Background Effect
  useEffect(() => {
    if (bgType === 'color') {
      document.body.style.background = bgColor;
    } else if (bgType === 'image' && bgImage) {
      document.body.style.background = `url(${bgImage}) no-repeat center center fixed`;
      document.body.style.backgroundSize = 'cover';
    } else {
      document.body.style.background = '#f8fafc'; // Default
    }
  }, [bgType, bgColor, bgImage]);

  return (
    <Routes>
      <Route path="/" element={<TasksPage />} />
      <Route 
        path="/settings" 
        element={
          <SettingsPage 
            bgType={bgType} setBgType={setBgType}
            bgColor={bgColor} setBgColor={setBgColor}
            bgImage={bgImage} setBgImage={setBgImage}
          />
        } 
      />
    </Routes>
  );
}

export default App