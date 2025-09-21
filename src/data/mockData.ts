import { Destination, Package, Hotel, Experience } from '../contexts/AppContext';

export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Goa',
    state: 'Goa',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    rating: 4.5,
    reviewCount: 2543,
    startingPrice: 8999,
    description: 'Famous for its beaches, nightlife, and Portuguese heritage',
    highlights: ['Beaches', 'Nightlife', 'Water Sports', 'Heritage Sites']
  },
  {
    id: '2',
    name: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 1876,
    startingPrice: 12999,
    description: 'Hill station known for adventure sports and scenic beauty',
    highlights: ['Adventure Sports', 'Snow', 'Trekking', 'Mountain Views']
  },
  {
    id: '3',
    name: 'Kerala',
    state: 'Kerala',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 3214,
    startingPrice: 15999,
    description: 'God\'s Own Country with backwaters, beaches, and hill stations',
    highlights: ['Backwaters', 'Ayurveda', 'Spices', 'Beaches']
  },
  {
    id: '4',
    name: 'Rajasthan',
    state: 'Rajasthan',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 4321,
    startingPrice: 18999,
    description: 'Land of Kings with majestic palaces and desert landscapes',
    highlights: ['Palaces', 'Desert Safari', 'Culture', 'Heritage']
  }
];

export const mockPackages: Package[] = [
  {
    id: '1',
    destinationId: '1',
    name: 'Goa Beach Paradise',
    duration: '4D/3N',
    price: 8999,
    originalPrice: 12999,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    rating: 4.5,
    reviewCount: 234,
    includes: ['Hotel', 'Breakfast', 'Airport Transfer', 'Sightseeing'],
    description: 'Experience the best of Goa with pristine beaches and vibrant nightlife',
    itinerary: ['Day 1: Arrival & Beach Time', 'Day 2: North Goa Tour', 'Day 3: South Goa Exploration', 'Day 4: Departure']
  },
  {
    id: '2',
    destinationId: '2',
    name: 'Manali Adventure',
    duration: '6D/5N',
    price: 12999,
    originalPrice: 16999,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 189,
    includes: ['Hotel', 'All Meals', 'Adventure Activities', 'Transport'],
    description: 'Thrilling adventure package with trekking, paragliding, and river rafting',
    itinerary: ['Day 1: Arrival', 'Day 2: Solang Valley', 'Day 3: Rohtang Pass', 'Day 4: Adventure Sports', 'Day 5: Local Sightseeing', 'Day 6: Departure']
  },
  {
    id: '3',
    destinationId: '3',
    name: 'Kerala Backwaters',
    duration: '5D/4N',
    price: 15999,
    originalPrice: 19999,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 312,
    includes: ['Houseboat', 'All Meals', 'Ayurveda Spa', 'Transfers'],
    description: 'Serene backwater experience with houseboat stay and Ayurveda treatments',
    itinerary: ['Day 1: Cochin Arrival', 'Day 2: Munnar Hill Station', 'Day 3: Thekkady Wildlife', 'Day 4: Alleppey Houseboat', 'Day 5: Departure']
  },
  {
    id: '4',
    destinationId: '4',
    name: 'Royal Rajasthan',
    duration: '7D/6N',
    price: 18999,
    originalPrice: 24999,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 456,
    includes: ['Heritage Hotels', 'All Meals', 'Desert Safari', 'Cultural Shows'],
    description: 'Royal treatment with palace stays and desert adventures',
    itinerary: ['Day 1: Jaipur Arrival', 'Day 2: Jaipur Sightseeing', 'Day 3: Jodhpur', 'Day 4: Jaisalmer', 'Day 5: Desert Safari', 'Day 6: Udaipur', 'Day 7: Departure']
  }
];

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Taj Exotica Resort & Spa, Goa',
    location: 'Benaulim, Goa',
    price: 15999,
    originalPrice: 19999,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 1234,
    amenities: ['Beach Access', 'Spa', 'Pool', 'Wi-Fi', 'Restaurant'],
    description: 'Luxury beach resort with world-class amenities and stunning ocean views'
  },
  {
    id: '2',
    name: 'The Oberoi, Udaipur',
    location: 'Udaipur, Rajasthan',
    price: 22999,
    originalPrice: 27999,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 987,
    amenities: ['Lake View', 'Spa', 'Fine Dining', 'Butler Service', 'Pool'],
    description: 'Premium lake-facing hotel offering royal Rajasthani hospitality'
  },
  {
    id: '3',
    name: 'Kumarakom Lake Resort',
    location: 'Kumarakom, Kerala',
    price: 18999,
    originalPrice: 23999,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 765,
    amenities: ['Backwater View', 'Ayurveda Spa', 'Traditional Cuisine', 'Boat Rides'],
    description: 'Luxury backwater resort offering authentic Kerala experience'
  },
  {
    id: '4',
    name: 'Snow Peak Retreat, Manali',
    location: 'Old Manali, Himachal Pradesh',
    price: 8999,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop',
    rating: 4.4,
    reviewCount: 543,
    amenities: ['Mountain View', 'Fireplace', 'Adventure Desk', 'Organic Food'],
    description: 'Cozy mountain retreat perfect for adventure enthusiasts'
  }
];

export const mockExperiences: Experience[] = [
  {
    id: '1',
    name: 'Sunset Dolphin Cruise',
    location: 'Goa',
    duration: '3 hours',
    price: 1499,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 324,
    category: 'Water Sports',
    description: 'Magical sunset cruise with dolphin spotting in Arabian Sea',
    highlights: ['Dolphin Spotting', 'Sunset Views', 'Refreshments', 'Photography']
  },
  {
    id: '2',
    name: 'Paragliding Adventure',
    location: 'Manali',
    duration: '2 hours',
    price: 2999,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 198,
    category: 'Adventure',
    description: 'Soar above the Himalayas with professional paragliding instructors',
    highlights: ['Mountain Views', 'Professional Instructor', 'Safety Gear', 'Certificate']
  },
  {
    id: '3',
    name: 'Ayurveda Spa Therapy',
    location: 'Kerala',
    duration: '4 hours',
    price: 3999,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 267,
    category: 'Wellness',
    description: 'Authentic Ayurveda treatments by certified therapists',
    highlights: ['Herbal Oils', 'Traditional Massage', 'Consultation', 'Relaxation']
  },
  {
    id: '4',
    name: 'Desert Safari with Cultural Show',
    location: 'Jaisalmer, Rajasthan',
    duration: '6 hours',
    price: 2499,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 432,
    category: 'Culture',
    description: 'Camel safari in Thar Desert with traditional Rajasthani dinner and folk dance',
    highlights: ['Camel Ride', 'Desert Sunset', 'Folk Dance', 'Traditional Dinner']
  }
];