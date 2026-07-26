import { useState } from "react";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("✅ Account Created Successfully!");

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-100">

      <form
        onSubmit={handleSignup}
        className="bg-white p-10 rounded-3xl shadow-2xl w-[400px]"
      >

        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Sign Up
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          Create Account
        </button>

        <p className="mt-5 text-center">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-600 font-bold ml-2"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}