export interface ErrorMsg {
  statusCode: number;
  message: string;
  type?: string;
}

export interface Rating {
  firstName: string;
  rating: string;
  comment?: string;
}

export interface SearchedDestination {
  destinationStart: { country: string; city: string };
  destinationEnd: { country: string; city: string };
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  idVerified?: boolean;
  password: string;
  ratings: Rating[];
  searchedDestinations: SearchedDestination[];
}
