import { FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
      <footer
        className="m-0 #171726b3"
        style={{
          background: "rgba(23, 23, 38, 0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div className="flex flex-col md:flex-row justify-around">
          <div className="md:w-1/3 flex items-center">
            <Link to="/">
              {" "}
              <img
                src="https://cdn.prod.website-files.com/6763df1916ba4d01dfb217a8/67b48195a962fbbba202ded6_Vink%20logo.svg"
                alt="logo"
                className="w-[9rem] h-15 ml-5 md:w-40 md:h-20 md:ml-20"
              />
            </Link>
          </div>
          <div className="md:w-2/3 flex flex-col md:flex-row md:items-start md:justify-around gap-7 p-5 text-sm">
            <div>
              <p className="py-2 text-gray-400 font-semibold">Solution</p>
              <ul className="">
                <a href={"https://www.vink.ai/logistics"}>
                  {" "}
                  <li className="text-gray-100 hover:text-[#6666b5] transition duration-300">
                    Supply Chain & Logistics
                  </li>
                </a>
                <a href={"https://www.vink.ai/enterprise-security"}>
                  {" "}
                  <li className="text-gray-100 mt-3 hover:text-[#6666b5] transition duration-300">
                    CIO/CISOs
                  </li>
                </a>
              </ul>
            </div>
            <div>
              <p className="py-2 text-gray-400 font-semibold">Resources</p>
              <ul>
                <a href={"https://www.vink.ai/account-research"}>
                  {" "}
                  <li className="text-gray-100 hover:text-[#6666b5] transition duration-300">
                    100 ways to Vink
                  </li>
                </a>
              </ul>
            </div>
            <div>
              <p className="py-2 text-gray-400 font-semibold">Company</p>
              <ul>
                <a href={"https://www.vink.ai/customers"}>
                  <li className="text-gray-100 hover:text-[#6666b5] transition duration-300">
                    Customers Stories
                  </li>
                </a>
              </ul>
            </div>
          </div>
        </div>
        <hr className="md:mx-20 text-gray-100" />
        <div className="flex items-center justify-between p-5 md:px-20">
          <p className="m-0 text-xs  text-gray-100 font-medium">
            © Vink. 2025 — All rights reserved.
          </p>
          <a href="https://www.linkedin.com/company/vinkai/">
            {" "}
            <FaLinkedin size={20} className="text-white" />
          </a>
        </div>
      </footer>
    );
}
export default Footer;