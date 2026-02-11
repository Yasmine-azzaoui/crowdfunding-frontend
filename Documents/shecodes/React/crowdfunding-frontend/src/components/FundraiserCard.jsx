import { Link } from "react-router-dom";

function FundraiserCard(props) {
  const { fundraiserData } = props;
  const fundraiserLink = `/fundraiser/${fundraiserData.id}`;

  return (
    <article
      className="fundraiser-card"
      aria-labelledby={`fund-${fundraiserData.id}-title`}
    >
      <Link to={fundraiserLink} className="fundraiser-link">
        {fundraiserData.image && (
          <img
            src={fundraiserData.image}
            alt={`${fundraiserData.title} cover`}
          />
        )}
        <h3 id={`fund-${fundraiserData.id}-title`}>{fundraiserData.title}</h3>
        <p className="fundraiser-summary">{fundraiserData.summary ?? ""}</p>
      </Link>
    </article>
  );
}

export default FundraiserCard;
