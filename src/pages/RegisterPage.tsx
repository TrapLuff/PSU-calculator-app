import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate, Link } from 'react-router-dom';

import { HeaderComponent } from "../components/Header/Header";
import { ROUTE_LABELS } from "../routes";
const API_URL = import.meta.env.VITE_API_URL;
const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    fullName: '',
  });

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (
      !formData.login ||
      !formData.password ||
      !formData.fullName
    ) {
      setError('Заполните все поля');
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/users/register`,
        {
          login: formData.login,
          password: formData.password,
          fullName: formData.fullName,
        }
      );

      setSuccess('Регистрация успешна');

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Ошибка регистрации'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <HeaderComponent crumbs={[{ label: ROUTE_LABELS.REGISTER }]}/>
    <div
      style={{
        width: '400px',
        margin: '100px auto',
        padding: '30px',
        border: '1px solid #ccc',
        borderRadius: '10px',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Регистрация
      </h2>

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '15px',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            color: 'green',
            marginBottom: '15px',
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px', margin: '20px' }}>
          <input
            type="text"
            name="fullName"
            placeholder="ФИО"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px', margin: '20px' }}>
          <input
            type="text"
            name="login"
            placeholder="Логин"
            value={formData.login}
            onChange={handleChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px', margin: '20px' }}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? 'Загрузка...'
            : 'Зарегистрироваться'}
        </button>
      </form>

      <div
        style={{
          marginTop: '20px',
          textAlign: 'center',
        }}
      >
        Уже есть аккаунт?

        <Link
          to="/login"
          style={{
            marginLeft: '5px',
          }}
        >
          Войти
        </Link>
      </div>
    </div>
    </main>
  );
};

export default RegisterPage;