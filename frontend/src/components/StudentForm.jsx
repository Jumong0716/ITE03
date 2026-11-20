function StudentForm({ form, editingId, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="block student-form">
      <fieldset className="form-section">
        <legend>Personal information</legend>
        <p className="section-hint">Enter the name as it appears on official school records.</p>
        <div className="fields cols-3">
          <label>First name <span className="req">*</span>
            <input name="firstname" value={form.firstname} onChange={onChange} autoComplete="off" required />
          </label>
          <label>Middle name <span className="opt">(optional)</span>
            <input name="middlename" value={form.middlename} onChange={onChange} autoComplete="off" />
          </label>
          <label>Last name <span className="req">*</span>
            <input name="lastname" value={form.lastname} onChange={onChange} autoComplete="off" required />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Contact and enrollment</legend>
        <p className="section-hint">How to reach the student and where they are enrolled.</p>
        <div className="fields cols-3">
          <label>Contact number <span className="req">*</span>
            <input name="contact_number" value={form.contact_number} onChange={onChange} placeholder="e.g. 09171234567" required />
          </label>
          <label>Course <span className="req">*</span>
            <input name="course" value={form.course} onChange={onChange} placeholder="e.g. BSIT" required />
          </label>
          <label>Year level <span className="req">*</span>
            <select name="year" value={form.year} onChange={onChange} required>
              <option value="" disabled>Select year level</option>
              <option value="1">1st year</option>
              <option value="2">2nd year</option>
              <option value="3">3rd year</option>
              <option value="4">4th year</option>
            </select>
          </label>
        </div>
      </fieldset>

      <div className="form-footer">
        <span className="form-note"><span className="req">*</span> Required field</span>
        <div className="form-buttons">
          {editingId && (
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          )}
          <button type="submit" className="btn solid">
            {editingId ? 'Save changes' : 'Add student'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default StudentForm;