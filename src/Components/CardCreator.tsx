import { useState } from "react";
import { Card } from "../Types/Card";

interface CardCreatorProps {
	setLocalCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

export default function CardCreator({ setLocalCards }: CardCreatorProps) {
	const [front, setFront] = useState("");
	const [back, setBack] = useState("");
	const [explanation, setExplanation] = useState("");
	const [frontImage, setFrontImage] = useState<string | undefined>();

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

	const addCard = () => {
		if (!(front || frontImage) || !back) return;
		const newCard: Card = {
			id: Date.now(),
			front,
			frontImage,
			back,
			explanation,
		};
		setLocalCards((prev) => [...prev, newCard]);
		setFront("");
		setBack("");
		setFrontImage(undefined);
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
				<div className="imageUpload">
					<div>
						<label
							style={{
								fontSize: "14px",
								opacity: 0.6,
								marginRight: "10px",
							}}
						>
							Front Image:
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) =>
								handleImageUpload(e, setFrontImage)
							}
						/>
					</div>
					{frontImage && (
						<img src={frontImage} alt="Front Preview" width={40} />
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
				<button onClick={addCard}>Save</button>
			</div>
		</div>
	);
}
