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
      <h1>MY DATABASE TASKS</h1>
      
      {/* ---> THIS IS THE MISSING FORM I ADDED <--- */}
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
      {/* ------------------------------------------- */}

      <div className="task-list">
        {/* 4. Loop through the array of tasks and display each one */}
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
  )
}

export default App