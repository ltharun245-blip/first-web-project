import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API = fetch("http://localhost:3000/requests", {

  const [loggedIn, setLoggedIn] = useState(false);
  const [requests, setRequests] = useState([]);
  const [results, setResults] = useState([]);

  const [form, setForm] = useState({
    lectureName: "",
    className: "",
    students: "",
    time: ""
  });

  const login = () => {
    setLoggedIn(true);
    getRequests();
  };

  const addRequest = async () => {
    if (!form.lectureName || !form.className || !form.students || !form.time) {
      alert("Please fill all details");
      return;
    }

    const res = await fetch(`${API}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);

    setForm({
      lectureName: "",
      className: "",
      students: "",
      time: ""
    });

    getRequests();
  };

  const getRequests = async () => {
    const res = await fetch(`${API}/requests`);
    const data = await res.json();
    setRequests(data);
  };

  const allocateRooms = async () => {
    const res = await fetch(`${API}/allocate`);
    const data = await res.json();
    setResults(data);
  };

  useEffect(() => {
    if (loggedIn) getRequests();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="logo">🎓</div>
          <h1>Smart Campus</h1>
          <p>Resource Optimization Platform</p>

          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />

          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>🎓 Smart Campus</h2>
        <p>Dashboard</p>

        <ul>
          <li>🏫 Room Allocation</li>
          <li>📋 Requests</li>
          <li>⚡ Optimization</li>
          <li>📊 Reports</li>
        </ul>

        <button className="logout" onClick={() => setLoggedIn(false)}>
          Logout
        </button>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <h1>Room Allocation Dashboard</h1>
            <p>Automatically allocate classrooms based on capacity and time.</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h3>Total Requests</h3>
            <h2>{requests.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Total Rooms</h3>
            <h2>3</h2>
          </div>

          <div className="stat-card">
            <h3>Optimization</h3>
            <h2>Auto</h2>
          </div>
        </div>

        <div className="content-grid">
          <section className="panel">
            <h2>Add Lecture Request</h2>

            <input
              placeholder="Lecture Name"
              value={form.lectureName}
              onChange={(e) =>
                setForm({ ...form, lectureName: e.target.value })
              }
            />

            <input
              placeholder="Class Name"
              value={form.className}
              onChange={(e) =>
                setForm({ ...form, className: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Number of Students"
              value={form.students}
              onChange={(e) =>
                setForm({ ...form, students: e.target.value })
              }
            />

            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            />

            <button onClick={addRequest}>➕ Add Request</button>
            <button className="secondary" onClick={allocateRooms}>
              ⚡ Allocate Rooms
            </button>
          </section>

          <section className="panel">
            <h2>📋 Lecture Requests</h2>

            {requests.length === 0 ? (
              <p className="empty">No requests added yet.</p>
            ) : (
              requests.map((r) => (
                <div className="request-card" key={r.request_id}>
                  <h3>{r.lecture_name}</h3>
                  <p>{r.class_name}</p>
                  <span>
                    {r.students} students • {r.lecture_time}
                  </span>
                </div>
              ))
            )}
          </section>
        </div>

        <section className="panel result-panel">
          <h2>🏫 Allocation Result</h2>

          {results.length === 0 ? (
            <p className="empty">Click Allocate Rooms to see result.</p>
          ) : (
            results.map((r, index) => (
              <div
                key={index}
                className={
                  r.status === "success"
                    ? "result-card success"
                    : "result-card fail"
                }
              >
                <b>{r.lectureName}</b> ({r.className}) → {r.room}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;