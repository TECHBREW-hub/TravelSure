import { Star, MapPin, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

const destinations = [
  {
    id: 1,
    name: "Kerala Backwaters",
    location: "Kerala, India",
    image: "https://images.unsplash.com/photo-1655266331940-a815d3777da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxrZXJhbGElMjBiYWNrd2F0ZXJzJTIwdG91cmlzbXxlbnwxfHx8fDE3NTgwMTIwODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    duration: "5 Days",
    price: "₹15,999",
    description: "Experience the serene beauty of Kerala's backwaters with luxury houseboat stays",
    category: "Nature",
    travelers: "152 travelers"
  },
  {
    id: 2,
    name: "Royal Rajasthan",
    location: "Rajasthan, India",
    image: "https://images.unsplash.com/photo-1670931260394-0d26da7850db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyYWphc3RoYW4lMjBwYWxhY2UlMjB0b3VyaXNtfGVufDF8fHx8MTc1ODAxMjA4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    duration: "7 Days",
    price: "₹24,999",
    description: "Explore magnificent palaces, forts, and desert landscapes of royal Rajasthan",
    category: "Heritage",
    travelers: "298 travelers"
  },
  {
    id: 3,
    name: "Goa Beach Paradise",
    location: "Goa, India",
    image: "https://images.unsplash.com/photo-1685850600718-280a7a1291c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHRvdXJpc20lMjBkZXN0aW5hdGlvbnN8ZW58MXx8fHwxNzU4MDEyMDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    duration: "4 Days",
    price: "₹12,999",
    description: "Relax on pristine beaches, enjoy water sports, and experience vibrant nightlife",
    category: "Beach",
    travelers: "419 travelers"
  }
];

export function FeaturedDestinations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover India's most breathtaking destinations with our carefully curated travel packages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <ImageWithFallback
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-white text-gray-800">
                  {destination.category}
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{destination.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {destination.location}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {destination.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {destination.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {destination.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {destination.travelers}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-red-500">
                      {destination.price}
                    </span>
                    <span className="text-gray-500"> /person</span>
                  </div>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
}