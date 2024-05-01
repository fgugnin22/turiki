import { Link } from "react-router-dom";
import { INotification } from "../helpers/transformMatches";
import { ROUTES } from "../shared/RouteTypes";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";

type NotificationProps = {
  data: INotification;
};

const NotificationElem = (props: NotificationProps) => {
  const [readNotification] = tournamentAPI.useReadNotificationMutation();

  const handleRead = () => readNotification(props.data.id);

  return (
    <Link
      to={ROUTES.MATCHES.MATCH_BY_ID.buildPath({
        id: props.data.content.match.match_id
      })}
      onClick={handleRead}
      className=" w-[95%] mx-auto lg:mx-0 lg:w-[400px] h-24 bg-turquoise bg-opacity-30 hover:bg-opacity-50 transition duration-100 rounded-[5px] flex px-[28px] items-center gap-4 lg:gap-8 relative"
    >
      <div className="rounded-[5px] absolute top-0 bottom-0 right-0 left-0 bg-turquoise bg-opacity-30 hover:bg-opacity-50 z-10"></div>
      <div className="rounded-[5px] absolute top-0 bottom-0 right-0 left-0 bg-dark"></div>
      <svg
        className="z-10 w-10 h-10 relative"
        width="41"
        height="40"
        viewBox="0 0 41 40"
        fill="none"
      >
        <path
          d="M40.2273 20C40.2273 30.7611 31.3426 39.5 20.3636 39.5C9.38472 39.5 0.5 30.7611 0.5 20C0.5 9.2389 9.38472 0.5 20.3636 0.5C31.3426 0.5 40.2273 9.2389 40.2273 20Z"
          stroke="url(#paint0_linear_709_1760)"
        />
        <g filter="url(#filter0_f_709_1760)">
          <path
            d="M21.92 24.48H18.656L17.792 16V9.6H22.752V16L21.92 24.48ZM23.008 29.696C23.008 30.4427 22.7413 31.0827 22.208 31.616C21.6747 32.1493 21.0347 32.416 20.288 32.416C19.5413 32.416 18.9013 32.1493 18.368 31.616C17.8347 31.0827 17.568 30.4427 17.568 29.696C17.568 28.9493 17.8347 28.3093 18.368 27.776C18.9013 27.2427 19.5413 26.976 20.288 26.976C21.0347 26.976 21.6747 27.2427 22.208 27.776C22.7413 28.3093 23.008 28.9493 23.008 29.696Z"
            fill="url(#paint1_linear_709_1760)"
          />
        </g>
        <path
          d="M22.4 24H18.56L17.6 16V9.6H23.36V16L22.4 24ZM23.52 29.408C23.52 30.24 23.2213 30.9547 22.624 31.552C22.0267 32.1493 21.312 32.448 20.48 32.448C19.648 32.448 18.9333 32.1493 18.336 31.552C17.7387 30.9547 17.44 30.24 17.44 29.408C17.44 28.576 17.7387 27.8613 18.336 27.264C18.9333 26.6667 19.648 26.368 20.48 26.368C21.312 26.368 22.0267 26.6667 22.624 27.264C23.2213 27.8613 23.52 28.576 23.52 29.408Z"
          fill="url(#paint2_linear_709_1760)"
        />
        <defs>
          <filter
            id="filter0_f_709_1760"
            x="13.568"
            y="5.6"
            width="13.44"
            height="30.816"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="2"
              result="effect1_foregroundBlur_709_1760"
            />
          </filter>
          <linearGradient
            id="paint0_linear_709_1760"
            x1="42.5241"
            y1="-1.79104"
            x2="0.134295"
            y2="40.1358"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0208333" stopColor="#21DBD3" />
            <stop offset="1" stopColor="#18A3DC" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_709_1760"
            x1="5"
            y1="36"
            x2="42"
            y2="3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#21DBD3" />
            <stop offset="1" stopColor="#18A3DC" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_709_1760"
            x1="5"
            y1="36"
            x2="42"
            y2="3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#21DBD3" />
            <stop offset="1" stopColor="#18A3DC" />
          </linearGradient>
        </defs>
      </svg>
      <p className="z-10 lg:text-lg font-semibold bg-gradient-to-r from-turquoise bg-clip-text to-lightblue text-transparent">
        {props.data.content?.match?.state === "SOON" && "Матч скоро начнётся!"}
        {props.data.content?.match?.state === "STARTED" && "Матч начался!"}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleRead();
        }}
        className="z-10 absolute right-2 top-2 p-2 rounded-lg hover:bg-turquoise hover:bg-opacity-20 transition duration-100"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.9034 0.470649L7.25887 5.11522L2.87233 0.728679C2.31326 0.169612 1.38018 0.196272 0.788225 0.788225C0.196272 1.38018 0.169613 2.31326 0.728679 2.87233L5.11522 7.25887L0.470647 11.9034C-0.121305 12.4954 -0.147964 13.4285 0.411103 13.9876C0.970169 14.5466 1.90325 14.52 2.49521 13.928L7.13978 9.28343L11.5263 13.67C12.0854 14.229 13.0185 14.2024 13.6104 13.6104C14.2024 13.0185 14.229 12.0854 13.67 11.5263L9.28343 7.13978L13.928 2.49521C14.52 1.90326 14.5466 0.970169 13.9876 0.411103C13.4285 -0.147964 12.4954 -0.121303 11.9034 0.470649Z"
            fill="url(#paint0_linear_709_1758)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_709_1758"
              x1="7.99327"
              y1="-20.5887"
              x2="9.57856"
              y2="34.8967"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#21DBD3" />
              <stop offset="1" stopColor="#18A3DC" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </Link>
  );
};

export default NotificationElem;
