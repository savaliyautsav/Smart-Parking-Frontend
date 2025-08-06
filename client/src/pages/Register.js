import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, phone, password } = form;

    if (!name || !email || !phone || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Store additional info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        createdAt: new Date()
      });

      alert('Registered successfully!');
      navigate('/login');
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="name" className="form-control mb-3" placeholder="Full Name"
          value={form.name} onChange={handleChange} />

        <input type="email" name="email" className="form-control mb-3" placeholder="Email"
          value={form.email} onChange={handleChange} />

        <input type="text" name="phone" className="form-control mb-3" placeholder="Phone Number"
          value={form.phone} onChange={handleChange} />

        <input type="password" name="password" className="form-control mb-3" placeholder="Password"
          value={form.password} onChange={handleChange} />

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

export default Register;
