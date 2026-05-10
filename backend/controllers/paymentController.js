const Payment = require('../models/Payment');

const mongoose = require('mongoose');
const Student = require('../models/Student');
const User = require('../models/User');
const Fee = require('../models/Fee');

exports.createPayment = async (req, res) => {
  try {
    const body = { ...req.body };

    // Accept either a MongoDB user ObjectId or a university `student_id` string.
    if (body.student) {
      const isObjectId = mongoose.Types.ObjectId.isValid(body.student);
      if (!isObjectId) {
        // Treat as university student identifier (student_id)
        const student = await Student.findOne({ student_id: body.student });
        if (!student) return res.status(400).json({ error: 'Student not found' });
        body.student = student._id;
      } else {
        // If an ObjectId was provided, it may be a Student._id or a User._id
        const studentDoc = await Student.findById(body.student);
        if (studentDoc) {
          body.student = studentDoc._id;
        } else {
          // try as User id -> resolve to linked Student
          const userDoc = await User.findById(body.student);
          if (userDoc && userDoc.student) {
            body.student = userDoc.student;
          } else {
            return res.status(400).json({ error: 'Student not found' });
          }
        }
      }
    }

    const payment = await Payment.create(body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    // fetch payments without populate to avoid CastErrors from mixed student values
    const payments = await Payment.find().lean();

    const resolved = await Promise.all(payments.map(async p => {
      const out = { ...p };

      // resolve student: can be Student._id, User._id, or student_id string
      try {
        if (out.student) {
          if (mongoose.Types.ObjectId.isValid(out.student)) {
            // try Student first
            let s = await Student.findById(out.student).lean();
            if (!s) {
              const u = await User.findById(out.student).lean();
              if (u && u.student) s = await Student.findById(u.student).lean();
            }
            out.student = s || out.student;
          } else {
            // treat as university student_id
            const s = await Student.findOne({ student_id: out.student }).lean();
            out.student = s || out.student;
          }
        }
      } catch (e) {
        // ignore resolution errors and keep original value
      }

      // resolve fee if present
      try {
        if (out.fee && mongoose.Types.ObjectId.isValid(out.fee)) {
          const feeDoc = await Fee.findById(out.fee).populate('category').lean();
          out.fee = feeDoc || out.fee;
        }
      } catch (e) {}

      return out;
    }));

    res.json(resolved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ error: 'Not found' });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};// Payment Controller Boilerplate
// End of payment controller
