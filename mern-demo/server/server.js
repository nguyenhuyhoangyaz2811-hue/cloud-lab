const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// KẾT NỐI MONGODB ATLAS
// ===============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// ===============================
// MODEL STUDENT
// ===============================
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

// ===============================
// API KIỂM TRA BACKEND
// ===============================
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Backend đang hoạt động ngon lành!'
  });
});

// ===============================
// GET - LẤY DANH SÁCH SINH VIÊN
// ===============================
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);
  } catch (err) {
    console.error('Lỗi lấy danh sách:', err);

    res.status(500).json({
      error: err.message
    });
  }
});

// ===============================
// POST - THÊM SINH VIÊN
// ===============================
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        error: 'Vui lòng nhập đầy đủ MSSV, họ tên và email'
      });
    }

    const newStudent = await Student.create({
      studentId,
      name,
      email
    });

    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Lỗi thêm sinh viên:', err);

    res.status(400).json({
      error: err.message
    });
  }
});

// ===============================
// PUT - SỬA SINH VIÊN
// ===============================
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        error: 'Không tìm thấy sinh viên'
      });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    console.error('Lỗi sửa sinh viên:', err);

    res.status(400).json({
      error: err.message
    });
  }
});

// ===============================
// DELETE - XÓA SINH VIÊN
// ===============================
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!deletedStudent) {
      return res.status(404).json({
        error: 'Không tìm thấy sinh viên để xóa'
      });
    }

    res.status(200).json({
      message: 'Xóa sinh viên thành công',
      student: deletedStudent
    });
  } catch (err) {
    console.error('Lỗi xóa sinh viên:', err);

    res.status(500).json({
      error: err.message
    });
  }
});

// ===============================
// KHỞI ĐỘNG SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});