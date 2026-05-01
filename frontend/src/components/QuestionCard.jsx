const QuestionCard = ({ question, onAnswer }) => {
  if (!question) return null;
  const options = JSON.parse(question.options);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      <div className="space-y-3">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(opt)}
            className="w-full text-left p-3 border rounded hover:bg-gray-100 transition"
          >
            {String.fromCharCode(65+idx)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;