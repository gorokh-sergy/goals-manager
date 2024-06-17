import { configure, makeAutoObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'

import { Item } from '@/types/item'
import { Plan } from '@/types/plan'
import { Step } from '@/types/step'

configure({ enforceActions: 'always' })

const getInitialSteps = (): Step[] => [
  {
    title: 'HAVING',
    number: 1,
    items: [],
  },
  {
    title: 'BEING',
    number: 2,
    items: [],
  },
  {
    number: 3,
    title: 'DOING',
    items: [],
  },
  {
    number: 5,
    title: 'COST',
    items: [],
  },
  {
    number: 4,
    title: 'DOING',
    items: [],
  },
  {
    number: 5,
    title: 'COST',
    items: [],
  },
  {
    number: 5,
    title: 'COST',
    items: [],
  },
]
const getInitialPlan = (): Plan => ({
  name: '',
  userId: '',
  duration: null,
  creationDate: null,
  planId: uuidv4(),
  steps: getInitialSteps(),
  actions: [],
})

const saveToLocalStorage = (key, value): void => {
  localStorage.setItem(key, JSON.stringify(value))
}
const getFromLocalStorage = <Type>(key): Type => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return getInitialPlan()
  }
}
const getAllPlansFromLocalStorage = <Type>(): Type => {
  return getFromLocalStorage<Type>('allPlans')
}

const getPlanFromLocalStorage = <Type>(): Type => {
  return getFromLocalStorage<Type>('currentPlan')
}

class PlansStore {
  // steps: Step[] = getInitialSteps()
  _allPlans: Plan[] = [
    {
      ...getInitialPlan(),
      name: 'name1',
      duration: 1,
      creationDate: new Date().toLocaleDateString(),
    },
    {
      ...getInitialPlan(),
      name: 'name2',
      duration: 2,
      creationDate: new Date().toLocaleDateString(),
    },
  ]

  currentPlan: Plan = getInitialPlan()

  // initialPlan: Plan = getInitialPlan()

  constructor() {
    makeAutoObservable(this)
  }

  get allPlans(): Plan[] {
    if (this._allPlans.length > 2) {
      return this._allPlans
    } else {
      const plansFromLocalStorage = getAllPlansFromLocalStorage()
      return plansFromLocalStorage > 2 ? plansFromLocalStorage : []
    }
  }

  saveCurrentPlanToLocalStorage(): void {
    saveToLocalStorage('currentPlan', this.currentPlan)
  }

  setCurrentPlan = (): void => {
    this.currentPlan = getPlanFromLocalStorage<Plan>()
  }

  setAllPlans = (): void => {
    this._allPlans = getAllPlansFromLocalStorage < Plan > []()
  }

  addPlan = (name, duration): void => {
    const plan = {
      ...this.currentPlan,
      name,
      duration,
      creationDate: new Date().toLocaleDateString(),
      planId: uuidv4(),
    }
    this._allPlans = [...this._allPlans, plan]
    saveToLocalStorage('allPlans', this.allPlans)
  }

  addItem = (stepIdx: number, text: string): void => {
    const newItem: Item = {
      text,
      isReady: false,
      requiresFulfillment: false,
    }
    this.currentPlan.steps[stepIdx].items.push(newItem)
    this.saveCurrentPlanToLocalStorage()
  }

  removeItem = (stepIdx: number, itemIdx: number): void => {
    this.currentPlan.steps[stepIdx].items.splice(itemIdx, 1)
    this.saveCurrentPlanToLocalStorage()
  }

  editItem = (stepIdx: number, itemIdx: number, newText: string): void => {
    this.currentPlan.steps[stepIdx].items[itemIdx] = {
      ...this.currentPlan.steps[stepIdx].items[itemIdx],
      text: newText,
    }
    this.saveCurrentPlanToLocalStorage()
  }

  toggleCheck = (stepIdx: number, itemIdx: number): void => {
    this.currentPlan.steps[stepIdx].items[itemIdx].isReady =
      !this.currentPlan.steps[stepIdx].items[itemIdx].isReady
    this.saveCurrentPlanToLocalStorage()
  }
}

export default new PlansStore()