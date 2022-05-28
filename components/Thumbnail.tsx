/**@format */

import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "../atoms/modalAtom";
import { Movie } from "../typing";

interface Props {
  movie: Movie | DocumentData;
  title: string;
}

const Thumbnail = ({ movie, title }: Props) => {
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
  const [showModal, setShowModal] = useRecoilState(modalState);

  return (
    <div
      className={`relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105`}
      onClick={() => {
        setCurrentMovie(movie);
        setShowModal(true);
      }}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path
        }`}
        className="rounded-sm object-cover md:rounded"
        layout="fill"
        alt=""
      />
      {title && title === "Recommended" && (
        <div
          className="absolute bottom-0 right-0 
          px-1 py-1 rounded text-white bg-[#158e15] text-lg"
        >
          {`${movie?.vote_average * 10}%`}
        </div>
      )}
    </div>
  );
};

export default Thumbnail;
