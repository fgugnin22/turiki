import { useState } from "react";
import { Layout } from "../processes/Layout";
import { tournamentAPI } from "../shared/rtk/tournamentAPI";
import TriangleLoader from "../shared/TriangleLoader";
import NotificationElem from "../features/NotificationElem";

const testbans = {
  bans: {
    id: 77,
    time_to_select_map: "00:00:59",
    previous_team: 3,
    timestamps: [
      "2024-01-09T21:34:21+03:00",
      "2024-01-09T21:35:21.258862+03:00",
      "2024-01-09T21:35:41.292808+03:00",
      "2024-01-09T21:35:47.566915+03:00",
      "2024-01-09T21:35:49.924893+03:00",
      "2024-01-09T21:35:51.243580+03:00",
      "2024-01-09T21:35:52.132660+03:00",
      "2024-01-09T21:35:53.118837+03:00",
      "2024-01-09T21:35:54.266852+03:00"
    ],
    ban_log: [
      "AUTO",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN",
      "CAPTAIN"
    ],
    maps: [
      "CLUBHOUSE1",
      "CLUBHOUSE2",
      "CLUBHOUSE3",
      "CLUBHOUSE4",
      "CLUBHOUSE5",
      "CLUBHOUSE6",
      "CLUBHOUSE7",
      "CLUBHOUSE8",
      "CLUBHOUSE9"
    ]
  }
};
let a: any = {};
const Test = () => {
  const match = tournamentAPI.useGetMatchByIdQuery({ id: 104 });
  const team1 = tournamentAPI.useGetTeamByIdQuery(38);
  const [, xd] = useState(false);
  return (
    <Layout>
      <div
        className="w-64 h-96 relative after:absolute after:opacity-[0.15] after:top-0 after:bottom-0 after:left-0 after:right-0 
            neonshadow mx-auto my-auto mb-24 rounded-[10px] after:rounded-[10px] 
            border border-turquoise after:bg-gradient-to-b after:from-transparent 
          after:to-darkturquoise "
      ></div>
      <div
        className="w-64 h-96 rounded-[10px] mx-auto my-auto relative after:absolute 
            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[2px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
            before:z-10 z-20 before:bg-dark before:rounded-[8px]"
      ></div>
      <div
        className="w-64 h-96 rounded-[10px] mx-auto my-auto relative after:absolute 
            before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[2px] after:bg-gradient-to-r
          after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
            before:z-10 z-20 before:bg-dark before:rounded-[8px] 
            before:bg-gradient-to-b before:from-transparent before:to-darkturquoise before:to-[350%]"
      ></div>
      <p
        data-content="Турниры"
        className="before:text-lg before:top-0 before:bottom-0 before:left-0 before:right-0  w-full text-center text-lg before:w-full font-medium  before:text-center before:bg-gradient-to-l 
              before:from-turquoise before:bg-clip-text before:to-lightblue text-transparent
                before:absolute relative before:content-[attr(data-content)]"
      >
        Турниры
      </p>
      <div className="my-24 ">
        <div
          className="rounded-[10px] w-[830px] mx-auto relative after:absolute 
              before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] after:bg-gradient-to-r
            after:from-lightblue after:to-turquoise after:rounded-[10px] after:z-0 
              before:z-10 z-20 before:bg-dark before:rounded-[9px] flex flex-wrap justify-left gap-y-8 gap-x-[60px] px-16 py-12"
        ></div>
      </div>
      <div className=" flex items-center justify-center my-24">
        <TriangleLoader></TriangleLoader>
      </div>
      <NotificationElem
        data={{
          id: 1,
          user_id: 2,
          kind: "match",
          content: {
            match: {
              match_id: 23,
              state: "SOON"
            }
          },
          is_read: false
        }}
      />
    </Layout>
  );
};

export default Test;
