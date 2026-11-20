import StudentItem from './StudentItem';

function StudentList({ students, allStudents, showActions, onEdit, onDelete, onSelect }) {
  if (students.length === 0) {
    return (
      <div className="block">
        <p className="empty">No student records found.</p>
      </div>
    );
  }
  return (
    <div className="block">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="num">ID</th>
              <th>Full name</th>
              <th>Contact</th>
              <th>Course</th>
              <th className="num">Year</th>
              {showActions && <th className="right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <StudentItem
                key={student.id}
                student={student}
                number={allStudents.findIndex((s) => s.id === student.id) + 1}
                onSelect={onSelect}
                showActions={showActions}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>);
}

export default StudentList;