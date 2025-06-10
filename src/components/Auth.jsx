import { login, register } from "../utils/fetchers";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUserStore } from "../store/store";
import { AxiosError } from "axios";

export default function Auth({ mode }) {
  const setUser = useUserStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isLogin = mode === "login";
  const title = isLogin ? "Login" : "Register";
  const buttonText = isLogin ? "Login" : "Register";
  const linkText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const linkPath = isLogin ? "/register" : "/login";
  const linkButtonText = isLogin ? "Register" : "Login";

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);

      const response = isLogin
        ? await login(formData.email, formData.password)
        : await register(formData.name, formData.email, formData.password);

      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        if (error.status === 422) {
          //valdiation err
          setError([...error.response.data.errors]);
        } else {
          setError((prevError) => [...prevError, error.response.data.message]);
        }
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-1/2 xl:w-3/12 p-6 shadow-xl rounded"
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <ul className="mb-3">
          {error.length > 0
            ? error.map((e) => (
                <li className="text-red-500" key={e}>
                  {e}
                </li>
              ))
            : null}
        </ul>

        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              name="name"
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            name="email"
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            name="password"
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button type="submit" className="w-full btn btn-primary">
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            buttonText
          )}
        </button>

        <div className="mt-4 text-sm text-center">
          <span>{linkText} </span>
          <Link to={linkPath} className={"text-blue-500 hover:underline"}>
            {linkButtonText}
          </Link>
        </div>
      </form>
    </div>
  );
}
