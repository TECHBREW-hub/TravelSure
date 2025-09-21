import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CalendarDays, MapPin, Users, Star, Clock, Car } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { AuthModal } from '../components/AuthModal';
import { PaymentModal } from '../components/PaymentModal';

export function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  
  const { packages, searchItems } = useData();
  const { createBooking, state } = useApp();
  const { isAuthenticated } = useAuth();

  // Use global search state if available
  useEffect(() => {
    if (state.searchQuery) {
      setSearchTerm(state.searchQuery);
    }
  }, [state.searchQuery]);

  const handleBookNow = async (packageItem: any) => {
    if (!isAuthenticated) {
      setSelectedPackage(packageItem);
      setShowAuthModal(true);
      return;
    }

    setSelectedPackage(packageItem);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentMethod: string, paymentDetails: any) => {
    if (!selectedPackage) return;

    try {
      const bookingId = await createBooking({
        type: 'package',
        itemId: selectedPackage.id,
        status: 'confirmed',
        travelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        guests: 2,
        totalAmount: selectedPackage.price,
        paymentStatus: 'paid',
        item: selectedPackage,
      }, paymentMethod, paymentDetails);
      
      toast.success('Package booked successfully!');
      setSelectedPackage(null);
      setShowPaymentModal(false);
    } catch (error) {
      toast.error('Failed to book package. Please try again.');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedPackage) {
      setShowPaymentModal(true);
    }
  };

  // Get search results from global search
  const searchResults = searchItems(searchTerm, 'packages');
  
  const filteredPackages = searchResults.filter(pkg => {
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'beach' && pkg.name.toLowerCase().includes('beach')) ||
                           (selectedCategory === 'nature' && (pkg.name.toLowerCase().includes('nature') || pkg.name.toLowerCase().includes('hill'))) ||
                           (selectedCategory === 'adventure' && pkg.name.toLowerCase().includes('adventure')) ||
                           (selectedCategory === 'cultural' && (pkg.name.toLowerCase().includes('cultural') || pkg.name.toLowerCase().includes('heritage')));
    
    const matchesDuration = selectedDuration === 'all' || 
                           (selectedDuration === 'short' && (pkg.duration.includes('3') || pkg.duration.includes('4'))) ||
                           (selectedDuration === 'medium' && (pkg.duration.includes('5') || pkg.duration.includes('6'))) ||
                           (selectedDuration === 'long' && pkg.duration.includes('7'));
    
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'budget' && pkg.price < 15000) ||
                        (priceRange === 'mid' && pkg.price >= 15000 && pkg.price < 25000) ||
                        (priceRange === 'luxury' && pkg.price >= 25000);
    
    return matchesCategory && matchesDuration && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="mb-6">Travel Packages</h1>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Input
              placeholder="Search destinations or packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beach">Beach</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Duration</SelectItem>
                <SelectItem value="short">3-4 Days</SelectItem>
                <SelectItem value="medium">5-6 Days</SelectItem>
                <SelectItem value="long">7+ Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="budget">Under ₹15,000</SelectItem>
                <SelectItem value="mid">₹15,000 - ₹25,000</SelectItem>
                <SelectItem value="luxury">Above ₹25,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Package Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <div className="relative">
                <ImageWithFallback
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                  Package
                </Badge>
                {pkg.originalPrice && (
                  <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                    Save ₹{pkg.originalPrice - pkg.price}
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Multi-city</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{pkg.rating}</span>
                    <span className="text-xs text-gray-500">({pkg.reviewCount})</span>
                  </div>
                </div>
                
                <h3 className="mb-2">{pkg.name}</h3>
                
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    2 Adults
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-xs text-gray-500">Includes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pkg.includes.slice(0, 3).map((include, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {include}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">Itinerary:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pkg.itinerary.slice(0, 2).map((day, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {day.split(':')[0]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-medium">₹{pkg.price.toLocaleString()}</span>
                    {pkg.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{pkg.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleBookNow(pkg)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No packages found matching your criteria.</p>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          setSelectedPackage(null);
        }}
        onSuccess={handleAuthSuccess}
      />
      
      {selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPackage(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
          amount={selectedPackage.price}
          bookingDetails={{
            itemName: selectedPackage.name,
            itemType: 'package',
            duration: selectedPackage.duration,
            guests: 2
          }}
        />
      )}
    </div>
  );
}