
export enum Category {
  SCOOTER = '踏板车',
  SPORT = '运动',
  TOURING = '休旅',
  RETRO = '复古',
  ELECTRIC = '电动车'
}

export interface Specs {
  engineType: string;
  displacement: string;
  maxPower: string;
  maxTorque: string;
  coolingSystem: string;
  fuelSystem: string;
  transmission: string;
  fuelCapacity: string;
  seatHeight: string;
  curbWeight: string;
  tireFront: string;
  tireRear: string;
  brakingSystem: string;
  absTcs: string;
}

export interface Motorcycle {
  id: string;
  name: string;
  series: string;
  price: string;
  image: string;
  category: Category;
  description: string;
  specs: Specs;
}

export type ViewState = 'list' | 'detail' | 'compare' | 'ai';
