import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import useAxios from "../../../Hooks/useAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const axiosInstant = useAxios();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);

        //update userinfo in the db.
        const userInfo = {
          email: data.email,
          role: "user", //default user.
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const userRes = await axiosInstant.post("/users", userInfo);
        console.log(userRes.data);

        //update user profile in the firebase.
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };

        updateUserProfile(userProfile)
          .then((result) => {
            console.log("Profile updated successfully", result);
            navigate(from);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);

    const formData = new FormData();
    formData.append("image", image);

    const imageUploadURL = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    // posting it
    const res = await axios.post(imageUploadURL, formData);

    console.log(res.data.data.url);
    setProfilePic(res.data.data.url);
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", {
                required: true,
              })}
              className="input"
              placeholder="Your name"
            />

            {errors?.name?.type == "required" && (
              <p className="text-red-500"> Email is require</p>
            )}

            <label className="label">Photo</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="input"
              placeholder="Your uo"
            />

            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", {
                required: true,
              })}
              className="input"
              placeholder="Email"
            />
            {errors?.email?.type == "required" && (
              <p className="text-red-500"> Email is require</p>
            )}
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
          <button className="btn btn-primary text-black mt-4">Register</button>
        </form>
        <p>
          <small>
            Already have an account{" "}
            <Link to="/logIn" className="underline text-red-500">
              Login
            </Link>
          </small>
        </p>
      </div>

      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;
