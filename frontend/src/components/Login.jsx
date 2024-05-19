import {useState} from "react";
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";

const Login = () => {
    let [email,setEmail]=useState("");
    let [password,setPassword]=useState("");
    let [showPasswordField,setShowPasswordField]=useState(false);
    let [error,setError]=useState();

    const handleSubmit = async ()=>{
        if(password!==""){
            fetch('/auth/login/password',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"username":email, "password": password})
            })
                .then(r=>{
                    if(r.status===200){
                        return r.json()
                    }

                    throw new Error("Invalid username or password");
                })
                .then(r=>{
                    if(r){
                        window.location.reload();
                    }
                })
                .catch(e=>{
                    setError(e.message || "An error occurred. Please try again.");
                })
            ;
        }else{
            fetch('/auth/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({ "username": email })
            })
            .then(r=>r.json())
            .then(r=>{
                if(r.ask_password){
                    setShowPasswordField(true); 
                }
                if(r.redirect){
                    window.location.href = r.redirect;
                }
                if(typeof r.error !=="undefined" ){
                    setError(r.error);
                }
            })
        }

    };
    return (
        <div className="login-form">
            <h1>Login</h1>
        <div className="d-grid gap-2">
            {error && <div className="alert alert-danger">{error}</div>}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                </Form.Group>

                {showPasswordField && 
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
                    </Form.Group>
                }
                <Form.Group controlId="formBasicCheckbox">
                    <Button onClick={handleSubmit} size="lg" variant="primary">
                        Login
                    </Button>
                </Form.Group>

            <Button variant="secondary" size="lg" href="/auth/google">Login With Google</Button>
            <Button variant="secondary" size="lg" href="/auth/azure">Login With Office 365</Button>
        </div>
        </div>
    );
}

export default Login;

