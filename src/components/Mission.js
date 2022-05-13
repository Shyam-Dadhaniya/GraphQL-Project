import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import "./Mission.css";
const GET_MISSION = gql`
  query ($id: ID!) {
    launch(id: $id) {
      launch_success
      launch_year
      launch_site {
        site_name
        site_name_long
      }
      links {
        flickr_images
      }
      mission_name
      rocket {
        rocket {
          id
        }
        rocket_name
      }
      details
    }
  }
`;
const GET_DESCRIPTION = gql`
  query ($id: ID!) {
    launch(id: $id) {
      details
    }
  }
`;
const Mission = () => {
  const { missionId } = useParams();
  const { data, loading } = useQuery(GET_MISSION, {
    variables: {
      id: missionId,
    },
  });
  const [getDescription, { data: detailData, loading: detailLoading }] =
    useLazyQuery(GET_DESCRIPTION);
  // console.log(detailData); 
  if (loading) {
    return <h1>Loading....</h1>;
  }
 
  const clickHandler = () => {
    getDescription({
      variables: {
        id: missionId,
      },
    });
  };
  // console.log(data);
  return (
    <>
      <div className="card mx-auto mt-3 rounded" style={{ width: "18rem" }}>
        <h2>Mission Details</h2>
        <img
          src={data.launch.links.flickr_images[0]}
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">{data.launch.mission_name}</h5>
          <p className="card-text">Launch Year: {data.launch.launch_year}</p>
          <p className="card-text">
            Location: {data.launch.launch_site.site_name_long}
          </p>
          <Link
            to={`/rocket/${data.launch.rocket.rocket.id}`}
            className="btn btn-primary"
          >
            <div>See More</div>
          </Link>
          <button
            onClick={clickHandler}
            className="btn btn-primary"
            style={{ marginLeft: "3px" }}
          >
            Show Details
          </button>
          {detailLoading && <h4>Loading....</h4>}
          {detailData && !detailLoading && <p>{detailData.launch.details}</p>}
        </div>
      </div>
    </>
  );
};

export default Mission;
