const Footer = () => {
  return (
    // <!-- Footer container -->

    <footer className="bg-white mt-auto dark:bg-gray-800 w-full pt-8 pb-4">
      <div className="max-w-screen-xl px-4 mx-auto">
        <ul className="flex flex-wrap justify-between max-w-screen-md mx-auto text-lg font-light">
          <li className="my-2">
            <a
              className="text-gray-400 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
              href="#"
            >
              FAQ
            </a>
          </li>
          <li className="my-2">
            <p>Discord icon</p>
          </li>
        </ul>

        <div className="text-center text-gray-500 dark:text-gray-200 pt-10 sm:pt-12 font-light flex items-center justify-center">
          Created by avg_wannabe_it_guy
        </div>
      </div>
    </footer>
  );
};

export default Footer;
