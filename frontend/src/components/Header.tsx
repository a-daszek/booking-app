import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  // bg-blue-800 -> in tailwind the higher the value, the darker the color is going to be, py-6 -> padding on the y axis with the value of 6, flex space-x-2 -> adding spacing beetween all the child elements within the span
  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracing-tight">
          <Link to="/">HolidayRooms.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/my-bookings">Moje rezerwacje</Link>
              <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/my-hotels">Moje hotele</Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Zaloguj się
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
