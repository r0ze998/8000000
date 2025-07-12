/**
 * Google Maps API dynamic loader
 * Loads the Google Maps JavaScript API dynamically
 */

interface GoogleMapsLoaderOptions {
  apiKey?: string;
  libraries?: string[];
  version?: string;
  region?: string;
  language?: string;
}

declare global {
  interface Window {
    google?: typeof google;
    initGoogleMaps?: () => void;
  }
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(options: GoogleMapsLoaderOptions = {}): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this.loadGoogleMaps(options);

    return this.loadPromise;
  }

  private async loadGoogleMaps(options: GoogleMapsLoaderOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        this.isLoading = false;
        resolve();
        return;
      }

      // Get API key from environment or options
      const apiKey = options.apiKey || process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
        console.warn('Google Maps API key not configured. Maps functionality will be limited.');
        // For development, we can continue without the API key
        this.isLoaded = true;
        this.isLoading = false;
        resolve();
        return;
      }

      // Default options
      const defaultOptions = {
        libraries: ['places', 'geometry'],
        version: 'weekly',
        region: 'JP',
        language: 'ja'
      };

      const finalOptions = { ...defaultOptions, ...options };

      // Create callback function
      const callbackName = 'initGoogleMaps';
      window[callbackName] = () => {
        this.isLoaded = true;
        this.isLoading = false;
        delete window[callbackName];
        resolve();
      };

      // Build the URL
      const url = new URL('https://maps.googleapis.com/maps/api/js');
      url.searchParams.set('key', apiKey);
      url.searchParams.set('callback', callbackName);
      url.searchParams.set('libraries', finalOptions.libraries.join(','));
      url.searchParams.set('v', finalOptions.version);
      url.searchParams.set('region', finalOptions.region);
      url.searchParams.set('language', finalOptions.language);

      // Create and append script tag
      const script = document.createElement('script');
      script.src = url.toString();
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        this.isLoading = false;
        delete window[callbackName];
        reject(new Error('Google Maps API failed to load'));
      };

      document.head.appendChild(script);
    });
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!window.google && !!window.google.maps;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();
export default googleMapsLoader;