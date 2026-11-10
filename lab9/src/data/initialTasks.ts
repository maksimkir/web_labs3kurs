import type { Task } from '../types/task'

export const CATEGORIES = ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git', 'Інше'] as const

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'React Components',
    description: 'Опрацювати базові принципи компонентів React',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 2,
    title: 'TypeScript Exercises',
    description: 'Виконати практичні вправи',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
  },
  {
    id: 3,
    title: 'Rendering Lists',
    description: 'Розібратися з map і key у списках',
    completed: false,
    priority: 'medium',
    category: 'React',
  },
  {
    id: 4,
    title: 'BEM для SCSS',
    description: 'Повторити схему Block__Element--Modifier',
    completed: false,
    priority: 'low',
    category: 'CSS',
  },
]
