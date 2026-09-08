import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";

const SignupForm = () => {
  const { signup, isSigningUp } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(formData);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to sign up. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full'>
      <Input
        label='Display Name'
        name='displayName'
        value={formData.displayName}
        onChange={handleChange}
        placeholder='Jane Doe'
        required
      />
      <Input
        label='Username'
        name='username'
        value={formData.username}
        onChange={handleChange}
        placeholder='janedoe'
        required
      />
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

      <Button type='submit' className='w-full mt-6' isLoading={isSigningUp}>
        Sign Up
      </Button>
    </form>
  );
};

export default SignupForm;
