import { Category } from "./Category"
import Geek, { Address } from "./Geek"
import User from "./Seeker"
import { UserIssue } from "./UserIssue"


export interface Review {
   _id: string
   rating: number
   comment: string
   postedBy: Geek
}

export interface ServiceRequest {
   _id: string
   category: Category
   geek: Geek 
   seeker: User
   issue: UserIssue
   mode: string
   scheduledAt : Date
   address: Address
   status: string
   geekResponseStatus: 'Pending' | 'Accepted' | 'Rejected' | 'Matched' | 'Completed' | 'Cancelled' | string
   responseAt : Date
   createdAt: Date
   reviews:[Review],
   totalRating: string,
   images: [{
      public_id: string
      url: string
   }],
   video: {
      public_id: string
      url: string
   },
   overview: {
      description: string
   }
}