import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const API_URL =
    'https://curly-acorn-r4jrx7j4p66xc556p-5000.app.github.dev/api/students';

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi lấy danh sách sinh viên:', err);
      showMessage('Không tải được danh sách sinh viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Không thêm được sinh viên');
      }

      setForm({
        studentId: '',
        name: '',
        email: ''
      });

      await fetchStudents();
      showMessage('Thêm sinh viên thành công', 'success');
    } catch (err) {
      console.error('Lỗi thêm sinh viên:', err);
      showMessage('Không thêm được sinh viên', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa sinh viên này không?');

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Không xóa được sinh viên');
      }

      await fetchStudents();
      showMessage('Xóa sinh viên thành công', 'success');
    } catch (err) {
      console.error('Lỗi xóa sinh viên:', err);
      showMessage('Không xóa được sinh viên', 'error');
    }
  };

  const handleUpdate = async (id, oldName, oldStudentId, oldEmail) => {
    const newStudentId = prompt('Nhập MSSV mới:', oldStudentId);
    if (newStudentId === null) return;

    const newName = prompt('Nhập họ tên mới:', oldName);
    if (newName === null) return;

    const newEmail = prompt('Nhập email mới:', oldEmail);
    if (newEmail === null) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: newStudentId,
          name: newName,
          email: newEmail
        })
      });

      if (!res.ok) {
        throw new Error('Không sửa được sinh viên');
      }

      await fetchStudents();
      showMessage('Cập nhật sinh viên thành công', 'success');
    } catch (err) {
      console.error('Lỗi sửa sinh viên:', err);
      showMessage('Không sửa được sinh viên', 'error');
    }
  };

  return (
    <div className="page">
      <div className="background-blur blur-1"></div>
      <div className="background-blur blur-2"></div>

      <div className="container">
        <div className="header-card">
          <p className="sub-title">MERN STACK + MONGODB ATLAS</p>
          <h1>Quản Lý Sinh Viên MERN</h1>
          <p className="desc">
            Giao diện quản lý sinh viên hiện đại, trực quan và dễ sử dụng
          </p>
        </div>

        {message && (
          <div className={`alert ${messageType}`}>
            {message}
          </div>
        )}

        <div className="main-grid">
          <div className="form-card">
            <h2>Thêm sinh viên</h2>

            <form onSubmit={handleSubmit} className="student-form">
              <div className="input-group">
                <label>Mã số sinh viên</label>
                <input
                  type="text"
                  placeholder="Ví dụ: B530001"
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      studentId: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nhập họ tên sinh viên"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Nhập email sinh viên"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                + Thêm Sinh Viên
              </button>
            </form>
          </div>

          <div className="list-card">
            <div className="list-header">
              <h2>Danh sách sinh viên</h2>
              <span className="student-count">{students.length} sinh viên</span>
            </div>

            {loading ? (
              <div className="empty-state">Đang tải dữ liệu...</div>
            ) : students.length === 0 ? (
              <div className="empty-state">Chưa có sinh viên nào trong danh sách</div>
            ) : (
              <div className="student-list">
                {students.map((s, index) => (
                  <div className="student-item" key={s._id}>
                    <div className="student-left">
                      <div className="avatar">{index + 1}</div>

                      <div className="student-info">
                        <h3>{s.name}</h3>
                        <p><strong>MSSV:</strong> {s.studentId}</p>
                        <p><strong>Email:</strong> {s.email}</p>
                      </div>
                    </div>

                    <div className="student-actions">
                      <button
                        className="btn btn-edit"
                        onClick={() =>
                          handleUpdate(s._id, s.name, s.studentId, s.email)
                        }
                      >
                        Sửa
                      </button>

                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(s._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;