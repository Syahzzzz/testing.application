import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import './App.css'

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const navigate = useNavigate();

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/tasks'); 
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault(); 
    
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle,
      dueDate: newTaskDueDate || null,
      status: "PENDING"
    };

    try {
      const response = await fetch('http://localhost:8081/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        const savedTask = await response.json();
        setTasks([...tasks, savedTask]); 
        setNewTaskTitle(''); 
        setNewTaskDueDate('');
      }
    } catch (error) {
      console.error("Error saving task: ", error);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    const updatedTask = { ...task, status: newStatus };

    try {
      const response = await fetch(`http://localhost:8081/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      });

      if (response.ok) {
        const savedTask = await response.json();
        setTasks(tasks.map(t => t.id === task.id ? savedTask : t));
      }
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const handleUpdateDueDate = async (task, newDueDate) => {
    const updatedTask = { ...task, dueDate: newDueDate || null };

    // Update UI optimistically
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));

    try {
      await fetch(`http://localhost:8081/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      });
    } catch (error) {
      console.error("Error updating task date: ", error);
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    // Only allow reordering within pending tasks for now
    const pendingTasks = tasks.filter(t => t.status === 'PENDING');
    const completedTasks = tasks.filter(t => t.status !== 'PENDING');

    const [reorderedItem] = pendingTasks.splice(result.source.index, 1);
    pendingTasks.splice(result.destination.index, 0, reorderedItem);

    const newTasks = [...pendingTasks, ...completedTasks];
    setTasks(newTasks);

    try {
      await fetch('http://localhost:8081/api/tasks/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTasks.map(t => t.id))
      });
    } catch (error) {
      console.error("Error reordering tasks: ", error);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const renderTaskCard = (task, provided = null) => {
    const isDraggable = !!provided;

    return (
      <div 
        className="task-card"
        ref={isDraggable ? provided.innerRef : null}
        {...(isDraggable ? provided.draggableProps : {})}
        {...(isDraggable ? provided.dragHandleProps : {})}
        style={{
          ...(isDraggable ? provided.draggableProps.style : {}),
          userSelect: 'none',
          opacity: task.status === 'COMPLETED' ? 0.7 : 1
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' }}>{task.title}</h3>
          {isDraggable && (
            <span style={{ cursor: 'grab', fontSize: '24px', color: '#888' }} title="Drag to reorder">
              ☰
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', margin: '0.5rem 0' }}>
          <p style={{ margin: 0 }}>Status: <strong className={`status-${task.status ? task.status.toLowerCase() : 'pending'}`}>{task.status}</strong></p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#64748b' }}>Due:</label>
            <input 
              type="date" 
              value={task.dueDate || ''} 
              onChange={(e) => handleUpdateDueDate(task, e.target.value)}
              style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.2rem', color: '#475569' }}
            />
          </div>
        </div>
        <div className="task-actions">
          <button onClick={() => handleToggleStatus(task)} className="btn-toggle">
            Mark {task.status === 'PENDING' ? 'Completed' : 'Pending'}
          </button>
          <button onClick={() => handleDeleteTask(task.id)} className="btn-delete">
            Delete
          </button>
        </div>
      </div>
    );
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
        <input
          type="date"
          className="task-input"
          style={{ flex: '0.4' }}
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
        />
        <button type="submit" className="task-button">Add Task</button>
      </form>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Pending Tasks</h2>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="pending-tasks">
            {(provided) => (
              <div className="task-list" {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: '50px' }}>
                {pendingTasks.length === 0 ? (
                  <p className="empty-state" style={{ padding: '2rem' }}>No pending tasks!</p>
                ) : (
                  pendingTasks.map((task, index) => (
                    <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                      {(provided) => renderTaskCard(task, provided)}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {completedTasks.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Completed Tasks</h2>
            <div className="task-list">
              {completedTasks.map((task) => (
                <div key={task.id.toString()}>
                  {renderTaskCard(task)}
                </div>
              ))}
            </div>
          </div>
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