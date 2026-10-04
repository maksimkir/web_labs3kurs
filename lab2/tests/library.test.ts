import { expect } from 'chai';
import { Library, Identifiable } from '../src/services/Library';
import { Storage } from '../src/services/Storage';

/** Простий in-memory fake для Storage<T>, щоб тести не залежали від DOM/LocalStorage */
class FakeStorage<T> extends Storage<T> {
  private data: T[] = [];
  constructor() {
    super('fake-key');
  }
  public save(data: T[]): void {
    this.data = data;
  }
  public load(): T[] {
    return this.data;
  }
}

interface TestItem extends Identifiable {
  id: string;
  name: string;
}

describe('Library<T>', () => {
  it('додає елемент та зберігає його в сховищі', () => {
    const storage = new FakeStorage<TestItem>();
    const library = new Library<TestItem>(storage);

    library.add({ id: '1', name: 'Item One' });

    expect(library.getAll()).to.have.lengthOf(1);
    expect(library.getAll()[0].name).to.equal('Item One');
  });

  it('видаляє елемент за id та повертає true', () => {
    const storage = new FakeStorage<TestItem>();
    const library = new Library<TestItem>(storage);
    library.add({ id: '1', name: 'Item One' });

    const removed = library.remove('1');

    expect(removed).to.equal(true);
    expect(library.getAll()).to.have.lengthOf(0);
  });

  it('повертає false при видаленні неіснуючого елемента', () => {
    const storage = new FakeStorage<TestItem>();
    const library = new Library<TestItem>(storage);

    const removed = library.remove('does-not-exist');

    expect(removed).to.equal(false);
  });

  it('знаходить елемент за id', () => {
    const storage = new FakeStorage<TestItem>();
    const library = new Library<TestItem>(storage);
    library.add({ id: '42', name: 'Findable' });

    const found = library.findById('42');

    expect(found).to.not.be.undefined;
    expect(found?.name).to.equal('Findable');
  });

  it('фільтрує елементи за предикатом', () => {
    const storage = new FakeStorage<TestItem>();
    const library = new Library<TestItem>(storage);
    library.add({ id: '1', name: 'Apple' });
    library.add({ id: '2', name: 'Banana' });

    const result = library.find((item) => item.name.startsWith('A'));

    expect(result).to.have.lengthOf(1);
    expect(result[0].name).to.equal('Apple');
  });
});
