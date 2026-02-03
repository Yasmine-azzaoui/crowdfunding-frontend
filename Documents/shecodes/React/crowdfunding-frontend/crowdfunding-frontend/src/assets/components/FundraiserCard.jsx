import { Link } from "react-router-dom";

function fundraiserCard(props) {
    const { fundraiserData } = props;
    const fundraiserLink = `fundraiser/${fundraiserData.id}`;

    return (
        <div>

        <Link to={fundraiserLink}>
            <img src={fundraiserData.image} />
            <h3>{fundraiserData.title}</h3>
            </Link>
        </div>
    );
}

export default fundraiserCard;