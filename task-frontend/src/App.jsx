import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. Create a state variable to hold the tasks coming from the database
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 2. Use useEffect to run this code immediately when the page loads
  useEffect(() => {
    fetchTasks();
  }, []);

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

  // 3. The function that actually calls your Spring Boot API
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

  return (
    <div className="App">
      <h1>My Database Tasks</h1>
      
      {/* ---> THIS IS THE MISSING FORM I ADDED <--- */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add Task</button>
      </form>
      {/* ------------------------------------------- */}

      <div className="task-list">
        {/* 4. Loop through the array of tasks and display each one */}
        {tasks.length === 0 ? (
          <p>No tasks found. Is the backend running?</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>Status: <strong>{task.status}</strong></p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App