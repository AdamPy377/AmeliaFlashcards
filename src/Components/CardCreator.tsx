import { useState } from "react";
import { Card } from "../Types/Card";

interface CardCreatorProps {
	setLocalCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

export default function CardCreator({ setLocalCards }: CardCreatorProps) {
	const [front, setFront] = useState("");
	const [back, setBack] = useState("");
	const [explanation, setExplanation] = useState("");

	const addCard = () => {
		if (!front || !back) return;
		const newCard: Card = { id: Date.now(), front, back, explanation };
		setLocalCards((prev) => [...prev, newCard]);
		setFront("");
		setBack("");
		setExplanation("");
	};

	return (
		<div>
			<h2>Create a Card!</h2>
			<div className="inputContainer">
				<input
					placeholder="Front"
					value={front}
					onChange={(e) => setFront(e.target.value)}
					className="frontInput"
					autoFocus
				/>
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
				<button onClick={addCard}>Save</button>
			</div>
		</div>
	);
}
