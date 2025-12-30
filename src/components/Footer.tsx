import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Company Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              HealthLink
            </h3>
          </div>
          <div className="flex space-x-4">
            <Facebook className="w-5 h-5 hover:text-blue-200 cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-blue-200 cursor-pointer" />
            <Linkedin className="w-5 h-5 hover:text-blue-200 cursor-pointer" />
            <Youtube className="w-5 h-5 hover:text-blue-200 cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
