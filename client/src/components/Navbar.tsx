import Link from "next/link";

import RedditLogo from "../images/reddit.svg";

const Navbar: React.FC = () => (
  <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
    <div className="flex items-center">
      <Link href="/">
        <a>
          <RedditLogo className="h-8 mr-2 w-" />
        </a>
      </Link>
      <span className="text-2xl font-semibold">
        <Link href="/">reddit</Link>
      </span>
    </div>
    <div className="flex items-center mx-auto transition duration-200 bg-gray-100 border rounded hover:bg-white hover:border-blue-500">
      <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
      <input
        type="text"
        placeholder="Search"
        className="py-1 pr-3 bg-transparent rounded focus:outline-none w-160"
      />
    </div>
    <div className="flex">
      <Link href="/login">
        <a className="hollow blue button">login</a>
      </Link>
      <Link href="/register">
        <a className="blue button">siGn uP</a>
      </Link>
    </div>
  </div>
);
export default Navbar;
