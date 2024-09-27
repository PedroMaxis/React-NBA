import React, { useState } from 'react';
import axios from 'axios';
import { Header } from "../Components/Header";
import { Link } from 'react-router-dom';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    // Exemplo de erro de autenticação
                    setMessage('Usuário não registrado ou senha inválida.');
                } else {
                    setMessage(error.response.data.error || 'Erro ao fazer login.');
                }
            } else {
                setMessage('Erro ao se conectar ao servidor.');
            }
        }
    };

    return (
        <>
            <Header />
            <div className='flex flex-col items-center justify-center min-h-[900px] bg-gray-100'>
                <h2 className='text-2xl font-bold mb-6'>Login</h2>
                <form 
                    onSubmit={handleLogin} 
                    className='bg-white p-6 rounded-lg shadow-md w-80'
                >
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700'>Usuário:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700'>Senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
                        />
                    </div>
                    <button 
                        type="submit" 
                        className='w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200'
                    >
                        Login
                    </button>
                </form>
                {message && <p className='mt-4 text-red-600'>{message}</p>}
                <p className='mt-4 text-gray-600'>
                    Não possui uma conta? 
                    <Link to="/register" className='text-blue-500 hover:underline'> Registre-se</Link>
                </p>
            </div>
        </>
    );
}
