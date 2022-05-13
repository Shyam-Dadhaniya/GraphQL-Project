import React, { useState } from "react";
import "./Missions.css";
import Button from "react-bootstrap/Button";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
const GET_USER = gql`
  {
    launches {
      mission_name
      id
    }
  }
`;
const Missions = () => {
  const { data, loading } = useQuery(GET_USER);
  const [search, setSearch] = useState("");
  const changeHandler = (e) => {
    setSearch(e.target.value);
  };
  return (
    <>
      <h1 className={"h1"}>All Mission</h1>
      {data && (
        <div className="input-group center">
          <div className="form-outline d-flex">
            <input
              type="search"
              id="form1"
              className="form-control"
              onChange={changeHandler}
            />
          <button type="button" className="btn btn-primary">
            <BsSearch />
          </button>
          </div>
          <Link to="/mutation" className="ml-3">
            <button className="btn btn-primary ">Mutation</button>
          </Link>
        </div>
      )}

      <Data data={data} loading={loading} search={search} />
    </>
  );
};

export default Missions;

function Data({ loading, data, search }) {
  if (loading) {
    return <h1>Loading.....</h1>;
  }
  return (
    <>
      {data.launches
        .filter((mission) => {
          return mission.mission_name
            .toLowerCase()
            .includes(search.toLowerCase());
        })
        .map((mission) => {
          return (
            <Link key={Math.random().toString()} to={`/${mission.id}`}>
              <Button className="btn btn-secondary m-3">
                {mission.mission_name} {mission.id}
              </Button>
            </Link>
          );
        })}
    </>
  );
}
