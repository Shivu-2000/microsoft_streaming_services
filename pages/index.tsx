/** @format */

import Head from "next/head";
import Header from "../components/Header";
import { useRecoilValue } from "recoil";
import { modalState, movieState } from "../atoms/modalAtom";
import Banner from "../components/Banner";
import requests from "../utils/requests";
import { Movie } from "../typing";
import Row from "../components/Row";
import useAuth from "../hooks/useAuth";
import useList from "../hooks/useList";
import Modal from "../components/Modal";
import useIntrestList from "../hooks/useIntrestList";

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
}: Props) => {
  const { user, loading } = useAuth();
  const showModal = useRecoilValue(modalState);
  const movie = useRecoilValue(movieState);

  const watchList = useList(user?.uid);
  const intrestList = useIntrestList(user?.uid);
  //console.log("user:::", user);
  //console.log("list:::", list);
  // console.log("movie:::", movie);

  const getRecommendedMovies = (list: any[]) => {
    const allGeneresFromList = list.map((item) => {
      return item?.genre_ids;
    });

    const getUniqueGeneresFromList = allGeneresFromList
      .flat()
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    const getRecommendedMovies = [
      ...netflixOriginals,
      ...actionMovies,
      ...comedyMovies,
      ...documentaries,
      ...horrorMovies,
      ...romanceMovies,
      ...topRated,
      ...trendingNow,
    ].filter((movie) => {
      // console.log("netflix movie?.genre_ids", movie?.genre_ids)
      const matched = movie?.genre_ids.filter(
        (id) => getUniqueGeneresFromList.includes(id) && id
      );
      // console.log("matched::::=>", matched)
      return matched.length > 0 && matched;
    });

    // console.log("getUniqueGeneresFromList", getUniqueGeneresFromList);
    const recmmendedMovies = getRecommendedMovies.filter(
      (item) => item?.vote_average > 8
    );
    const getUniqueRecommendMovies = [
      ...new Map(recmmendedMovies.map((item) => [item["id"], item])).values(),
    ]
      .sort((a, b) => b?.vote_average - a?.vote_average)
      .slice(0, 10);

    // console.log("getRecommendedMovies", [...new Map(recmmendedMovies.map(item => [item['id'], item])).values()].slice(0, 10));
    return (
      (getUniqueRecommendMovies.length > 0 && getUniqueRecommendMovies) || null
    );
  };

  if (loading) return null;

  return (
    <div className="relative h-screen bg-gradient-to-b lg:h-[140vh]">
      <Head>
        <title>
          {" "}
          {movie?.title || movie?.original_name || "Home"} - Newflicks
        </title>
        <meta name="description" content="Netflix clone Project" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>

      <Header />
      <main className="relative pl-4 pb-4 md:pt-12 lg:space-x-2 lg:pl-16 lg:pt-16">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <>
            {getRecommendedMovies([...intrestList, ...watchList]) && (
              <Row
                title="Recommended"
                movies={
                  getRecommendedMovies([...intrestList, ...watchList]) || []
                }
              />
            )}
            <Row title="Trending Now" movies={trendingNow} />
            <Row title="Top Rated" movies={topRated} />
            {/* My List Row */}
            {watchList.length > 0 && <Row title="My List" movies={watchList} />}

            <Row title="Action Thrillers" movies={actionMovies} />
            <Row title="Comedies" movies={comedyMovies} />
            <Row title="Scary Movies" movies={horrorMovies} />
            <Row title="Romance Movies" movies={romanceMovies} />
            <Row title="Documentaries" movies={documentaries} />
          </>
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
    },
  };
};
