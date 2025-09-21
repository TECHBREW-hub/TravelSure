import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { mockDestinations, mockPackages, mockHotels, mockExperiences } from '../data/mockData';

export function useData() {
  const { state, dispatch, searchItems } = useApp();

  // Load mock data on mount
  useEffect(() => {
    dispatch({ type: 'SET_DESTINATIONS', payload: mockDestinations });
    dispatch({ type: 'SET_PACKAGES', payload: mockPackages });
    dispatch({ type: 'SET_HOTELS', payload: mockHotels });
    dispatch({ type: 'SET_EXPERIENCES', payload: mockExperiences });
  }, [dispatch]);

  return {
    destinations: state.destinations,
    packages: state.packages,
    hotels: state.hotels,
    experiences: state.experiences,
    isLoading: state.isLoading,
    searchItems,
  };
}