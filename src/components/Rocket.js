import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_ROCKET = gql`
  query ($id: ID!) {
    rocket(id: $id) {
      company
      country
      id
      cost_per_launch
      boosters
      description
      diameter {
        meters
      }
      height {
        meters
      }
      mass {
        kg
      }
      name
      first_flight
      success_rate_pct
    }
  }
`;
const Rocket = () => {
  const { rocketId } = useParams();
  const { data, loading } = useQuery(GET_ROCKET, {
    variables: {
      id: rocketId,
    },
  });

  if (loading) {
    return <h1>Rocket Data Loading....</h1>;
  }
  return (
    <>
      {/* <h1>Rocket Details</h1>
      <div>
        <div>{data.rocket.name}</div>
        <div>Height: {data.rocket.height.meters}</div>
        <div>Diameter: {data.rocket.diameter.meters}</div>
        <div>Mass: {data.rocket.mass.kg}</div>
      </div>
      <div>
        <div>Success Rate: {data.rocket.success_rate_pct}</div>
        <div>Cost per Lunch: {data.rocket.cost_per_launch}</div>
        <div>First Flight: {data.rocket.first_flight}</div>
        <div>Booster: {data.rocket.boosters}</div>
      </div> */}
  <div class="card bg-light mb-3 mx-auto mt-3 rounded" style={{ width: "18rem" }}>
  <div class="card-header">{data.rocket.name}</div>
  <div class="card-body">
    <p class="card-text">Height: {data.rocket.height.meters}</p>
    <p class="card-text">Diameter: {data.rocket.diameter.meters}</p>
    <p class="card-text">Mass: {data.rocket.mass.kg}</p>
    <p class="card-text">Success Rate: {data.rocket.success_rate_pct}</p>
    <p class="card-text">Cost per Lunch: {data.rocket.cost_per_launch}</p>
    <p class="card-text">First Flight: {data.rocket.first_flight}</p>

    
</div>
  </div>


    </>
  );
};

export default Rocket;
