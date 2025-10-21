import { Card } from "../Types/Card";
import { formatBoldText } from "../utils/formatText";

interface CardListProps {
	localCards: Card[];
	setLocalCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

export default function CardList({ localCards, setLocalCards }: CardListProps) {
	const deleteCard = (id: number) => {
		setLocalCards((prev) => prev.filter((card) => card.id !== id));
	};
	return (
		<div>
			<h2>My Cards</h2>
			{localCards.length === 0 && <p>No cards available. Create some!</p>}
			<div className="cardList">
				{localCards.map((card) => (
					<div key={card.id} className="card">
						<div className="card1">
							<strong
								style={{ paddingBottom: "10px" }}
								dangerouslySetInnerHTML={{
									__html: formatBoldText(card.front),
								}}
							></strong>
							<p
								dangerouslySetInnerHTML={{
									__html: formatBoldText(card.back),
								}}
							/>
						</div>
						<div className="actionBtns">
							<button
								onClick={() => alert(`Edit card ${card.id}`)}
								className="editBtn"
							>
								Edit
							</button>
							<button
								onClick={() => deleteCard(card.id)}
								className="deleteBtn"
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
