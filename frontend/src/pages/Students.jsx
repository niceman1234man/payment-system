import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/students')
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Loading students...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Students</h2>
      {students.length === 0 ? (
        <div className="text-center text-gray-500">No students found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4">Student No</th>
                <th className="py-2 px-4">Full Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Department</th>
                <th className="py-2 px-4">Program</th>
                <th className="py-2 px-4">Year</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {students?.map(student => (
                <tr key={student._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{student.student_no}</td>
                  <td className="py-2 px-4">{student.full_name}</td>
                  <td className="py-2 px-4">{student.email}</td>
                  <td className="py-2 px-4">{student.phone}</td>
                  <td className="py-2 px-4">{student.department}</td>
                  <td className="py-2 px-4">{student.program}</td>
                  <td className="py-2 px-4">{student.year_of_study}</td>
                  <td className="py-2 px-4">{student.enrollment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;
