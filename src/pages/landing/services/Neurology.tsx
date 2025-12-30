
const Neurology = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Neurology</h1>
      <p className="text-lg text-gray-700 mb-4">
        The Neurology department specializes in disorders of the brain, spine,
        and nervous system. Our neurologists provide expert care for both
        acute and chronic neurological conditions.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Common Conditions We Treat</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Stroke</li>
        <li>Epilepsy</li>
        <li>Migraines and Chronic Headaches</li>
        <li>Parkinson’s Disease</li>
        <li>Multiple Sclerosis (MS)</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Treatment Approach</h2>
      <p className="text-gray-700">
        From advanced neuroimaging to cutting-edge therapies, we offer
        comprehensive diagnostic and treatment options. Our specialists provide
        rehabilitation, medications, and surgical care as needed.
      </p>
    </div>
  );
};

export default Neurology;
