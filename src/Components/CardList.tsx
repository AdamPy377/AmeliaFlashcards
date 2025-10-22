import { Card } from "../Types/Card";
import { formatBoldText } from "../utils/formatText";

interface CardListProps {
	localCards: Card[];
	setLocalCards: React.Dispatch<React.SetStateAction<Card[]>>;
	deckName?: string;
	setCardToEdit?: React.Dispatch<React.SetStateAction<Card | null>>;
	setView: React.Dispatch<
		React.SetStateAction<"create" | "list" | "study" | "decks" | "edit">
	>;
}

export default function CardList({
	deckName,
	localCards,
	setLocalCards,
	setCardToEdit,
	setView,
}: CardListProps) {
	const deleteCard = (id: number) => {
		setLocalCards((prev) => prev.filter((card) => card.id !== id));
	};
	const editCard = (card: Card) => {
		setCardToEdit?.(card);
		setView("edit");
	};
	return (
		<div>
			<h2>{deckName ? deckName : "My Cards"}</h2>
			{localCards.length === 0 && <p>No cards available. Create some!</p>}
			<div className="cardList">
				{localCards.map((card) => (
					<div key={card.id} className="card">
						<div className="card1">
							{card.front && (
								<strong
									style={{ paddingBottom: "10px" }}
									dangerouslySetInnerHTML={{
										__html: formatBoldText(card.front),
									}}
								></strong>
							)}
							{card.frontImage && (
								<img
									src={card.frontImage}
									alt="Front Preview"
									height={40}
								/>
							)}
							<p
								dangerouslySetInnerHTML={{
									__html: formatBoldText(card.back),
								}}
							/>
						</div>
						<div className="actionBtns">
							<button
								onClick={() => {
									editCard(card);
								}}
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
