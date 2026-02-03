import { Link } from "react-router-dom"

function NavBar() {
return(
    <nav>
        <ul>
                <Link to="/">Home</Link>
                <Link to="/login">Log In</Link>
        </ul>
    </nav>
)
}

export default NavBar; 