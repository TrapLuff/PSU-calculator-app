import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';

import { setUser } from '../slices/userSlice';

import { useNavigate, Link } from 'react-router-dom';

import { fetchCartAsync } from '../slices/cartSlice';

import { HeaderComponent } from "../components/Header/Header";
import { ROUTE_LABELS } from "../routes";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  dispatch(fetchCartAsync());

  const [error, setError] = useState('');

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

    if (!formData.login || !formData.password) {
      setError('Заполните все поля');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        '/api/users/auth',
        {
          login: formData.login,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(response.data.user));

      navigate('/components');
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Ошибка авторизации'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main><HeaderComponent
                    crumbs={[{ label: ROUTE_LABELS.LOGIN }]}
                />
                
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
        Авторизация
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

      <form onSubmit={handleSubmit}>
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
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>

      <div
        style={{
          marginTop: '20px',
          textAlign: 'center',
        }}
      >
        Нет аккаунта?

        <Link
          to="/register"
          style={{
            marginLeft: '5px',
          }}
        >
          Зарегистрироваться
        </Link>
      </div>
    </div>
    </main>
  );
};

export default LoginPage;