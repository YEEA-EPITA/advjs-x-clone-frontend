import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { xcloneApi } from '../constants/axios';
import { userRequests } from '../constants/requests';
import '../styles/RegisterForm.css';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  displayName: yup.string().required('Display name is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [message, setMessage] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;

    try {
      const res = await xcloneApi.post(userRequests.register, payload);
      if (res.status === 200) {
        setMessage(['Successfully Registered.']);
        reset();
      } else {
        setMessage(['Registration failed.']);
      }
    } catch (err) {
      const validationErrors = err?.response?.data?.errors;
      if (Array.isArray(validationErrors)) {
        setMessage(validationErrors.map((err) => err.message));
      } else {
        const fallback = err?.response?.data?.message || 'Server error.';
        setMessage([fallback]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {['email', 'username', 'displayName'].map((field) => (
        <div className="form-group" key={field}>
          <input
            type="text"
            id={field}
            className="floating-input"
            {...register(field)}
            placeholder=" "
          />
          <label htmlFor={field}>
            {field === 'displayName' ? 'Display Name' : field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          {errors[field] && <p className="error-msg">{errors[field]?.message}</p>}
        </div>
      ))}

      <div className="form-group password-group">
        <input
          type={showPass ? 'text' : 'password'}
          id="password"
          className="floating-input"
          {...register('password')}
          placeholder=" "
        />
        <label htmlFor="password">Password</label>
        <span className="toggle-icon" onClick={() => setShowPass(!showPass)}>
          <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
        </span>
        {errors.password && <p className="error-msg">{errors.password?.message}</p>}
      </div>

      <div className="form-group password-group">
        <input
          type={showConfirmPass ? 'text' : 'password'}
          id="confirmPassword"
          className="floating-input"
          {...register('confirmPassword')}
          placeholder=" "
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <span className="toggle-icon" onClick={() => setShowConfirmPass(!showConfirmPass)}>
          <FontAwesomeIcon icon={showConfirmPass ? faEye : faEyeSlash} />
        </span>
        {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword?.message}</p>}
      </div>

      <button type="submit" className="submit-btn">Submit</button>

      {message.length > 0 && (
        <div className="message-area">
          {message.map((msg, i) => (
            <div key={i}>• {msg}</div>
          ))}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;