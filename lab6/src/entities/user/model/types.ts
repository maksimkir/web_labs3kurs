export type Gender = 'male' | 'female'

/** Користувач за схемою DummyJSON (https://dummyjson.com/docs/users). */
export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: Gender
  email: string
  phone: string
  username: string
  password?: string
  /** Дата народження у форматі yyyy-m-d. */
  birthDate?: string
  image?: string
  role?: 'admin' | 'moderator' | 'user'
  university?: string
  address?: {
    address: string
    city: string
    state: string
    country: string
  }
  company?: {
    name: string
    title: string
    department: string
  }
}

/** Поля, які заповнюються у формі створення. */
export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'username' | 'age' | 'gender' | 'phone'
> & { password: string }

export type UpdateUserDto = Partial<CreateUserDto>

export type UserSortField = 'firstName' | 'age'

export function fullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`
}
