import { useState } from "react";
import { Card } from "../Types/Card";
import { Deck } from "../Types/Deck";

interface EditCardProps {
	setView: React.Dispatch<
		React.SetStateAction<"create" | "list" | "study" | "decks" | "edit">
	>;
	Deck: Deck;
	cardToEdit: Card | null;
	setLocalDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
}

export function EditCard({
	setView,
	Deck,
	cardToEdit,
	setLocalDecks,
}: EditCardProps) {
	const [front, setFront] = useState(cardToEdit?.front || "");
	const [back, setBack] = useState(cardToEdit?.back || "");
	const [explanation, setExplanation] = useState(
		cardToEdit?.explanation || ""
	);
	const [frontImage, setFrontImage] = useState<string | undefined>(
		cardToEdit?.frontImage
	);

	const updateCard = () => {
		if (!cardToEdit) return;
		const localDecks = JSON.parse(
			localStorage.getItem("decks") || "[]"
		) as Deck[];

		const updatedDecks = localDecks.map((deck) => {
			if (deck.id !== Deck.id) return deck;

			const updatedCards = deck.cards.map((card) =>
				card.id === cardToEdit.id
					? { ...card, front, back, explanation, frontImage }
					: card
			);

			return { ...deck, cards: updatedCards };
		});
		// localStorage.setItem("decks", JSON.stringify(updatedDecks));
		setLocalDecks(updatedDecks);
		setView("list");
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const items = e.clipboardData.items;
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (!item) continue;
			if (item.type.startsWith("image/")) {
				const file = item.getAsFile();
				if (file) {
					const reader = new FileReader();
					reader.onload = (ev) => {
						const base64 = ev.target?.result as string;
						setFrontImage(base64);
					};
					reader.readAsDataURL(file);
				}
			}
		}
	};

	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		setImage: React.Dispatch<React.SetStateAction<string | undefined>>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => {
			setImage(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	return (
		<div>
			<h2>Edit Card</h2>
			{/* Add form elements to edit the card details */}
			{cardToEdit && (
				<div className="card1">
					<div className="inputContainer">
						<input
							placeholder="Front"
							value={front}
							onChange={(e) => setFront(e.target.value)}
							className="frontInput"
							autoFocus
							onPaste={handlePaste}
						/>
						<div className="imageUpload">
							<div>
								<label
									style={{
										fontSize: "14px",
										opacity: 0.6,
										marginRight: "10px",
										backgroundColor: "#f0f0f0",
									}}
								>
									Front Image:
									<input
										type="file"
										accept="image/*"
										onChange={(e) =>
											handleImageUpload(e, setFrontImage)
										}
										style={{ display: "none" }}
									/>
								</label>
							</div>
							{frontImage && (
								<img
									src={frontImage}
									alt="Front Preview"
									width={40}
								/>
							)}
						</div>
						<input
							placeholder="Back"
							value={back}
							onChange={(e) => setBack(e.target.value)}
							className="backInput"
						/>
						<input
							placeholder="Explanation (Optional)"
							value={explanation}
							onChange={(e) => setExplanation(e.target.value)}
							className="explanationInput"
						/>
						<button onClick={updateCard}>Save</button>
					</div>
				</div>
			)}
			{/* <button onClick={() => setView("list")}>Save</button> */}
		</div>
	);
}
