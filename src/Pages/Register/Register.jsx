import React, { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import SmartBillContext from "../../Context/SmartBillContext";
import { toast } from "react-toastify";

const Register = () => {
  const { googleLogIn, createAccount } = use(SmartBillContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleGoogleLogin = () => {
    googleLogIn()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter.");
    } else if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter.");
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number.");
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { email, password, ...alldata } = Object.fromEntries(
      formData.entries()
    );
    createAccount(email, password)
      .then((result) => {
        toast.success(`Account create successfully`);
        // save information in db
        const userProfile = {
          email,
          ...alldata,
          creationTime: result.user?.metadata?.creationTime,
          lastSignInTime: result.user?.metadata?.lastSignInTime,
        };
        fetch("https://smartbill-managment-server.onrender.com/register",{
          method:"POST",
          headers:{
            'content-type': "application/json"
          },
          body:JSON.stringify(userProfile)
        }).then(res=>res.json())
        .then(data=>{
          console.log(data);
        })
      })
      .catch((err) => toast.error(err.message));

    if (passwordError) {
      toast.error("Invalid Password", passwordError, "error");
      return;
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover bg-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create an Account
          </h2>
          <form onSubmit={handleRegister}>
            {/* Full Name Field */}
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-gray-700 font-medium mb-2"
              >
                Full Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
                required
              />
            </div>

            {/* Photo URL Field */}
            <div className="mb-4">
              <label
                htmlFor="photoURL"
                className="block text-gray-700 font-medium mb-2"
              >
                Photo URL
              </label>
              <input
                type="url"
                id="photoURL"
                name="photoURL"
                placeholder="Enter your photo URL (optional)"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative ">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password <span className="text-red-700">*</span>
              </label>
              <input
                type={showPass ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
                onChange={handlePasswordChange}
                required
              />

              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-6 bottom-3 cursor-pointer"
              >
                {showPass ? (
                  <FaRegEyeSlash size={20} />
                ) : (
                  <FaRegEye size={20} />
                )}
              </button>
            </div>

            {/* Error Message */}
            {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
            <p className="text-red-600 text-sm mb-4"></p>

            {/* Register Button */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition duration-300"
            >
              Register
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            type="submit"
            className="btn bg-white text-black border-[#e5e5e5] w-full"
          >
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
