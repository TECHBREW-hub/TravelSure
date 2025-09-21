import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { MapPin, Star, Wifi, Car, Coffee, Utensils, Dumbbell, Waves, CalendarDays, Users } from 'lucide-react';
import { format } from '../utils/date';
import { useData } from '../hooks/useData';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { AuthModal } from '../components/AuthModal';
import { PaymentModal } from '../components/PaymentModal';

interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  category: string;
  starRating: number;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  description: string;
  features: string[];
}

const hotels: Hotel[] = [
  {
    id: '1',
    name: 'The Grand Palace Hotel',
    location: 'Connaught Place',
    city: 'New Delhi',
    category: 'Luxury',
    starRating: 5,
    rating: 4.8,
    reviews: 1234,
    price: 8999,
    originalPrice: 12999,
    image: 'https://images.unsplash.com/photo-1544367945-4125eb396314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW5kaWF8ZW58MXx8fHwxNzU4MDE4NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['wifi', 'pool', 'gym', 'restaurant', 'parking', 'spa'],
    description: 'Luxury hotel in the heart of Delhi with world-class amenities',
    features: ['Free WiFi', 'Swimming Pool', 'Fitness Center', '24/7 Room Service']
  },
  {
    id: '2',
    name: 'Heritage Haveli',
    location: 'City Palace Area',
    city: 'Udaipur',
    category: 'Heritage',
    starRating: 4,
    rating: 4.9,
    reviews: 567,
    price: 6499,
    originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1669040186487-ad7a6d6d0004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJpdGFnZSUyMGhvdGVsJTIwcmFqYXN0aGFuJTIwcm9vbXxlbnwxfHx8fDE3NTgwMTg0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['wifi', 'restaurant', 'cultural', 'parking'],
    description: 'Traditional Rajasthani architecture with modern comfort',
    features: ['Heritage Property', 'Cultural Shows', 'Rooftop Dining', 'Lake View']
  }
];

const amenityIcons = {
  wifi: Wifi,
  pool: Waves,
  gym: Dumbbell,
  restaurant: Utensils,
  parking: Car,
  spa: Coffee,
  cultural: Coffee
};

export function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState('2');
  const [priceRange, setPriceRange] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [isViewMoreClicked, setIsViewMoreClicked] = useState(false);
  
  const { hotels: contextHotels, searchItems } = useData();
  const { createBooking, state } = useApp();
  const { isAuthenticated } = useAuth();

  // Use global search state if available
  useEffect(() => {
    if (state.searchQuery) {
      setSearchTerm(state.searchQuery);
    }
  }, [state.searchQuery]);
  
  // Combine mock hotels with context hotels
  const allHotels = [...hotels, ...contextHotels.map((hotel, index) => ({
    ...hotel,
    id: hotel.id || `context-hotel-${index}`,
    city: hotel.location.split(',')[0] || hotel.location,
    amenities: hotel.features || [],
    features: hotel.features || [],
    // Ensure each hotel has a unique ID to prevent duplicate keys
    _uniqueId: `hotel-${index}-${Date.now()}`
  }))];
  
  // Get search results from global search or use all hotels if no search term
  const hotelSearchResults = searchTerm 
    ? searchItems(searchTerm, 'hotels') 
    : allHotels;

  const cities = ['New Delhi', 'Mumbai', 'Goa', 'Udaipur', 'Jaipur', 'Kerala', 'Agra'];
  
  // Filter hotels based on search criteria
  const filteredHotels = hotelSearchResults.filter((hotel) => {
    const matchesCity = 
      !selectedCity || 
      selectedCity === 'all-cities' || 
      hotel.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCategory = 
      selectedCategory === 'all' || 
      hotel.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPrice =
      priceRange === 'all' ||
      (priceRange === 'budget' && hotel.price < 5000) ||
      (priceRange === 'mid' && hotel.price >= 5000 && hotel.price < 10000) ||
      (priceRange === 'luxury' && hotel.price >= 10000);
      
    return matchesCity && matchesCategory && matchesPrice;
  });

  // Combine mock hotels with context hotels for demonstration
  // This is a duplicate declaration of allHotels, removing it

  const handleBookNow = async (hotel: any) => {
    if (!isAuthenticated) {
      setSelectedHotel(hotel);
      setShowAuthModal(true);
      return;
    }

    setSelectedHotel(hotel);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentMethod: string, paymentDetails: any) => {
    if (!selectedHotel) return;

    try {
      const bookingId = await createBooking({
        type: 'hotel',
        itemId: selectedHotel.id,
        status: 'confirmed',
        travelDate: checkIn ? checkIn.toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        guests: parseInt(guests),
        totalAmount: selectedHotel.price,
        paymentStatus: 'paid',
        item: selectedHotel,
      }, paymentMethod, paymentDetails);
      
      toast.success('Hotel booked successfully!');
      setSelectedHotel(null);
      setShowPaymentModal(false);
    } catch (error) {
      toast.error('Failed to book hotel. Please try again.');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedHotel) {
      setShowPaymentModal(true);
    }
  };

  // We already have filteredHotels defined above, so removing this duplicate declaration

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="mb-6">Hotels & Accommodation</h1>
          
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="lg:col-span-2">
              <label className="block text-sm mb-2">Destination</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-cities">All Cities</SelectItem>
                  {cities.map((city, index) => (
                    <SelectItem key={`city-${index}-${city}`} value={city.toLowerCase()}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Check-in</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-white"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "MMM dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Check-out</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left bg-white"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "MMM dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Guests</label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4 Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="self-end bg-red-600 hover:bg-red-700 text-white">
              Search Hotels
            </Button>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Input
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Hotel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="heritage">Heritage</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="resort">Resort</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="budget">Under ₹5,000</SelectItem>
                <SelectItem value="mid">₹5,000 - ₹10,000</SelectItem>
                <SelectItem value="luxury">Above ₹10,000</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{filteredHotels.length} hotels found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {filteredHotels.slice(0, visibleItems).map((hotel, index) => (
            <Card key={hotel._uniqueId || `hotel-card-${hotel.id}-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="relative">
                  <ImageWithFallback
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                    {hotel.category}
                  </Badge>
                  {hotel.originalPrice && (
                    <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                      {Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                
                <div className="md:col-span-2 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl">{hotel.name}</h3>
                        <div className="flex">
                          {[...Array(hotel.starRating || 0)].map((_, i) => (
                            <Star key={`${hotel.id}-star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.location}, {hotel.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-green-500 text-green-500" />
                          <span className="font-medium">{hotel.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({hotel.reviews} reviews)</span>
                        <Badge variant="secondary" className="ml-2">Excellent</Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-medium">₹{hotel.price.toLocaleString()}</span>
                        {hotel.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{hotel.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">per night</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{hotel.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Amenities:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {hotel.amenities && hotel.amenities.map((amenity, index) => {
                          const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || Coffee;
                          return (
                            <div key={`${hotel.id}-amenity-${index}`} className="flex items-center gap-1 text-sm text-gray-600">
                              <Icon className="w-4 h-4" />
                              <span className="capitalize">{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hotel.features && hotel.features.map((feature, index) => (
                          <Badge key={`${hotel.id}-feature-${index}`} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Up to {guests} guests</span>
                      </div>
                      <span>Free cancellation</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline">View Details</Button>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleBookNow(hotel)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hotels found matching your criteria.</p>
          </div>
        )}
        
        {filteredHotels.length > visibleItems && (
          <div className="text-center mt-8">
            <Button 
              onClick={() => {
                setVisibleItems(prev => prev + 6);
                setIsViewMoreClicked(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View More
            </Button>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          setSelectedHotel(null);
        }}
        onSuccess={handleAuthSuccess}
      />
      
      {selectedHotel && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedHotel(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
          amount={selectedHotel.price}
          bookingDetails={{
            itemName: selectedHotel.name,
            itemType: 'hotel',
            guests: parseInt(guests)
          }}
        />
      )}
    </div>
  );
}