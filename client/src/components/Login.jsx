import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';


export default function Signup() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(username, password);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div style={{ overflow: "hidden" }}>
            {
                user && user.role
            }
            <div className="flex w-screen flex-wrap text-slate-800">
                <div className="flex w-full flex-col md:w-1/2">
                    <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
                        <p className="mt-6 text-center font-medium md:text-left">Sign in to your account below.</p>

                        <form className="flex flex-col items-stretch pt-3 md:pt-8" onSubmit={handleSubmit}>
                            <div className="flex flex-col pt-4">
                                <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <input
                                        type="text"
                                        id="login-username"
                                        className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4 flex flex-col pt-4">
                                <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <input
                                        type="password"
                                        id="login-password"
                                        className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <a href="#" className="mb-6 text-center text-sm font-medium text-gray-600 md:text-left">
                                Forgot password?
                            </a>

                            <button
                                type="submit"
                                className={`rounded-lg px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition md:w-32 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <div className="py-12 text-center">
                            <p className="text-gray-600">
                                Forget Password?
                                <Link to="/reset-password" className="ml-2 whitespace-nowrap font-semibold text-gray-900 underline underline-offset-4">
                                    Click to Reset
                                </Link>
                            </p>
                        </div>
                    </div>
                </div></div>
        </div>
    );
}
