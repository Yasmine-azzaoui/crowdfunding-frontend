import { useState } from "react";
import postLogin from "../../api/post-login";
import { useNavigate } from "react-router-dom";

function LoginForm() {
        const navigateTo = useNavigate()
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => {
        const { id, value } = event.target;

        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));

    };

    const handleSubmit = (event) => {
        console.log("we are submitting form");

        event.preventDefault();

        
        if (credentials.username && credentials.password) {
        postLogin(credentials.username, credentials.password).then((response) => {
        console.log(response.token);
        window.localStorage.setItem("token", response.token);
        navigateTo("/");

        
            // window.localStorage.setItem("token", response.token);
            // navigateTo("/")
        });
    }
};

    return(
    <form>
        <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" placeholder="Enter username" onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input 
            type="password" 
            id="password" 
            placeholder="Password" 
            onChange={handleChange}
            />
        </div>
        <button type="submit" onClick={handleSubmit}>
            Login
        </button>
        </form>
    );
}

export default LoginForm;