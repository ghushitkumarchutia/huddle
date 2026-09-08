import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";

const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData);
      navigate("/feed");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to log in. Please check your credentials.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full'>
      <Input
        label='Email'
        name='email'
        type='email'
        value={formData.email}
        onChange={handleChange}
        placeholder='jane@example.com'
        required
      />
      <Input
        label='Password'
        name='password'
        type='password'
        value={formData.password}
        onChange={handleChange}
        placeholder='••••••••'
        required
      />

      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

      <Button type='submit' className='w-full mt-6' isLoading={isLoggingIn}>
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;
