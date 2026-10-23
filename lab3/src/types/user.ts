export type Gender = 'male' | 'female'

export interface UserName {
  title: string
  first: string
  last: string
}

export interface UserStreet {
  number: number
  name: string
}

export interface UserTimezone {
  offset: string
  description: string
}

export interface UserLocation {
  street: UserStreet
  city: string
  state: string
  country: string
  postcode: number | string
  timezone: UserTimezone
}

export interface UserDob {
  date: string
  age: number
}

export interface User {
  id: number
  gender: Gender
  name: UserName
  location: UserLocation
  email: string
  dob: UserDob
  phone: string
  cell: string
  picture: string
  hobbies: string[]
  details: string
}

export type AgeGroup = 'minor' | 'young' | 'adult' | 'senior'

export type GenderFilter = 'all' | Gender
export type AgeFilter = 'all' | 'adult'
export type SortKey = 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'
