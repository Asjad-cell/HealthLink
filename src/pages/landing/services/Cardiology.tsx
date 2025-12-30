

const Cardiology = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Cardiology</h1>
      <p className="text-lg text-gray-700 mb-4">
        Our Cardiology department is dedicated to diagnosing, treating, and
        preventing heart and blood vessel diseases. We provide advanced cardiac
        care with state-of-the-art technology and highly experienced doctors.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Common Conditions We Treat</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Coronary Artery Disease (CAD)</li>
        <li>Heart Attack (Myocardial Infarction)</li>
        <li>Arrhythmias (Irregular Heartbeat)</li>
        <li>Heart Failure</li>
        <li>Hypertension (High Blood Pressure)</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Treatment Approach</h2>
      <p className="text-gray-700">
        Our experts use a combination of lifestyle counseling, medications,
        minimally invasive procedures, and advanced surgeries. We ensure
        personalized treatment plans tailored to each patient’s needs.
      </p>
    </div>
  );
};

export default Cardiology;
