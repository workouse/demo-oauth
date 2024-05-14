import React from "react";

const Login = () => {
    return (
        <div className="login-form">
            <h1>Login</h1>
        <ul>
        <li>
            <a href="/auth/google" className="btn btn-block btn-social btn-google">
            Login With Google
            </a>
        </li>
        <li>
            <a href="/auth/azure" className="btn btn-block btn-social btn-azure">
            Login With Office 365
            </a>
        </li>
        </ul>
        </div>
    );
}

export default Login;

