import { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api/students';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const emptyForm = {
  firstname: '',
  middlename: '',
  lastname: '',
  contact_number: '',
  course: '',
  year: '',
};

const years = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };

function App() {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState('home');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [profile, setProfile] = useState(null);

const loadStudents = (manual = false) => {
  setRefreshing(true);
  setError('');
  if (manual) setMessage('');

  return fetch(API_URL, { headers })
    .then((res) => res.json())
    .then((data) => {
      setStudents(data);
      if (manual) setMessage('Student list refreshed.');
    })
    .catch(() => {
      setError('Could not load students. Is Laravel running?');
    })
    .finally(() => {
      setLoading(false);
      setRefreshing(false);
    });
};

useEffect(() => {
  loadStudents();
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE and UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }

      if (editingId) {
        setStudents(students.map((s) => (s.id === editingId ? data : s)));
        setMessage('Student updated successfully.');
        setPage('manage');
      } else {
        setStudents([...students, data]);
        setMessage('Student added successfully.');
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setError('Could not reach the server.');
    }
  };

  // UPDATE
  const handleEdit = (student) => {
    setForm({
      firstname: student.firstname,
      middlename: student.middlename || '',
      lastname: student.lastname,
      contact_number: student.contact_number,
      course: student.course,
      year: String(student.year),
    });
    setEditingId(student.id);
    setMessage('');
    setError('');
    setPage('add');
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPage('manage');
  };

  const goTo = (next) => {
    if (next === 'add' && editingId) {
      setEditingId(null);
      setForm(emptyForm);
    }
    setMessage('');
    setError('');
    setPage(next);
  };

  // DELETE
  const handleDelete = async (id) => {
    setDeleteTarget(null);

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers });
      setStudents(students.filter((s) => s.id !== id));
      setMessage('Student deleted successfully.');
    } catch {
      setError('Could not delete the student.');
    }
  };

  const q = search.trim().toLowerCase();
  const filtered = students.filter((s) =>
    `${s.firstname} ${s.middlename || ''} ${s.lastname} ${s.course} ${s.contact_number} ${s.year}`
      .toLowerCase()
      .includes(q)
  );

  if (page === 'home') {
    const latest = students[students.length - 1];
    const cards = [
      ['students', 'Students', 'Browse every record, search by name or course, and open a full profile.'],
      ['add', 'Add student', 'Enroll a new student with their personal and course details.'],
      ['manage', 'Manage students', 'Edit details or remove records when something changes.'],
    ];

    return (
      <div className="landing">
        <header className="land-nav">
          <span className="land-brand">
            <span className="logo">V</span>
            <span>Student Records</span>
          </span>
          <nav className="land-links">
            <button onClick={() => goTo('students')}>Students</button>
            <button onClick={() => goTo('add')}>Add student</button>
            <button onClick={() => goTo('manage')}>Manage</button>
          </nav>
        </header>

        <section className="land-hero">
          <div className="land-copy">
            <h1>Student records, kept in good order.</h1>
            <p className="land-lead">
              Add new enrollments, find anyone in seconds, and keep every student's details up to date in one place.
            </p>
            <div className="land-cta">
              <button className="btn solid" onClick={() => goTo('students')}>View students</button>
              <button className="btn" onClick={() => goTo('add')}>Add student</button>
            </div>
          </div>

          <div className="land-visual" aria-hidden="true">
            <span className="crest" />
            <div className="peek">
              <span className="peek-label">{latest ? 'Recently added' : 'Your first student'}</span>
              <div className="peek-row">
                <span className="peek-avatar">
                  {latest ? (latest.firstname[0] + latest.lastname[0]).toUpperCase() : 'SR'}
                </span>
                <div className="peek-text">
                  <strong>{latest ? `${latest.firstname} ${latest.lastname}` : 'Appears here'}</strong>
                  <span>{latest ? `${latest.course} · ${years[latest.year]} year` : 'Add a student to begin'}</span>
                </div>
              </div>
            </div>
            <div className="peek-chip"><b>{students.length}</b> enrolled</div>
          </div>
        </section>

        {error && <div className="notice bad">{error}</div>}

        <section className="land-cards">
          {cards.map(([target, title, text]) => (
            <button key={target} className="land-card" onClick={() => goTo(target)}>
              <h2>{title}</h2>
              <p>{text}</p>
            </button>
          ))}
        </section>

        <footer>
          <span>Student Records • Ulysses Pogi</span>
          <span>Veritas • Laravel API + React</span>
        </footer>
      </div>
    );
  }

  const titles = {
    students: ['Students', `${students.length} records`],
    add: [
      editingId ? 'Edit student' : 'Add student',
      editingId ? 'Update the details below' : 'Fill in the details',
    ],
    manage: ['Manage students', 'Edit or delete records'],
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <button className="brand" onClick={() => goTo('home')} title="Back to home">
          <span className="logo">V</span>
          <span>Student Records</span>
        </button>
        <nav>
          <button className={`nav-item ${page === 'students' ? 'active' : ''}`} onClick={() => goTo('students')}>
            Students
          </button>
          <button className={`nav-item ${page === 'add' ? 'active' : ''}`} onClick={() => goTo('add')}>
            Add student
          </button>
          <button className={`nav-item ${page === 'manage' ? 'active' : ''}`} onClick={() => goTo('manage')}>
            Manage students
          </button>
        </nav>
      </aside>

      <main className="content">
        <header className="page-head">
          <h1>{titles[page][0]}</h1>
          <p>{titles[page][1]}</p>
        </header>

        {message && <div className="notice ok">{message}</div>}
        {error && <div className="notice bad">{error}</div>}

        {page === 'add' && (
          <StudentForm
            form={form}
            editingId={editingId}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {page !== 'add' && (
          <div className="toolbar">
  <div className="search-box">
    <input
      className="search"
      type="search"
      placeholder="Search by name, course, or contact"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {page === 'students' && (
    <button
      className="btn"
      onClick={() => loadStudents(true)}
      disabled={refreshing}
    >
      {refreshing ? 'Refreshing...' : 'Refresh'}
    </button>
  )}

  <span className="result-count">
    Showing {filtered.length} of {students.length}
  </span>
</div>
        )}

        {page !== 'add' && (loading ? (
          <p>Loading...</p>
        ) : (
          <StudentList
            students={filtered}
            allStudents={students}
            onSelect={setProfile}
            showActions={page === 'manage'}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        ))}

        <footer>
          <span>Student Records • Ulysses Pogi</span>
          <span>Veritas • Laravel API + React</span>
        </footer>
      </main>

      {profile && (
        <div className="overlay" onClick={() => setProfile(null)}>
          <div className="profile" onClick={(e) => e.stopPropagation()}>
            <button className="profile-close" onClick={() => setProfile(null)}>×</button>
            <div className="profile-top">
              <div className="avatar">{(profile.firstname[0] + profile.lastname[0]).toUpperCase()}</div>
              <h3>{profile.firstname} {profile.middlename} {profile.lastname}</h3>
              <p>{profile.course} · {years[profile.year]} year</p>
            </div>
            <dl className="profile-grid">
              <div><dt>Student ID</dt><dd>#{students.findIndex((s) => s.id === profile.id) + 1}</dd></div>
              <div><dt>Contact number</dt><dd>{profile.contact_number}</dd></div>
              <div><dt>First name</dt><dd>{profile.firstname}</dd></div>
              <div><dt>Middle name</dt><dd>{profile.middlename || '—'}</dd></div>
              <div><dt>Last name</dt><dd>{profile.lastname}</dd></div>
              <div><dt>Course</dt><dd>{profile.course}</dd></div>
              <div><dt>Year level</dt><dd>{years[profile.year]} year</dd></div>
            </dl>
            <div className="profile-actions">
              <button className="btn" onClick={() => setProfile(null)}>Close</button>
              <button className="btn solid" onClick={() => { setProfile(null); handleEdit(profile); }}>
                Edit profile
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="overlay" onClick={() => setDeleteTarget(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this record?</h3>
            <p>
              <strong>{deleteTarget.firstname} {deleteTarget.lastname}</strong> will be
              permanently removed from the database. This cannot be undone.
            </p>
            <div className="dialog-actions">
              <button className="btn" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn red-solid" onClick={() => handleDelete(deleteTarget.id)}>
                Delete record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;