import { Link, LogIn, LogOut } from "react-feather";
import { useAuth } from "../context/authContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <div id="header--wrapper">
      {user ? (
        <>
          Welcome {user.name}
          <LogOut className="header--link" onClick={logout} />
        </>
      ) : (
        <>
          <Link to="/">
            <LogIn className="header--link" />
          </Link>
        </>
      )}
    </div>
  );
}
