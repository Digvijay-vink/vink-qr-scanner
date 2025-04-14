import { Link } from "react-router-dom";

const Header=()=>{
    return (
      <header
        className="bg-[#171726b3] fixed top-0 left-0 w-full z-10"
        style={{
          background: "rgba(23, 23, 38, 0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div className="border-b-2  p-1">
          <Link to="/">
            {" "}
            <img
              src="https://cdn.prod.website-files.com/6763df1916ba4d01dfb217a8/67b48195a962fbbba202ded6_Vink%20logo.svg"
              alt="logo"
              className="w-[9rem] h-15 ml-5 md:w-40 md:h-20 md:ml-20"
            />
          </Link>
        </div>
      </header>
    );
}
export default Header;