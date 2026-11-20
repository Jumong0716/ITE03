const years = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };

function StudentItem({ student, number, showActions, onEdit, onDelete, onSelect }) {
  const initials = (student.firstname[0] + student.lastname[0]).toUpperCase();

  return (
    <tr className="clickable" onClick={() => onSelect(student)}>
      <td className="num mono">{number}</td>
      <td className="name">
        <span className="who">
          <span className="mini-avatar">{initials}</span>
          {student.firstname} {student.middlename} {student.lastname}
        </span>
      </td>
      <td className="mono">{student.contact_number}</td>
      <td><span className="badge">{student.course}</span></td>
      <td className="num">
        <span className="badge neutral">{years[student.year]} year</span>
      </td>
      {showActions && (
        <td className="right">
          <div className="row-actions">
            <button className="act edit" onClick={(e) => { e.stopPropagation(); onEdit(student); }}>Edit</button>
            <button className="act delete" onClick={(e) => { e.stopPropagation(); onDelete(student); }}>Delete</button>
          </div>
        </td>
      )}
    </tr>
  );
}

export default StudentItem;