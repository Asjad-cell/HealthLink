import { Heart, Brain, Bone, Baby, Syringe, Microscope } from "lucide-react";
import { Link } from "react-router-dom";
const services = [
  {
    icon: Heart,
    title: "Cardiology",
    description:
      "Comprehensive cardiac care, from diagnosis to advanced treatments, ensuring optimal heart health. Specializing in preventative care and chronic disease management.",
    buttonText: "Learn More",
    link: "/services/cardiology",
  },
  {
    icon: Brain,
    title: "Neurology",
    description:
      "Expert diagnosis and treatment for neurological disorders, including stroke, epilepsy, and migraines, focusing on patient recovery and well-being.",
    buttonText: "Learn More",
    link: "/services/Neurology",
  },
  {
    icon: Bone,
    title: "Orthopedics",
    description:
      "Specialized care for musculoskeletal conditions, including joint replacement, sports injuries, and spinal disorders, promoting mobility and pain relief.",
    buttonText: "Learn More",
    link: "/services/Orthopedics",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description:
      "Dedicated healthcare services for infants, children, and adolescents, covering growth, development, and common childhood illnesses. Creating a comforting environment for young patients.",
    buttonText: "Learn More",
    link: "/services/Pediatrics",
  },
  {
    icon: Syringe,
    title: "Oncology",
    description:
      "Holistic cancer care, offering chemotherapy, radiation, and surgical options, supported by compassionate counseling and personalized treatment services.",
    buttonText: "Learn More",
    link: "/services/Oncology",
  },
  {
    icon: Microscope,
    title: "Diagnostics",
    description:
      "Advanced imaging and laboratory services, including MRI, CT scans, and pathology, providing accurate and timely results for effective treatment planning.",
    buttonText: "Learn More",
    link: "/services/Diagnostics",
  },
];

const Services = () => {
  return (
    <>
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden md:min-h-[30rem]">
        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-cover bg-center flex items-center justify-center md:min-h-[30rem]"
          style={{ backgroundImage: "url('/images/services.jpg')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Comprehensive Services
            </h1>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute hidden md:block top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute hidden md:block bottom-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
      </section>

      {/* Services Grid Section */}
      <section className="pb-20 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="text-center py-2 flex flex-col justify-between items-center"
                >
                  <div>
                    {/* Icon */}
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-10 h-10 text-blue-600" />
                    </div>
                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      {service.title}
                    </h2>
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6 max-w-sm mx-auto">
                      {service.description}
                    </p>
                  </div>

                  {/* Learn More Button */}
                  <Link
                    to={service.link}
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 w-fit"
                  >
                    {service.buttonText}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
