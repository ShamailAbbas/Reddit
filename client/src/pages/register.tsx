import { FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import InputGroup from "../components/InputGroup";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  const submitform = async (event: FormEvent) => {
    event.preventDefault();
    if (!agreement) {
      setErrors({ ...errors, agreement: "You must agree to T&Cs" });
      return;
    }
    try {
      const res = await axios.post("/auth/register", {
        email,
        username,
        password,
      });
      router.push("/login");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };
  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/sideimage.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign up</h1>
          <p className="mb-10 text-xs">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <form onSubmit={submitform}>
            <div className="mb-6">
              <input
                type="checkbox"
                id="agreement"
                className="mr-1 cursor-pointer"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                Lorem ipsum. Quidem quod voluptate .
              </label>
              <p className="text-red-500">{errors.agreement}</p>
            </div>
            <InputGroup
              className="mb-2"
              type="email"
              placeholder="Email"
              value={email}
              error={errors.email}
              setValue={setEmail}
            />
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
              Sign up
            </button>
          </form>
          <small>
            Already a readitor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">log in</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
