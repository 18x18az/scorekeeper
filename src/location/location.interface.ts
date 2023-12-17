export interface LocationResponse {
  venue: string
  address_1: string
  address_2: string
  city: string
  region: string
  postcode: string
  country: string
  coordinates: {
    lat: number
    lon: number
  }
}
