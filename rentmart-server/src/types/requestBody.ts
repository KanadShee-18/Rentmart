export interface ISignupBody {
  name: string
  email: string
  password: string
}

export interface ILoginBody {
  email: string
  password: string
}

export interface ISendOtpBody {
  email: string
}

export interface IVerifyOtpBody {
  email: string
  otp: string
}

export interface IChangePasswordBody {
  oldPassword: string
  newPassword: string
}

export interface ICreateProductBody {
  name: string
  description: string
  category: string
  rentPrice: number
  rentType: string
}

export interface IVerifyProductBody {
  status: 'approved' | 'rejected'
  feedback: string
}
