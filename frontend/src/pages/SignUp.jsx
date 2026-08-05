import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import subwayHero from "../assets/subway-hero.jpg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />

      <section
        className="relative bg-cover bg-center px-6 py-16"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,22,18,0.6) 0%, rgba(15,22,18,0.75) 100%), url(${subwayHero})`,
          backgroundPosition: "center 40%",
        }}
      >
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl px-8 py-9">
        <h1 className="font-sans font-semibold text-2xl mb-1.5">Create your account</h1>
        <p className="text-warm-gray text-sm mb-8">
          Sign up to save opportunities and get personalized recommendations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-charcoal mb-1.5">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-charcoal mb-1.5">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" variant="accent" size="lg" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-warm-gray mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
