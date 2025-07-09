import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "./SocialLogin/SocialLogin";
import useAuth from "../../Hooks/useAuth";

const Login = () => {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const onSubmit = (data) => {
    console.log(data);
    signIn(data.email, data.password)
      .then((result) => {
        console.log(result);
        navigate(from);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-3xl font-bold">Plese login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input"
              placeholder="Email"
            />
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", {
                required: true,
                minLength: 6,
              })}
              className="input"
              placeholder="Password"
            />
            {errors?.password?.type === "required" && (
              <p className="text-sm text-red-500">Password is required</p>
            )}

            {errors?.password?.type === "minLength" && (
              <p className="text-red-500">
                Password must be 6 charecter or longer
              </p>
            )}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
          </fieldset>
          <button className="btn btn-primary text-black mt-4">Login</button>
        </form>

        <p>
          <small>
            Don't have an account{" "}
            <Link
              to="/register"
              className="underline text-red-500"
              state={{ from }}
            >
              Register
            </Link>
          </small>
        </p>
      </div>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Login;
