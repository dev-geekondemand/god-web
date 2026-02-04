import { Address } from "./Geek";
import { ServiceRequest } from "./ServiceRequest";

interface User {
    _id: string;
    authProvider: string;
    authProviderId: string;
    fullName: {
        first: string;
        last: string;
    }
    email: string;
    address: Address;
    phone: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    profileImage: string;
    profileCompleted: boolean;
    needsReminderToCompleteProfile: boolean;
    requests: ServiceRequest[];
    createdAt: Date;
    updatedAt: Date;
  }

  export default User