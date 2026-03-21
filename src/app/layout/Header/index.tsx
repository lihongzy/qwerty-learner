import { NavLink } from "react-router";
import logo from "@/assets/logo.svg";

type HeaderProps = {
  children?: React.ReactNode;
};

export const Header = ({ children }: HeaderProps) => {
  return (
    <header className="container mx-auto z-20 w-full px-10 py-6">
      <div className="flex w-full flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
        <NavLink
          className="flex items-center text-2xl font-bold text-indigo-500 "
          to="https://github.com/lihongzy/qwerty-learner"
        >
          <img src={logo} className="mr-3 h-16 w-16" alt="Qwerty Leaner Logo" />
          <h1>Qwerty Learner</h1>
        </NavLink>
        <nav className="my-card on element flex w-auto content-center items-center justify-end space-x-3 rounded-xl bg-white p-4 transition-colors duration-300 ">
          {children}
        </nav>
      </div>
    </header>
  );
};
