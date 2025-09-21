import React, { useEffect } from 'react';
import { mockDestinations, mockPackages, mockHotels, mockExperiences } from '../data/mockData';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  image: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  description: string;
  highlights: string[];
}

export interface Package {
  id: string;
  destinationId: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  includes: string[];
  description: string;
  itinerary: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  description: string;
}

export interface Experience {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  highlights: string[];
}

export interface Booking {
  id: string;
  type: 'package' | 'hotel' | 'experience';
  itemId: string;
  userId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  travelDate: string;
  guests: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod?: string;
  paymentDetails?: any;
  item: Package | Hotel | Experience;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  destinations: Destination[];
  packages: Package[];
  hotels: Hotel[];
  experiences: Experience[];
  bookings: Booking[];
  searchQuery: string;
  selectedDestination: string;
  dateRange: { from: Date | null; to: Date | null };
  guests: number;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DESTINATIONS'; payload: Destination[] }
  | { type: 'SET_PACKAGES'; payload: Package[] }
  | { type: 'SET_HOTELS'; payload: Hotel[] }
  | { type: 'SET_EXPERIENCES'; payload: Experience[] }
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'UPDATE_BOOKING'; payload: { id: string; updates: Partial<Booking> } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_DESTINATION'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: { from: Date | null; to: Date | null } }
  | { type: 'SET_GUESTS'; payload: number }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  destinations: mockDestinations,
  packages: mockPackages,
  hotels: mockHotels,
  experiences: mockExperiences,
  bookings: [],
  searchQuery: '',
  selectedDestination: '',
  dateRange: { from: null, to: null },
  guests: 1,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_DESTINATIONS':
      return { ...state, destinations: action.payload };
    case 'SET_PACKAGES':
      return { ...state, packages: action.payload };
    case 'SET_HOTELS':
      return { ...state, hotels: action.payload };
    case 'SET_EXPERIENCES':
      return { ...state, experiences: action.payload };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id
            ? { ...booking, ...action.payload.updates }
            : booking
        ),
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_DESTINATION':
      return { ...state, selectedDestination: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_GUESTS':
      return { ...state, guests: action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, bookings: [] };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingDate' | 'userId'>, paymentMethod?: string, paymentDetails?: any) => Promise<string>;
  cancelBooking: (bookingId: string) => Promise<void>;
  searchItems: (query: string, type: 'packages' | 'hotels' | 'experiences') => any[];
}

const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  // Mock authentication functions
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    };
    
    dispatch({ type: 'LOGIN', payload: mockUser });
    localStorage.setItem('tourism_user', JSON.stringify(mockUser));
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    };
    
    dispatch({ type: 'LOGIN', payload: newUser });
    localStorage.setItem('tourism_user', JSON.stringify(newUser));
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('tourism_user');
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'bookingDate' | 'userId'>, paymentMethod?: string, paymentDetails?: any) => {
    if (!state.user) throw new Error('User not authenticated');
    
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      userId: state.user.id,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod,
      paymentDetails,
    };
    
    dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    
    return newBooking.id;
  };

  const cancelBooking = async (bookingId: string) => {
    dispatch({
      type: 'UPDATE_BOOKING',
      payload: {
        id: bookingId,
        updates: { status: 'cancelled' }
      }
    });
  };

  const searchItems = (query: string, type: 'packages' | 'hotels' | 'experiences') => {
    const items = state[type];
    if (!query) return items;
    
    const searchTerm = query.toLowerCase();
    return items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchTerm);
      
      // Handle location differently based on item type
      let locationMatch = false;
      if (type === 'packages') {
        // For packages, check destination
        const destination = state.destinations.find(dest => dest.id === item.destinationId);
        locationMatch = destination ? destination.name.toLowerCase().includes(searchTerm) : false;
      } else {
        // For hotels and experiences
        locationMatch = item.location?.toLowerCase().includes(searchTerm) || false;
      }
      
      const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
      
      return nameMatch || locationMatch || descriptionMatch;
    });
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tourism_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        localStorage.removeItem('tourism_user');
      }
    }
  }, []);

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    register,
    createBooking,
    cancelBooking,
    searchItems,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}