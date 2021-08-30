import logo from "../../assets/logo.png";
function Header() {
  return (
    <nav className="w-auto bg-primary ">
      <header className=" xl:w-4/6 lg:w-2/3 xl:m-auto md:w-4/5 sm:w-full">
        <h1
          className="w-56 cursor-pointer flex items-center
         text-white  text-3xl  text-center
         border-transparent border-solid border-b-4
         duration-150 hover:text-secondary hover:border-white
      "
        >
          <img className="h-16 px-2" src={logo} alt="logo"></img>
          <a href="/">Mikroblog</a>
        </h1>
      </header>
    </nav>
  );
}

export default Header;
