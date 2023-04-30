import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { API_KEY } from "../config";
import { toast } from "react-toastify";
import { UserContext } from "../utils/userContext";
import NavBar from "../components/layout/NavBar";
import Card from "../components/layout/Card";
import $ from "jquery";
import { FaStar } from "react-icons/fa";

const Details = () => {
  const id = useParams().id;
  const type = useParams().type;
  const [user, setUser] = useContext(UserContext);
  const [rating, setRating] = useState("1");
  const [rate, setRate] = useState();
  const watchList = user?.watchList;
  const ratedList = user?.ratedList;
  const [data, setData] = useState();
  const [similar, setSimilar] = useState();
  const [similarRec, setSimilarRec] = useState([]);
  const [lolrec, setLolrec] = useState();

  const starRate = (val) => {
    $(".star").removeClass("text-warning");
    for (var i = 0; i < val; i++) {
      $(".star").eq(i).addClass("text-warning");
      setRating(val);
    }
  };

  function checkRated(movieId) {
    for (var i = 0; i < ratedList?.length; i++) {
      if (ratedList[i]?.movie.id === parseInt(movieId)) {
        setRate(ratedList[i]?.rating);
        return ratedList[i]?.rating;
      }
    }
    return false;
  }

  useEffect(() => {
    const movieRoute = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
    const tvRoute = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`;
    axios
      .get(type === "movie" || type === "movies" ? movieRoute : tvRoute)
      .then(function (result) {
        setData(result.data);
      });
  }, [id]);

  useEffect(() => {
    checkRated(id);
  });

  const watchLater = (movie) => {
    axios
      .put(`/api/v1/add-to-watch-list`, { movie, type: type })
      .then(function (result) {
        if (result.data.success) {
          toast.success(result.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          axios.get("/api/v1/me").then(function (result) {
            setUser(result.data.user);
          });
        } else {
          toast.error(result.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  };

  const rateMovie = (movie) => {
    axios
      .put(`/api/v1/rate`, { movie, rating, type: type })
      .then(function (result) {
        if (result.data.success) {
          toast.success(result.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          axios.get("/api/v1/me").then(function (result) {
            setUser(result.data.user);
          });
        } else {
          toast.error(result.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  };
  const removeRating = (movie) => {
    axios.put(`/api/v1/remove-rating`, { movie }).then(function (result) {
      if (result.data.success) {
        toast.success(result.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        axios.get("/api/v1/me").then(function (result) {
          setUser(result.data.user);
          setRate();
        });
      } else {
        toast.error(result.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  const remove = (movieId) => {
    axios
      .put(`/api/v1/remove-from-watch-list/${movieId}`)
      .then(function (result) {
        if (result.data.success) {
          toast.success(result.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          axios.get("/api/v1/me").then(function (result) {
            setUser(result.data.user);
          });
        } else {
          toast.error(result.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  };

  function checkMovie(movieId) {
    for (var i = 0; i < watchList?.length; i++) {
      if (watchList[i].id === movieId) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/similar/${id}`).then(function (result) {
      var AIdata = result.data;
      console.log(result.data);

      // If data from AI in not generated
      if (result.data.length === 0) {
        console.log("here");
        const movieRoute = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`;
        const tvRoute = `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}`;

        axios
          .get(type === "movie" || type === "movies" ? movieRoute : tvRoute)
          .then(function (result) {
            setSimilar(result.data.results);
          });
      } else {
        //GEtting data from AI
        const movieRoute = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
        const tvRoute = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`;

        for (var i = 0; i < AIdata.length; i++) {
          axios
            .get(
              type === "movie" || type === "movies"
                ? `https://api.themoviedb.org/3/movie/${AIdata[i]}?api_key=${API_KEY}`
                : `https://api.themoviedb.org/3/tv/${AIdata[i]}?api_key=${API_KEY}`
            )
            .then(function (result) {
              console.log(result.data);
              setSimilarRec((list) => [...list, result.data]);
            });
        }
      }
    });
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSimilarRec([]);
  }, [id]);

  return (
    <>
      <NavBar></NavBar>
      <div className="container-fluid p-0">
        <div
          className="d-flex align-items-center backdrop-div"
          style={{
            height: "80vh",
            backgroundImage: `url('http://image.tmdb.org/t/p/w1280/${data?.backdrop_path}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="">
            <div className="container desc-info d-flex text-light py-5 px-4 mx-auto col-10">
              <img
                className="img img-thumbnail"
                src={`http://image.tmdb.org/t/p/w342/${data?.poster_path}`}
                alt="poster"
              />
              <div className="text-light">
                <div className="d-flex align-items-center">
                  {data == null ? (
                    <button className="btn btn-sm btn-primary text-light fw-bold mx-2">
                      <div
                        className="spinner-border text-secondary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </button>
                  ) : (
                    <>
                      {checkMovie(data?.id) ? (
                        <>
                          <button
                            onClick={remove.bind(this, data?.id)}
                            className="shadow btn btn-sm btn-danger text-light mx-2"
                          >
                            <small>Remove</small>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={watchLater.bind(this, data)}
                            className="shadow btn btn-sm btn-primary text-light fw-bold mx-2"
                          >
                            <small>Watch Later</small>
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {data?.ratedList !== null ? (
                    <>
                      {rate !== undefined ? (
                        <>
                          <p className="my-1">Your Rating: {rate}⭐</p>
                          <button
                            onClick={removeRating.bind(this, data)}
                            type="button"
                            className="btn btn-sm btn-danger me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#rateCard"
                          >
                            Remove Rating
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="ms-5">
                            <div>
                              <span
                                className="mx-1 star"
                                onClick={starRate.bind(this, 1)}
                              >
                                <FaStar />
                              </span>
                              <span
                                className="mx-1 star"
                                onClick={starRate.bind(this, 2)}
                              >
                                <FaStar />
                              </span>
                              <span
                                className="mx-1 star"
                                onClick={starRate.bind(this, 3)}
                              >
                                <FaStar />
                              </span>
                              <span
                                className="mx-1 star"
                                onClick={starRate.bind(this, 4)}
                              >
                                <FaStar />
                              </span>
                              <span
                                className="mx-1 star"
                                onClick={starRate.bind(this, 5)}
                              >
                                <FaStar />
                              </span>
                            </div>
                          </div>
                          {/* <select onChange={(e) => { setRating(e.target.value) }} className="form-select form-select-sm ms-5 me-1" style={{ width: "12ch" }} aria-label="Default select example">
                                                                <option value="1">1 Star</option>
                                                                <option value="2">2 Stars</option>
                                                                <option value="3">3 Stars</option>
                                                                <option value="4">4 Stars</option>
                                                                <option value="5">5 Stars</option>
                                                            </select> */}

                          {data !== null ? (
                            <button
                              onClick={rateMovie.bind(this, data)}
                              type="button"
                              className="btn btn-sm btn-success"
                              data-bs-toggle="modal"
                              data-bs-target="#rateCard"
                            >
                              Rate Movie
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              data-bs-toggle="modal"
                              data-bs-target="#rateCard"
                            >
                              Loading...
                            </button>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p
                  style={{ fontSize: "2em" }}
                  className="m-0 fw-bold px-3 my-1"
                >
                  {data?.name}
                </p>
                <p
                  style={{ fontSize: "2em" }}
                  className="m-0 fw-bold px-3 my-1"
                >
                  {data?.title}
                </p>
                <p className="m-0 fw-bold px-3 my-1">{data?.release_date}</p>

                <div className="genres d-flex">
                  {data?.genres.map((val, index) => {
                    return (
                      <p key={index} className="m-0 fw-bold px-3 my-1">
                        {val?.name}
                      </p>
                    );
                  })}
                </div>
                <p className="m-0 fw-bold px-3 my-1">
                  Language: {data?.original_language.toUpperCase()}
                </p>
                <p className="m-0 px-3 my-1">
                  Duration: {data?.runtime} Minutes
                </p>
                <p className="m-0  px-3 my-1">Rating: {data?.vote_average}⭐</p>
                <p className="m-0 px-3 my-1">{data?.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5">
        <div className="container col-3 mb-4">
          <h2 className="text-center mt-4 fw-bold text-secondary">
            Similar {type == "movies" ? "Movies" : "Shows"}{" "}
            {similarRec.length > 0 ? "Generated form AI" : ""}
          </h2>
          <div
            className="mx-auto"
            style={{ height: "4px", width: "50%", backgroundColor: "#ff2a12" }}
          ></div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row container mx-auto col-10">
          {similarRec.length > 0
            ? similarRec.map((val, index) => {
                return (
                  <div key={index} className="col-md-3 my-3">
                    <div key={index + 1} className="mx-autobg-dark">
                      <Card
                        key={index + 2}
                        type={"movies"}
                        id={val.id}
                        name={val.name}
                        title={val.title}
                        overview={val.overview}
                        rating={val.vote_average}
                        img={`http://image.tmdb.org/t/p/w500/${val?.poster_path}`}
                      ></Card>
                    </div>
                  </div>
                );
              })
            : similar?.map((val, index) => {
                return (
                  <div key={index} className="col-md-3 my-3">
                    <div key={index + 1} className="mx-autobg-dark">
                      <Card
                        key={index + 1}
                        type={"movies"}
                        id={val.id}
                        name={val.name}
                        title={val.title}
                        overview={val.overview}
                        rating={val.vote_average}
                        img={`http://image.tmdb.org/t/p/w500/${val?.poster_path}`}
                      ></Card>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Details;
