import React, { useState, useCallback, useEffect } from 'react';
import Header from './Header';
import './Home.css';
import { useAuth } from '../authContext/AuthContext';
import axios from 'axios';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [loadingToggle, setLoadingToggle] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    getTaskList()
  }, [])

  async function getTaskList() {
    try {
      const response = await axios.get('http://localhost:4000/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response?.data && response?.data?.data) {
        setTasks(response.data.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.log('error ', err)
      setTasks([]);
      // if (err.response) {
      //   alert(err.response.data.error || 'Please try again.');
      // }
    }
  }

  const handleDeleteTask = useCallback(async(id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`http://localhost:4000/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })


      if (response?.data && response?.data?.data) {
        getTaskList();
      } else {
      }
    } catch (error) {
    }
  }, []);

  const toggleTaskCompletion = useCallback(async (id) => {
    // alert(id);
    try {
      setLoadingToggle(id);
      const response = await axios.put(`http://localhost:4000/tasks/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response?.data && response?.data?.data) {
        setLoadingToggle(null);
        getTaskList();
      } else {
        setLoadingToggle(null);
      }
    } catch (error) {
      setLoadingToggle(null);
    } finally {
      setLoadingToggle(null);
    }
  }, []);

  const handleSaveTask = useCallback(async () => {
    if (!taskName.trim()) {
      alert('Please enter a task name');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/tasks', {
        name: taskName
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })


      if (response.data) {
        // alert(response.data.message);
        getTaskList();
      }
    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || 'Please try again.');
      }
    }

    setTaskName('');
    setShowModal(false);
  }, [taskName]);

  return (
    <>
      <Header />
      <div className="container">
        <button className="create-task-btn" onClick={() => setShowModal(true)}>
          Create Task
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Create Task</h3>
              <input
                type="text"
                placeholder="Task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <div className="modal-buttons">
                <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSaveTask}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <ul className="task-list">
          {tasks.length === 0 && <p>No tasks created yet.</p>}
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <span className={`task-name ${task.isCompleted ? 'completed' : ''}`}>
                {task.name}
              </span>
              <div className="task-actions">
              <button
                className={`toggle-btn ${task.completed ? 'completed' : 'incomplete'
                  }`}
                onClick={() => toggleTaskCompletion(task._id)}
                disabled={loadingToggle === task._id}
                title={task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
              >
                {loadingToggle === task._id
                  ? '...'
                  : task.completed
                    ? 'Completed'
                    : 'Incomplete'}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(task._id)}
                title="Delete Task"
              >
                Delete
              </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;
