import type { TableColumn } from '../components';

export interface Person {
  id: string;
  name: string;
  age: number;
}

export const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', age: 36 },
  { id: '2', name: 'Alan Turing', age: 41 },
];

export const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name' },
  { key: 'age', header: 'Age' },
];
