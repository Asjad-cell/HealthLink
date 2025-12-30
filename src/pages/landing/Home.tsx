import React from "react";
import {
  Calendar,
  Search,
  Stethoscope,
  FileText,
  Shield,
  Users,
  BarChart3,
  Clock,
  Award,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HealthLinkDMS: React.FC = () => {
  const stats = [
    { number: "50,000+", label: "Patients Managed" },
    { number: "500+", label: "Healthcare Providers" },
    { number: "99.9%", label: "System Uptime" },
    { number: "24/7", label: "Customer Support" },
  ];

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "HIPAA Compliant Security",
      description:
        "Enterprise-grade security with end-to-end encryption ensures patient data remains protected and compliant with healthcare regulations.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Advanced Analytics",
      description:
        "Gain insights into patient flow, revenue cycles, and operational efficiency with comprehensive reporting and analytics tools.",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "24/7 Accessibility",
      description:
        "Cloud-based platform accessible from anywhere, anytime. Never miss critical patient information or appointments.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Multi-Role Management",
      description:
        "Seamlessly manage different user roles including doctors, nurses, administrators, and reception staff with customized permissions.",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      position: "Chief Medical Officer, City General Hospital",
      quote:
        "HealthLink DMS has transformed our patient management process. We've seen a 40% reduction in administrative overhead and significantly improved patient satisfaction.",
    },
    {
      name: "Michael Chen",
      position: "Hospital Administrator, Metropolitan Health Center",
      quote:
        "The integrated billing system has streamlined our revenue cycle management. Our billing accuracy has improved by 95% since implementation.",
    },
    {
      name: "Dr. Emily Rodriguez",
      position: "Family Physician, Community Health Clinic",
      quote:
        "The doctor portal is intuitive and saves me hours each day. I can access patient records instantly and focus more on patient care.",
    },
  ];

  const navigate = useNavigate();

  const handleJoinUs = () => navigate("/signup");
  const ourServices = () => navigate("/services");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/heroImg.jpg')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Empowering Healthcare Operations
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              Streamline patient management, doctor scheduling, and billing with
              HealthLink DMS. Your comprehensive solution for efficient hospital
              administration.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute hidden md:block top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute hidden md:block bottom-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Key Features
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover the powerful tools that make HealthLink DMS the preferred
              choice for healthcare professionals worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Appointment Management */}
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition duration-300">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Appointment Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Effortlessly schedule, track, and manage patient appointments.
                Reduce wait times and improve patient flow.
              </p>
            </div>

            {/* Patient Records */}
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition duration-300">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Patient Records
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Securely store and access comprehensive patient histories,
                diagnoses, and treatment plans in one place.
              </p>
            </div>

            {/* Doctor Portal */}
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition duration-300">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Doctor Portal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Empower doctors with tools for patient interaction, record
                updates, and schedule management.
              </p>
            </div>

            {/* Integrated Billing */}
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition duration-300">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Integrated Billing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Simplify invoicing, payment processing, and financial reporting
                with automated billing solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose HealthLink DMS?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the advantages that set us apart in healthcare
              management solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Healthcare Professionals Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join thousands of satisfied healthcare providers who trust
              HealthLink DMS for their operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition duration-300"
              >
                <div className="mb-6">
                  <Award className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Operations?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join the growing community of healthcare providers who have
            streamlined their operations with HealthLink DMS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleJoinUs()}
              className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Join Us Today!
            </button>
            <button
              onClick={() => ourServices()}
              className="border-2 border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200"
            >
              Services We Provide
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 text-lg">
              Have questions? Our team is here to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600">support@healthlinkdms.com</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600">123 Healthcare Blvd, Medical City</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthLinkDMS;
