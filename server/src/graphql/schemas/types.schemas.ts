export default `
scalar Point

type Places {
    id:String!
    name: String!
    location:Point!
    address:String
    image: String
    zipCode: Int
    offers: [Offer]!
  }

  type Offer {
    id:String!
    consumableType: String
    offerType: String
    start: String!
    end: String!
    repeat: Boolean
    repeatEvery: String
    description: String
    score: Int!
    available: Boolean!
  }

  input OfferInput {
    consumableType: String
    offerType: String
    start: String
    end: String
    repeat: Boolean
    repeatEvery: String
    description: String
    score: Int
    available: Boolean
  }

  input VoteInput {
    id:String
    score:Int
  }


`;
