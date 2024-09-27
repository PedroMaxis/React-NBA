import React, { useState } from 'react';
import axios from 'axios';
import { Header } from "../Components/Header"


export function Register() {
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error || 'Erro ao registrar.');
    }
  };

  return (
    <>
      <Header/>
      <div>
      <h2>Registra</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </>
  );
}

