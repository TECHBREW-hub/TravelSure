import { Plane, Hotel, Car, Camera, Shield, Headphones } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const services = [
  {
    icon: Plane,
    title: "Flight Booking",
    description: "Book domestic and international flights at best prices",
    color: "text-blue-500"
  },
  {
    icon: Hotel,
    title: "Hotel Reservations", 
    description: "Find and book hotels, resorts, and homestays nationwide",
    color: "text-green-500"
  },
  {
    icon: Car,
    title: "Transportation",
    description: "Cab bookings, bus tickets, and car rentals available",
    color: "text-purple-500"
  },
  {
    icon: Camera,
    title: "Guided Tours",
    description: "Professional tour guides and photography services",
    color: "text-orange-500"
  },
  {
    icon: Shield,
    title: "Travel Insurance",
    description: "Comprehensive travel insurance for peace of mind",
    color: "text-red-500"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your needs",
    color: "text-teal-500"
  }
];

export function ServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Travel Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for your perfect trip, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-gray-50">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4`}>
                    <IconComponent className={`w-8 h-8 ${service.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}