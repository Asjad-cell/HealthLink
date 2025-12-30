import { Heart, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Dr. Ethan Hayes",
    role: "Chief of Cardiology",
    image: "/images/doc1.jpg",
  },
  {
    name: "Dr. Olivia Chen",
    role: "Head of Surgery",
    image: "/images/doc4.webp",
  },
  {
    name: "Dr. Maya Singh",
    role: "Director of Pediatrics",
    image: "/images/doc5.jpg",
  },
  {
    name: "Dr. Benjamin Carter",
    role: "Lead Neurologist",
    image: "/images/doc2.jpg",
  },
  {
    name: "Nurse Emily White",
    role: "Head Nurse",
    image: "/images/doc6.webp",
  },
  {
    name: "Dr. Omar Hassan",
    role: "Radiology Specialist",
    image: "/images/doc3.webp",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/about.jpg')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to HealthLink: Your
              <br />
              Partner in Health
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              At MediManage Hospital, we are dedicated to providing
              compassionate, comprehensive, and advanced healthcare services to
              our community. Our commitment is to your well-being, fostering a
              healthier future for everyone we serve.
            </p>
            <Link to={"/services"}>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-200">
                Explore Our Services
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute hidden md:block top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute hidden md:block bottom-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
      </section>

      {/* Core Beliefs Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Our Core Beliefs
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Mission */}
            <div className="text-left shadow-xl rounded-xl p-4 py-4 md:py-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To deliver exceptional, patient-centered healthcare with
                integrity and empathy, utilizing innovative medical practices
                and state-of-the-art technology. We strive to improve the health
                and quality of life for all individuals and families in our
                care.
              </p>
            </div>

            {/* Vision */}
            <div className="text-left shadow-xl rounded-xl p-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be recognized as a leading healthcare institution, renowned
                for clinical excellence, groundbreaking research, and a deeply
                human approach to medicine. We aspire to set new standards in
                patient care and community health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Our Values
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Compassion */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Compassion
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Treating every patient with kindness, respect, and
                understanding, recognizing their unique needs and concerns.
              </p>
            </div>

            {/* Integrity */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Integrity
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upholding the highest ethical standards, ensuring transparency,
                honesty, and accountability in all our actions.
              </p>
            </div>

            {/* Excellence */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Excellence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Committing to superior clinical outcomes, continuous
                improvement, and the pursuit of innovation in healthcare
                delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Meet Our Dedicated Team
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                  <img src={member.image} className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose MediManage?
          </h2>

          <div className="bg-white p-8 rounded-lg space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Experienced Professionals:
              </h3>
              <p className="text-gray-600">
                Our team comprises highly qualified and compassionate medical
                experts dedicated to your health.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Cutting-Edge Technology:
              </h3>
              <p className="text-gray-600">
                We invest in the latest medical equipment and technologies to
                ensure accurate diagnostics and effective treatments.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Holistic Patient Care:
              </h3>
              <p className="text-gray-600">
                We believe in treating the whole person, focusing on physical,
                emotional, and mental well-being.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Community-Focused:
              </h3>
              <p className="text-gray-600">
                As an integral part of the community, we are committed to public
                health initiatives and accessible care for all.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Comfortable Environment:
              </h3>
              <p className="text-gray-600">
                Our facilities are designed to provide a welcoming and soothing
                atmosphere for patients and their families.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
