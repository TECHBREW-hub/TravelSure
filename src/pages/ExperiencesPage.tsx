import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  MapPin,
  Star,
  Clock,
  Users,
  Camera,
  Heart,
  Mountain,
  Waves,
} from "lucide-react";
import { useData } from "../hooks/useData";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { AuthModal } from "../components/AuthModal";
import { PaymentModal } from "../components/PaymentModal";

interface Experience {
  id: string;
  title: string;
  location: string;
  city: string;
  category: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  highlights: string[];
  includes: string[];
  difficulty: "Easy" | "Moderate" | "Challenging";
  groupSize: string;
}

const experiences: Experience[] = [
  {
    id: "1",
    title: "Paragliding Adventure in Manali",
    location: "Solang Valley",
    city: "Manali",
    category: "Adventure",
    duration: "4 hours",
    price: 3999,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1719949122509-74d0a1d08b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhZ2xpZGluZyUyMGFkdmVudHVyZSUyMHNwb3J0cyUyMGluZGlhfGVufDF8fHx8MTc1ODAxODUzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Soar high above the stunning Himalayan valleys with professional instructors",
    highlights: [
      "Certified Instructors",
      "Safety Equipment",
      "Scenic Views",
      "HD Video Recording",
    ],
    includes: [
      "Equipment",
      "Training",
      "Certificate",
      "Refreshments",
    ],
    difficulty: "Moderate",
    groupSize: "Up to 8 people",
  },
  {
    id: "2",
    title: "Ayurvedic Spa & Wellness Retreat",
    location: "Kumarakom",
    city: "Kerala",
    category: "Wellness",
    duration: "6 hours",
    price: 5999,
    originalPrice: 7999,
    rating: 4.9,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1755781849220-8776d7a186c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkYSUyMHNwYSUyMG1hc3NhZ2UlMjBpbmRpYXxlbnwxfHx8fDE3NTgwMTg1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Rejuvenate your mind and body with traditional Ayurvedic treatments",
    highlights: [
      "Expert Therapists",
      "Organic Oils",
      "Peaceful Setting",
      "Personalized Treatment",
    ],
    includes: [
      "Full Body Massage",
      "Herbal Steam",
      "Healthy Lunch",
      "Consultation",
    ],
    difficulty: "Easy",
    groupSize: "Individual sessions",
  },
];

const categoryIcons = {
  Adventure: Mountain,
  Wellness: Heart,
  Cultural: Camera,
  Food: Users,
  Nature: Waves,
};

export function ExperiencesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [isViewMoreClicked, setIsViewMoreClicked] = useState(false);
  
  const { experiences: contextExperiences, searchItems } = useData();
  const { createBooking, state } = useApp();
  const { isAuthenticated } = useAuth();

  // Use global search state if available
  useEffect(() => {
    if (state.searchQuery) {
      setSearchTerm(state.searchQuery);
    }
  }, [state.searchQuery]);

  const handleBookNow = async (experience: any) => {
    if (!isAuthenticated) {
      setSelectedExperience(experience);
      setShowAuthModal(true);
      return;
    }

    setSelectedExperience(experience);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentMethod: string, paymentDetails: any) => {
    if (!selectedExperience) return;

    try {
      const bookingId = await createBooking({
        type: 'experience',
        itemId: selectedExperience.id,
        status: 'confirmed',
        travelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        guests: 2,
        totalAmount: selectedExperience.price,
        paymentStatus: 'paid',
        item: selectedExperience,
      }, paymentMethod, paymentDetails);
      
      toast.success('Experience booked successfully!');
      setSelectedExperience(null);
      setShowPaymentModal(false);
    } catch (error) {
      toast.error('Failed to book experience. Please try again.');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedExperience) {
      setShowPaymentModal(true);
    }
  };

  const cities = [
    "Manali",
    "Rishikesh",
    "Goa",
    "Kerala",
    "Udaipur",
    "Agra",
    "Jaisalmer",
  ];

  // Combine mock experiences with context experiences
  const allExperiences = [...experiences, ...contextExperiences.map(exp => ({
    ...exp,
    title: exp.name,
    city: exp.location.split(',')[0] || exp.location,
    difficulty: 'Moderate' as const,
    groupSize: '2-8 people',
    includes: exp.highlights || []
  }))];

  // Get search results from global search or use all experiences if no search term
  const searchResults = searchTerm 
    ? searchItems(searchTerm, 'experiences') 
    : allExperiences;
  
  const filteredExperiences = searchResults.filter((exp) => {
    const matchesCity =
      !selectedCity ||
      selectedCity === "all-cities" ||
      exp.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCategory =
      selectedCategory === "all" ||
      exp.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      exp.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "budget" && exp.price < 3000) ||
      (priceRange === "mid" &&
        exp.price >= 3000 &&
        exp.price < 6000) ||
      (priceRange === "premium" && exp.price >= 6000);

    return (
      matchesCity &&
      matchesCategory &&
      matchesDifficulty &&
      matchesPrice
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="mb-6">Unique Experiences</h1>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Input
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
            />

            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-cities">
                  All Cities
                </SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Categories
                </SelectItem>
                <SelectItem value="adventure">
                  Adventure
                </SelectItem>
                <SelectItem value="wellness">
                  Wellness
                </SelectItem>
                <SelectItem value="cultural">
                  Cultural
                </SelectItem>
                <SelectItem value="food">
                  Food & Dining
                </SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Level</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">
                  Moderate
                </SelectItem>
                <SelectItem value="challenging">
                  Challenging
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priceRange}
              onValueChange={setPriceRange}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="budget">
                  Under ₹3,000
                </SelectItem>
                <SelectItem value="mid">
                  ₹3,000 - ₹6,000
                </SelectItem>
                <SelectItem value="premium">
                  Above ₹6,000
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            {filteredExperiences.length} experience
            {filteredExperiences.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.slice(0, visibleItems).map((exp) => {
            const CategoryIcon =
              categoryIcons[
                exp.category as keyof typeof categoryIcons
              ] || Mountain;

            return (
              <Card
                key={exp.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-purple-600 text-white flex items-center gap-1">
                    <CategoryIcon className="w-3 h-3" />
                    {exp.category}
                  </Badge>
                  {exp.originalPrice && (
                    <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                      Save ₹{exp.originalPrice - exp.price}
                    </Badge>
                  )}
                  <Badge
                    className={`absolute bottom-3 left-3 ${
                      exp.difficulty === "Easy"
                        ? "bg-green-600"
                        : exp.difficulty === "Moderate"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    } text-white`}
                  >
                    {exp.difficulty}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {exp.location}, {exp.city}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {exp.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({exp.reviews})
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-2">{exp.title}</h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {exp.description}
                  </p>

                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exp.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {exp.groupSize}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-xs text-gray-500">
                        Highlights:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.highlights
                          .slice(0, 3)
                          .map((highlight, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {highlight}
                            </Badge>
                          ))}
                        {exp.highlights.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            +{exp.highlights.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500">
                        Includes:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.includes
                          .slice(0, 2)
                          .map((include, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {include}
                            </Badge>
                          ))}
                        {exp.includes.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            +{exp.includes.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-medium">
                        ₹{exp.price.toLocaleString()}
                      </span>
                      {exp.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{exp.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleBookNow(exp)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No experiences found matching your criteria.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
        
        {filteredExperiences.length > visibleItems && (
          <div className="text-center mt-8">
            <Button 
              onClick={() => {
                setVisibleItems(prev => prev + 6);
                setIsViewMoreClicked(true);
              }}
              className="bg-purple-600 hover:bg-purple-700"
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
          setSelectedExperience(null);
        }}
        onSuccess={handleAuthSuccess}
      />
      
      {selectedExperience && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedExperience(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
          amount={selectedExperience.price}
          bookingDetails={{
            itemName: selectedExperience.title || selectedExperience.name,
            itemType: 'experience',
            duration: selectedExperience.duration,
            guests: 2
          }}
        />
      )}
    </div>
  );
}