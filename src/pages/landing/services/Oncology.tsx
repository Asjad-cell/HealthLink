

const Oncology = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Oncology</h1>
      <p className="text-lg text-gray-700 mb-4">
        Our Oncology department provides comprehensive cancer care, from
        diagnosis to treatment and recovery. We use advanced therapies and a
        multidisciplinary approach.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Common Conditions We Treat</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Breast Cancer</li>
        <li>Lung Cancer</li>
        <li>Leukemia and Blood Cancers</li>
        <li>Prostate Cancer</li>
        <li>Colorectal Cancer</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Treatment Approach</h2>
      <p className="text-gray-700">
        We offer chemotherapy, radiation therapy, immunotherapy, and surgical
        oncology. Our experts also provide emotional and nutritional support
        throughout the treatment journey.
      </p>
    </div>
  );
};

export default Oncology;
