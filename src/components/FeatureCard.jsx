function FeatureCard({ title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
      <h2 className="text-xl font-bold text-blue-600">
        {title}
      </h2>

      <p className="text-gray-600 mt-3">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;