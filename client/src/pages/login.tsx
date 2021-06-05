import { FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import InputGroup from "../components/InputGroup";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  const submitform = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post("/auth/login", {
        username,
        password,
      });
      router.push("/users");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };
  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/sideimage.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6 ">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <form onSubmit={submitform}>
            <InputGroup
              className="mb-2"
              type="text"
              placeholder="Username"
              value={username}
              error={errors.username}
              setValue={setUsername}
            />
            <InputGroup
              className="mb-4"
              type="password"
              placeholder="Password"
              value={password}
              error={errors.password}
              setValue={setPassword}
            />

            <button className="w-full py-2 mb-2 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Login
            </button>
          </form>
          <small>
            Don't have an account?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Register</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
