import { Link } from "react-router-dom";

function FundraiserCard(props) {
  const { fundraiserData } = props;
  // Use an absolute path so the Link always resolves to /fundraiser/:id
  const fundraiserLink = `/fundraiser/${fundraiserData.id}`;
  //  const test = undefined;
  return (
    <div>
      <Link to={fundraiserLink}>
        <img src={fundraiserData.image} />
        <h3>{fundraiserData.title}</h3>
      </Link>
    </div>
  );
}

export default FundraiserCard;
