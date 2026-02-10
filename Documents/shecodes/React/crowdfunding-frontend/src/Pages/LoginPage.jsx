import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

// Login page should show both Login and Create Account options underneath
function LoginPage() {
  return (
    <div>
      <div>
        <LoginForm />
      </div>
      <hr />
      <div>
        <SignupForm />
      </div>
    </div>
  );
}

export default LoginPage;
