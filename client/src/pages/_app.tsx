import "../styles/tailwind.css";
import { AppProps } from "next/app";
import axios from "axios";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";
import { Fragment } from "react";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authroutes = ["/register", "/login"];
  const isonauthroutes = authroutes.includes(pathname);

  return (
    <Fragment>
      {!isonauthroutes && <Navbar />}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default App;
