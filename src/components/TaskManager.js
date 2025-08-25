import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskManager.css';

const API_URL = "http://localhost:8000/api/tasks/";

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get(API_URL);
        setTasks(response.data);
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        await axios.post(API_URL, { title, completed: false });
        setTitle("");
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await axios.delete(`${API_URL}${id}/`);
        fetchTasks();
    };

    const startEditing = (task) => {
        setEditingId(task.id);
        setEditingTitle(task.title);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingTitle("");
    };

    const updateTask = async (id) => {
        if (!editingTitle.trim()) return;
        await axios.put(`${API_URL}${id}/`, {
            title: editingTitle,
            completed: false,
        });
        cancelEditing();
        fetchTasks();
    };

    return (
        <div className="container">
            <h2>📝 Task Manager</h2>
            <form onSubmit={addTask} className="task-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New Task"
                    required
                />
                <button type="submit">Add</button>
            </form>

            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id} className="task-item">
                        {editingId === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                />
                                <button onClick={() => updateTask(task.id)}>Save</button>
                                <button onClick={cancelEditing}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{task.title}</span>
                                <div className="btn-group">
                                    <button onClick={() => startEditing(task)}>✏️</button>
                                    <button onClick={() => deleteTask(task.id)}>❌</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskManager;
