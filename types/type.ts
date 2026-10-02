import { Types } from "mongoose";

export interface ErrorMsg {
  statusCode: number;
  message: string;
  type?: string;
}

export interface Rating {
  reviewer: Types.ObjectId;
  firstName: string;
  rating: number;
  comment?: string;
}

export interface Destination {
  destinationStart: { country: string; city: string };
  destinationEnd: { country: string; city: string };
}

export interface User {
  _id: any;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  idVerified?: boolean;
  password: string;
  ratings: Rating[];
  ratingAverage: number;
  searchedDestinations: Destination[];
}

export interface Service {
  _id: any;
  user: Types.ObjectId;
  tripNote: string;
  destinationStart: { country: string; city: string };
  destinationEnd: { country: string; city: string };
  departureTime: string;
  cost: number;
  maxWeight: number;
  restrictedItems: string[];
  spotsAvailable: number;
  transportMode: string;
}

export interface ServiceRequest {
  service: Types.ObjectId;
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  transportDescription: string;
  packageWeight: number;
  specialRequest?: string;
  specialRequestCost?: number;
}
