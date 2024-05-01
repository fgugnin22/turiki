import { Match, Participant, Team } from "../helpers/transformMatches";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";

type TournamentResultTeamProps = {
  team: Team;
  tournamentId: number;
};

const serverURL = import.meta.env.VITE_API_URL;

const TournamentResultTeam: React.FC<TournamentResultTeamProps> = (props) => {
  const { data: tournament } = tournamentAPI.useGetTournamentByIdQuery({
    id: props.tournamentId
  });

  const { data: team } = tournamentAPI.useGetTeamByIdQuery(props.team.id);

  const bestMatch = JSON.parse(JSON.stringify(tournament?.matches))
    .sort((a: Match, b: Match) => b.id - a.id)
    .find(
      (m: Match) =>
        m.participants.findIndex((p: Participant) => p.team.id === team?.id) !==
        -1
    );

  const placement =
    Number(bestMatch?.name) +
    (bestMatch?.participants.find((p: Participant) => p.team.id === team?.id)
      ?.result_text === "LOST"
      ? 1
      : 0);

  const placementStr =
    placement < 3
      ? `${placement}`
      : `${placement}-${2 ** Number(bestMatch?.name)}`;

  return (
    <div className="px-4 h-20 flex items-center border-b border-b-lightblue last-of-type:border-none lg:text-xl font-medium">
      <p className="flex items-center w-14 justify-between">
        {placementStr}
        {placement < 3 && (
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            className={
              placement === 1 ? "stroke-turquoise" : "stroke-lightblue"
            }
          >
            <path
              d="M12.0002 16C6.24021 16 5.21983 10.2595 5.03907 5.70647C4.98879 4.43998 4.96365 3.80673 5.43937 3.22083C5.91508 2.63494 6.48445 2.53887 7.62318 2.34674C8.74724 2.15709 10.2166 2 12.0002 2C13.7837 2 15.2531 2.15709 16.3771 2.34674C17.5159 2.53887 18.0852 2.63494 18.5609 3.22083C19.0367 3.80673 19.0115 4.43998 18.9612 5.70647C18.7805 10.2595 17.7601 16 12.0002 16Z"
              strokeWidth="1.5"
            />
            <path
              d="M19 5L19.9486 5.31621C20.9387 5.64623 21.4337 5.81124 21.7168 6.20408C22 6.59692 22 7.11873 21.9999 8.16234L21.9999 8.23487C21.9999 9.09561 21.9999 9.52598 21.7927 9.87809C21.5855 10.2302 21.2093 10.4392 20.4569 10.8572L17.5 12.5"
              strokeWidth="1.5"
            />
            <path
              d="M4.99994 5L4.05132 5.31621C3.06126 5.64623 2.56623 5.81124 2.2831 6.20408C1.99996 6.59692 1.99997 7.11873 2 8.16234L2 8.23487C2.00003 9.09561 2.00004 9.52598 2.20723 9.87809C2.41441 10.2302 2.79063 10.4392 3.54305 10.8572L6.49994 12.5"
              strokeWidth="1.5"
            />
            <path d="M12 17V19" strokeWidth="1.5" strokeLinecap="round" />
            <path
              d="M15.5 22H8.5L8.83922 20.3039C8.93271 19.8365 9.34312 19.5 9.8198 19.5H14.1802C14.6569 19.5 15.0673 19.8365 15.1608 20.3039L15.5 22Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M18 22H6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </p>
      <img
        className=" object-cover w-10 lg:h-14 h-10 lg:w-14 rounded-full ml-6 lg:ml-12 mr-4"
        src={`${serverURL}/${props.team.image}`}
      />
      <p>{props.team.name}</p>
    </div>
  );
};

export default TournamentResultTeam;
