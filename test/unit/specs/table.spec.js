import { createVue, triggerEvent, destroyVM } from '../util';

const DELAY = 10;
const testDataArr = [];
const toArray = function(obj) {
  return [].slice.call(obj);
};

const getTestData = function() {
  return [
    { id: 1, name: 'Toy Story', release: '1995-11-22', director: 'John Lasseter', runtime: 80 },
    { id: 2, name: 'A Bug\'s Life', release: '1998-11-25', director: 'John Lasseter', runtime: 95 },
    { id: 3, name: 'Toy Story 2', release: '1999-11-24', director: 'John Lasseter', runtime: 92 },
    { id: 4, name: 'Monsters, Inc.', release: '2001-11-2', director: 'Peter Docter', runtime: 92 },
    { id: 5, name: 'Finding Nemo', release: '2003-5-30', director: 'Andrew Stanton', runtime: 100 }
  ];
};

getTestData().forEach(cur => {
  Object.keys(cur).forEach(prop => {
    testDataArr.push(cur[prop].toString());
  });
});

describe('Table', () => {
  describe('rendering data is correct', () => {
    const vm = createVue({
      template: `
        <tm-table :data="testData">
          <tm-table-column prop="id" />
          <tm-table-column prop="name" label="片名" />
          <tm-table-column prop="release" label="发行日期" />
          <tm-table-column prop="director" label="导演" />
          <tm-table-column prop="runtime" label="时长（分）" />
        </tm-table>
      `,

      created() {
        this.testData = getTestData();
      }
    });

    it('head', done => {
      setTimeout(() => {
        const ths = toArray(vm.$el.querySelectorAll('thead th'));

        expect(ths.map(node => node.textContent).filter(o => o))
          .to.eql(['片名', '发行日期', '导演', '时长（分）']);
        done();
      }, DELAY);
    });

    it('row length', () => {
      expect(vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr')).to.length(getTestData().length);
    });

    it('row data', () => {
      const cells = toArray(vm.$el.querySelectorAll('td .cell'))
        .map(node => node.textContent);

      expect(cells).to.eql(testDataArr);
      destroyVM(vm);
    });
  });

  describe('attributes', () => {
    const createTable = function(props, opts) {
      return createVue(Object.assign({
        template: `
          <tm-table :data="testData" ${props}>
            <tm-table-column prop="name" label="片名" />
            <tm-table-column prop="release" label="发行日期" />
            <tm-table-column prop="director" label="导演" />
            <tm-table-column prop="runtime" label="时长（分）" />
          </tm-table>
        `,

        created() {
          this.testData = getTestData();
        }
      }, opts));
    };

    it('height', done => {
      const vm = createTable('height="134"');
      setTimeout(() => {
        expect(vm.$el.style.height).to.equal('134px');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('height as string', done => {
      const vm = createTable('height="100pt"');
      setTimeout(() => {
        expect(vm.$el.style.height).to.equal('100pt');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('maxHeight', done => {
      const vm = createTable('max-height="134"');
      setTimeout(() => {
        expect(vm.$el.style.maxHeight).to.equal('134px');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('stripe', done => {
      const vm = createTable('stripe');
      setTimeout(() => {
        expect(vm.$el.classList.contains('tm-table--striped')).to.true;
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('border', done => {
      const vm = createTable('border');
      setTimeout(() => {
        expect(vm.$el.classList.contains('tm-table--border')).to.true;
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('fit', done => {
      const vm = createTable(':fit="false"');
      setTimeout(() => {
        expect(vm.$el.classList.contains('tm-table--fit')).to.false;
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('show-header', done => {
      const vm = createTable(':show-header="false"');
      setTimeout(() => {
        expect(vm.$el.querySelectorAll('.tm-table__header-wrapper').length).to.equal(0);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('tableRowClassName', done => {
      const vm = createTable(':row-class-name="tableRowClassName"', {
        methods: {
          tableRowClassName({row, rowIndex}) {
            console.log(row, rowIndex);
            if (rowIndex === 1) {
              return 'info-row';
            } else if (rowIndex === 3) {
              return 'positive-row';
            }

            return '';
          }
        }
      });

      setTimeout(() => {
        expect(vm.$el.querySelectorAll('.info-row')).to.length(1);
        expect(vm.$el.querySelectorAll('.positive-row')).to.length(1);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('tableRowStyle[Object]', done => {
      const vm = createTable(':row-style="{ height: \'60px\' }"', {});

      setTimeout(() => {
        expect(vm.$el.querySelector('.tm-table__body tr').style.height).to.equal('60px');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('tableRowStyle[Function]', done => {
      const vm = createTable(':row-style="tableRowStyle"', {
        methods: {
          tableRowStyle({row, rowIndex}) {
            console.log(row, rowIndex);
            if (rowIndex === 1) {
              return { height: '60px' };
            }

            return null;
          }
        }
      });

      setTimeout(() => {
        expect(vm.$el.querySelector('.tm-table__body tr:nth-child(1)').style.height).to.equal('');
        expect(vm.$el.querySelector('.tm-table__body tr:nth-child(2)').style.height).to.equal('60px');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('current-row-key', done => {
      const vm = createVue({
        template: `
        <tm-table :data="testData" row-key="id" highlight-current-row :current-row-key="currentRowKey">
          <tm-table-column prop="name" label="片名" />
          <tm-table-column prop="release" label="发行日期" />
          <tm-table-column prop="director" label="导演" />
          <tm-table-column prop="runtime" label="时长（分）" />
        </tm-table>
      `,

        created() {
          this.testData = getTestData();
        },

        data() {
          return { currentRowKey: null };
        }
      }, true);
      setTimeout(() => {
        vm.currentRowKey = 1;
        const tr = vm.$el.querySelector('.tm-table__body-wrapper tbody tr');
        setTimeout(() => {
          expect(tr.classList.contains('current-row')).to.be.true;
          vm.currentRowKey = 2;

          const rows = vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr');
          setTimeout(() => {
            expect(tr.classList.contains('current-row')).to.be.false;
            expect(rows[1].classList.contains('current-row')).to.be.true;
            destroyVM(vm);
            done();
          }, DELAY);
        }, DELAY);
      }, DELAY);
    });
  });

  describe('filter', () => {
    let vm;

    beforeEach(done => {
      vm = createVue({
        template: `
          <tm-table ref="table" :data="testData" @filter-change="handleFilterChange">
            <tm-table-column prop="name" label="片名" />
            <tm-table-column prop="release" label="发行日期" />
            <tm-table-column
              prop="director"
              column-key="director"
              :filters="[
                { text: 'John Lasseter', value: 'John Lasseter' },
                { text: 'Peter Docter', value: 'Peter Docter' },
                { text: 'Andrew Stanton', value: 'Andrew Stanton' }
              ]"
              :filter-method="filterMethod"
              label="导演" />
            <tm-table-column prop="runtime" label="时长（分）" />
          </tm-table>
        `,

        created() {
          this.testData = getTestData();
        },

        methods: {
          filterMethod(value, row) {
            return value === row.director;
          },
          handleFilterChange(filters) {
            this.filters = filters;
          }
        }
      }, true);

      setTimeout(done, DELAY);
    });

    afterEach(() => destroyVM(vm));

    it('render', () => {
      expect(vm.$el.querySelector('.tm-table__column-filter-trigger')).to.exist;
    });

    it('click dropdown', done => {
      const btn = vm.$el.querySelector('.tm-table__column-filter-trigger');
      triggerEvent(btn, 'click', true, false);
      setTimeout(() => {
        const filter = document.body.querySelector('.tm-table-filter');
        expect(filter).to.exist;
        document.body.removeChild(filter);
        done();
      }, 100);
    });

    it('click filter', done => {
      const btn = vm.$el.querySelector('.tm-table__column-filter-trigger');

      triggerEvent(btn, 'click', true, false);
      setTimeout(() => {
        const filter = document.body.querySelector('.tm-table-filter');

        // John Lasseter
        triggerEvent(filter.querySelector('.tm-checkbox'), 'click', true, false);
        // confrim button
        setTimeout(() => {
          triggerEvent(filter.querySelector('.tm-table-filter__bottom button'), 'click', true, false);
          setTimeout(() => {
            expect(vm.filters['director']).to.be.eql(['John Lasseter']);
            expect(vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr')).to.length(3);
            document.body.removeChild(filter);
            done();
          }, DELAY);
        }, 100);
      }, 100);
    });

    it('click reset', done => {
      const btn = vm.$el.querySelector('.tm-table__column-filter-trigger');

      triggerEvent(btn, 'click', true, false);
      setTimeout(() => {
        const filter = document.body.querySelector('.tm-table-filter');

        // John Lasseter
        triggerEvent(filter.querySelector('.tm-checkbox'), 'click', true, false);
        setTimeout(() => {
          // reset button
          triggerEvent(filter.querySelectorAll('.tm-table-filter__bottom button')[1], 'click', true, false);
          setTimeout(() => {
            expect(vm.filters['director']).to.be.eql([]);
            expect(filter.querySelector('.tm-table-filter__bottom button').classList.contains('is-disabled')).to.true;
            document.body.removeChild(filter);
            destroyVM(vm);
            done();
          }, DELAY);
        }, 100);
      }, 100);
    });
  });

  describe('events', () => {
    const createTable = function(prop = '') {
      return createVue({
        template: `
          <tm-table :data="testData" @${prop}="handleEvent">
            <tm-table-column type="selection" />
            <tm-table-column prop="name" />
            <tm-table-column prop="release" />
            <tm-table-column prop="director" />
            <tm-table-column prop="runtime"/>
          </tm-table>
        `,

        methods: {
          handleEvent(...args) {
            this.result = args;
          }
        },

        created() {
          this.testData = getTestData();
        },

        data() {
          return { result: '', testData: this.testData };
        }
      }, true);
    };

    it('select', done => {
      const vm = createTable('select');

      setTimeout(() => {
        vm.$el.querySelectorAll('.tm-checkbox')[1].click();
        expect(vm.result).to.length(2);
        expect(vm.result[1]).to.have.property('name').to.equal(getTestData()[0].name);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('select-all', done => {
      const vm = createTable('select-all');

      setTimeout(() => {
        vm.$el.querySelector('.tm-checkbox').click();
        setTimeout(() => {
          expect(vm.result).to.length(1);
          expect(vm.result[0]).to.length(getTestData().length);
          destroyVM(vm);
          done();
        }, DELAY);
      }, DELAY);
    });

    it('selection-change', done => {
      const vm = createTable('selection-change');
      setTimeout(() => {
        vm.$el.querySelectorAll('.tm-checkbox')[1].click();
        expect(vm.result).to.length(1);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('cell-mouse-enter', done => {
      const vm = createTable('cell-mouse-enter');

      setTimeout(() => {
        const cell = vm.$el.querySelectorAll('.tm-table__body .cell')[2]; // first row
        triggerEvent(cell.parentNode, 'mouseenter');
        expect(vm.result).to.length(4); // row, column, cell, event
        expect(vm.result[0]).to.have.property('name').to.equal(getTestData()[0].name);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('cell-mouse-leave', done => {
      const vm = createTable('cell-mouse-leave');

      setTimeout(() => {
        const cell = vm.$el.querySelectorAll('.tm-table__body .cell')[7]; // second row
        const cell2 = vm.$el.querySelectorAll('.tm-table__body .cell')[2]; // first row

        triggerEvent(cell2.parentNode, 'mouseenter');
        triggerEvent(cell.parentNode, 'mouseleave');
        expect(vm.result).to.length(4); // row, column, cell, event
        expect(vm.result[0]).to.have.property('name').to.equal(getTestData()[0].name);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('cell-click', done => {
      const vm = createTable('cell-click');

      setTimeout(() => {
        const cell = vm.$el.querySelectorAll('.tm-table__body .cell')[2]; // first row

        cell.parentNode.click();
        expect(vm.result).to.length(4); // row, column, cell, event
        expect(vm.result[0]).to.have.property('name').to.equal(getTestData()[0].name);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('row-click', done => {
      const vm = createTable('row-click');

      setTimeout(() => {
        const cell = vm.$el.querySelectorAll('.tm-table__body .cell')[2]; // first row

        triggerEvent(cell.parentNode.parentNode, 'click');
        expect(vm.result).to.length(3); // row, event, column
        expect(vm.result[0]).to.have.property('name').to.equal(getTestData()[0].name);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('row-dblclick', done => {
      const vm = createTable('row-dblclick');

      setTimeout(() => {
        const cell = vm.$el.querySelectorAll('.tm-table__body .cell')[2]; // first row

        triggerEvent(cell.parentNode.parentNode, 'dblclick');
        expect(vm.result).to.length(3); // row, event, column
        expect(vm.result[0]).to.have.property('name').to.equal(getTestData()[0].name);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('current-change', done => {
      const vm = createTable('current-change');

      setTimeout(() => {
        const cell = vm.$el.querySelectorAll('.tm-table__body .cell')[2]; // first row

        triggerEvent(cell.parentNode.parentNode, 'click');
        expect(vm.result).to.length(2); // currentRow, oldCurrentRow
        expect(vm.result[0]).to.have.property('name').to.equal(getTestData()[0].name);
        expect(vm.result[1]).to.equal(null);

        // clear data => current-change should fire again.
        const oldRow = vm.result[0];
        vm.testData = [];

        setTimeout(() => {
          expect(vm.result).to.length(2); // currentRow, oldCurrentRow
          expect(vm.result[0]).to.equal(null);
          expect(vm.result[1]).to.equal(oldRow);

          destroyVM(vm);
          done();
        }, DELAY);
      }, DELAY);
    });

    it('header-click', done => {
      const vm = createTable('header-click');

      setTimeout(() => {
        const cell = vm.$el.querySelectorAll('.tm-table__header th')[1]; // header[prop='name']

        triggerEvent(cell, 'click');
        expect(vm.result).to.length(2); // column, event
        expect(vm.result[0]).to.have.property('property').to.equal('name');
        destroyVM(vm);
        done();
      }, DELAY);
    });
  });

  describe('column attributes', () => {
    const createTable = function(props1, props2, props3, props4, opts, tableProps) {
      return createVue(Object.assign({
        template: `
          <tm-table :data="testData" ${tableProps || ''}>
            <tm-table-column prop="name" ${props1 || ''} />
            <tm-table-column prop="release" ${props2 || ''} />
            <tm-table-column prop="director" ${props3 || ''} />
            <tm-table-column prop="runtime" ${props4 || ''} />
          </tm-table>
        `,

        created() {
          this.testData = getTestData();
        }
      }, opts));
    };

    it('label', done => {
      const vm = createTable('label="啊哈哈哈"', 'label="啊啦啦啦"');
      setTimeout(() => {
        const ths = toArray(vm.$el.querySelectorAll('thead th'))
          .map(node => node.textContent).filter(o => o);

        expect(ths).to.eql(['啊哈哈哈', '啊啦啦啦']);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('width', done => {
      const vm = createTable('width="123px"', ':width="102"', 'width="39"');
      setTimeout(() => {
        const ths = toArray(vm.$el.querySelectorAll('.tm-table__header-wrapper col'))
          .map(node => node.width).filter(o => o);

        expect(ths).to.include('123').include('102').include('39');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('fixed', done => {
      const vm = createTable(
        'fixed label="test1"',
        'fixed="right" label="test2"',
        'fixed="left" label="test3"');
      setTimeout(() => {
        expect(toArray(vm.$el.querySelectorAll('.tm-table__fixed th:not(.is-hidden)'))
          .map(node => node.textContent))
          .to.eql(['test1', 'test3']);

        expect(toArray(vm.$el.querySelectorAll('.tm-table__fixed-right th:not(.is-hidden)'))
          .map(node => node.textContent))
          .to.eql(['test2']);
        expect(vm.$el.querySelector('.tm-table__body-wrapper').style.height).to.equal('');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('resizable', done => {
      const vm = createTable(
        'resizable',
        ':resizable="false"',
        '',
        '',
        {},
        'border');

      setTimeout(() => {
        const firstCol = vm.$el.querySelector('thead th');
        triggerEvent(firstCol, 'mousemove');
        triggerEvent(firstCol, 'mousedown');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('formatter', done => {
      const vm = createTable(
        ':formatter="renderCell"', '', '', '', {
          methods: {
            renderCell(row) {
              return `[${row.name}]`;
            }
          }
        });

      setTimeout(() => {
        const cells = toArray(vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr td:first-child'));
        expect(cells.map(n => n.textContent)).to.eql(getTestData().map(o => `[${o.name}]`));
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('show-overflow-tooltip', done => {
      const vm = createTable('show-overflow-tooltip');
      setTimeout(() => {
        expect(vm.$el.querySelectorAll('.tm-tooltip')).to.length(5);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('show-tooltip-when-overflow', done => { // old version prop name
      const vm = createTable('show-tooltip-when-overflow');
      setTimeout(() => {
        expect(vm.$el.querySelectorAll('.tm-tooltip')).to.length(5);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('render-header', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData">
            <tm-table-column prop="name" :render-header="renderHeader" label="name">
            </tm-table-column>
            <tm-table-column prop="release"/>
            <tm-table-column prop="director"/>
            <tm-table-column prop="runtime"/>
          </tm-table>
        `,

        methods: {
          renderHeader(h, { column, $index }) {
            return '' + $index + ':' + column.label;
          }
        },

        created() {
          this.testData = getTestData();
        }
      });

      setTimeout(() => {
        const headerCell = vm.$el.querySelector('.tm-table__header-wrapper thead tr th:first-child .cell');
        expect(headerCell.textContent).to.equal('0:name');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('align', done => {
      const vm = createTable('align="left"', 'align="right"', 'align="center"');
      setTimeout(() => {
        var len = getTestData().length + 1;
        expect(vm.$el.querySelectorAll('.is-left')).to.length(len);
        expect(vm.$el.querySelectorAll('.is-right')).to.length(len);
        expect(vm.$el.querySelectorAll('.is-center')).to.length(len);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('class-name', done => {
      const vm = createTable('class-name="column-1"', 'class-name="column-2 column-class-a"', 'class-name="column-class-a"');
      setTimeout(() => {
        var len = getTestData().length + 1;
        expect(vm.$el.querySelectorAll('.column-1')).to.length(len);
        expect(vm.$el.querySelectorAll('.column-2')).to.length(len);
        expect(vm.$el.querySelectorAll('.column-class-a')).to.length(len * 2);
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('selectable', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData" @selection-change="change">
            <tm-table-column type="selection" :selectable="filterSelect" />
            <tm-table-column prop="name" label="name" />
            <tm-table-column prop="release" label="release" />
            <tm-table-column prop="director" label="director" />
            <tm-table-column prop="runtime" label="runtime" />
          </tm-table>
        `,

        created() {
          this.testData = getTestData();
        },

        data() {
          return { selected: [] };
        },

        methods: {
          change(rows) {
            this.selected = rows;
          },

          filterSelect(row, index) {
            return index > 2;
          }
        }
      }, true);

      setTimeout(() => {
        vm.$el.querySelector('.tm-checkbox').click();
        setTimeout(() => {
          expect(vm.selected).to.length(2);
          destroyVM(vm);
          done();
        }, DELAY);
      }, DELAY);
    });

    it('selectable === false & check selectAll status', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData" @selection-change="change">
            <tm-table-column type="selection" :selectable="filterSelect" />
            <tm-table-column prop="name" label="name" />
            <tm-table-column prop="release" label="release" />
            <tm-table-column prop="director" label="director" />
            <tm-table-column prop="runtime" label="runtime" />
          </tm-table>
        `,

        created() {
        },

        data() {
          return { selected: [], testData: null };
        },

        methods: {
          change(rows) {
            this.selected = rows;
          },

          filterSelect() {
            return false;
          }
        }
      }, true);

      vm.testData = getTestData();

      setTimeout(() => {
        expect(vm.$el.querySelector('.tm-checkbox').__vue__.checked).to.be.false;
        setTimeout(() => {
          expect(vm.selected).to.length(0);
          destroyVM(vm);
          done();
        }, DELAY);
      }, DELAY);
    });

    it('emit selection-change after row has been removed', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData" @selection-change="change">
            <tm-table-column type="selection" />
            <tm-table-column prop="name" label="name" />
            <tm-table-column prop="release" label="release" />
            <tm-table-column prop="director" label="director" />
            <tm-table-column prop="runtime" label="runtime" />
          </tm-table>
        `,

        created() {
          this.testData = getTestData();
        },

        data() {
          return { selected: [], testData: null };
        },

        methods: {
          change(rows) {
            this.selected = rows;
          },

          filterSelect(row, index) {
            return index > 2;
          }
        }
      }, true);

      setTimeout(() => {
        vm.$el.querySelector('.tm-checkbox').click();
        setTimeout(() => {
          expect(vm.selected).to.length(5);
          vm.testData.splice(0, 1);
          setTimeout(() => {
            expect(vm.selected).to.length(4);
            destroyVM(vm);
            done();
          });
        }, DELAY);
      }, DELAY);
    });

    describe('type', () => {
      const createTable = function(type) {
        return createVue({
          template: `
            <tm-table :data="testData" @selection-change="change">
              <tm-table-column type="${type}" />
              <tm-table-column prop="name" label="name" />
              <tm-table-column prop="release" label="release" />
              <tm-table-column prop="director" label="director" />
              <tm-table-column prop="runtime" label="runtime" />
            </tm-table>
          `,

          created() {
            this.testData = getTestData();
          },

          data() {
            return { selected: [] };
          },

          methods: {
            change(rows) {
              this.selected = rows;
            }
          }
        }, true);
      };

      describe('= selection', () => {
        const vm = createTable('selection');

        it('render', done => {
          setTimeout(() => {
            expect(vm.$el.querySelectorAll('.tm-checkbox')).to.length(getTestData().length + 1);
            done();
          }, DELAY);
        });

        it('select all', done => {
          vm.$el.querySelector('.tm-checkbox').click();

          setTimeout(() => {
            expect(vm.selected).to.length(getTestData().length);
            done();
          }, DELAY);
        });

        it('cancel all', done => {
          vm.$el.querySelector('.tm-checkbox').click();

          setTimeout(() => {
            expect(vm.selected).to.length(0);
            destroyVM(vm);
            done();
          }, DELAY);
        });

        it('select one', done => {
          const vm2 = createTable('selection');

          setTimeout(() => {
            vm2.$el.querySelectorAll('.tm-checkbox')[1].click();

            setTimeout(() => {
              expect(vm2.selected).to.length(1);
              expect(vm2.selected[0].name).to.equal(getTestData()[0].name);
              destroyVM(vm2);
              done();
            }, DELAY);
          }, DELAY);
        });
      });

      describe('= index', () => {
        const vm = createTable('index');

        it('render', done => {
          setTimeout(() => {
            expect(toArray(vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr td:first-child'))
              .map(node => node.textContent)).to.eql(['1', '2', '3', '4', '5']);
            destroyVM(vm);
            done();
          }, DELAY);
        });
      });

      describe('= expand', () => {
        const createInstance = function(extra) {
          extra = extra || '';
          return createVue({
            template: `
            <tm-table row-key="id" :data="testData" @expand-change="handleExpand" ${extra}>
              <tm-table-column type="expand">
                <template slot-scope="props">
                  <div>{{props.row.name}}</div>
                </template>
            </tm-table-column>
              <tm-table-column prop="release" label="release" />
              <tm-table-column prop="director" label="director" />
              <tm-table-column prop="runtime" label="runtime" />
            </tm-table>
          `,

            created() {
              this.testData = getTestData();
            },

            data() {
              return { expandCount: 0, expandRowKeys: [] };
            },

            methods: {
              handleExpand() {
                this.expandCount++;
              }
            }
          }, true);
        };

        it('works', done => {
          const vm = createInstance();
          setTimeout(() => {
            expect(vm.$el.querySelectorAll('td.tm-table__expand-column').length).to.equal(5);
            destroyVM(vm);
            done();
          }, DELAY);
        });

        it('should expand when click icon', done => {
          const vm = createInstance();
          setTimeout(() => {
            vm.$el.querySelector('td.tm-table__expand-column .tm-table__expand-icon').click();
            setTimeout(() => {
              expect(vm.$el.querySelectorAll('.tm-table__expanded-cell').length).to.equal(1);
              expect(vm.expandCount).to.equal(1);
              vm.$el.querySelector('td.tm-table__expand-column .tm-table__expand-icon').click();
              setTimeout(() => {
                expect(vm.$el.querySelectorAll('.tm-table__expanded-cell').length).to.equal(0);
                expect(vm.expandCount).to.equal(2);
                destroyVM(vm);
                done();
              }, DELAY);
            }, DELAY);
          }, DELAY);
        });

        it('should set expanded rows using expandRowKeys', done => {
          const vm = createInstance(':expand-row-keys="expandRowKeys"');
          setTimeout(() => {
            vm.expandRowKeys = [1, 3];
            setTimeout(() => {
              expect(vm.$el.querySelectorAll('.tm-table__expanded-cell').length).to.equal(2);
              vm.expandRowKeys = [2];
              setTimeout(() => {
                expect(vm.$el.querySelectorAll('.tm-table__expanded-cell').length).to.equal(1);
                destroyVM(vm);
                done();
              }, DELAY);
            }, DELAY);
          }, DELAY);
        });

        it('should default-expand-all when default-expand-all is true', done => {
          const vm = createInstance('default-expand-all');
          setTimeout(() => {
            expect(vm.$el.querySelectorAll('.tm-table__expanded-cell').length).to.equal(5);
            destroyVM(vm);
            done();
          }, DELAY);
        });
      });
    });

    describe('sortable', () => {

      it('render', done => {
        const vm = createTable('', '', '', 'sortable');
        setTimeout(() => {
          expect(vm.$el.querySelectorAll('.caret-wrapper')).to.length(1);
          destroyVM(vm);
          done();
        }, DELAY);
      });

      it('sortable method', done => {
        const vm = createTable(
          'sortable :sort-method="sortMethod"', '', '', '', {
            methods: {
              sortMethod(a, b) {
                // sort method should return number
                if (a.runtime < b.runtime) {
                  return 1;
                }
                if (a.runtime > b.runtime) {
                  return -1;
                }
                return 0;
              }
            }
          });

        setTimeout(() => {
          const elm = vm.$el.querySelector('.caret-wrapper');
          elm.click();

          setTimeout(() => {
            const lastCells = vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr td:last-child');
            expect(toArray(lastCells).map(node => node.textContent)).to.eql(['100', '95', '92', '92', '80']);
            destroyVM(vm);
            done();
          }, DELAY);
        }, DELAY);
      });

      it('sortable by method', done => {
        const vm = createTable(
          'sortable :sort-by="sortBy"', '', '', '', {
            methods: {
              sortBy(a) {
                return -a.runtime;
              }
            }
          });

        setTimeout(() => {
          const elm = vm.$el.querySelector('.caret-wrapper');
          elm.click();

          setTimeout(() => {
            const lastCells = vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr td:last-child');
            expect(toArray(lastCells).map(node => node.textContent)).to.eql(['100', '95', '92', '92', '80']);
            destroyVM(vm);
            done();
          }, DELAY);
        }, DELAY);
      });

      it('sortable by property', done => {
        const vm = createTable(
          'sortable sort-by="runtime"', '', '', '', {});

        setTimeout(() => {
          const elm = vm.$el.querySelector('.caret-wrapper');
          elm.click();

          setTimeout(() => {
            const lastCells = vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr td:last-child');
            expect(toArray(lastCells).map(node => node.textContent)).to.eql(['80', '92', '92', '95', '100']);
            destroyVM(vm);
            done();
          }, DELAY);
        }, DELAY);
      });

      it('sort-change', done => {
        let result;
        const vm = createTable('sortable="custom"', '', '', '', {
          methods: {
            sortChange(...args) {
              result = args;
            }
          }
        }, '@sort-change="sortChange"');
        setTimeout(() => {
          const elm = vm.$el.querySelector('.caret-wrapper');

          elm.click();
          setTimeout(() => {
            expect(result).to.exist;
            destroyVM(vm);
            done();
          }, DELAY);
        }, DELAY);
      });
    });

    describe('click sortable column', () => {
      const vm = createTable('', '', '', 'sortable');

      it('ascending', done => {
        const elm = vm.$el.querySelector('.caret-wrapper');

        elm.click();
        setTimeout(() => {
          const lastCells = vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr td:last-child');
          expect(toArray(lastCells).map(node => node.textContent))
            .to.eql(['80', '92', '92', '95', '100']);
          done();
        }, DELAY);
      });

      it('descending', done => {
        const elm = vm.$el.querySelector('.caret-wrapper');

        elm.click();
        setTimeout(() => {
          const lastCells = vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr td:last-child');
          expect(toArray(lastCells).map(node => node.textContent))
            .to.eql(['100', '95', '92', '92', '80']);
          destroyVM(vm);
          done();
        }, DELAY);
      });
    });
  });

  describe('summary row', () => {
    it('should render', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData" show-summary>
            <tm-table-column prop="name" />
            <tm-table-column prop="release"/>
            <tm-table-column prop="director"/>
            <tm-table-column prop="runtime"/>
          </tm-table>
        `,

        created() {
          this.testData = getTestData();
        }
      }, true);

      setTimeout(() => {
        const footer = vm.$el.querySelector('.tm-table__footer');
        expect(footer).to.exist;
        const cells = toArray(footer.querySelectorAll('.cell'));
        expect(cells[cells.length - 1].innerText).to.equal('459');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('custom sum text', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData" show-summary sum-text="Time">
            <tm-table-column prop="name" />
            <tm-table-column prop="release"/>
            <tm-table-column prop="director"/>
            <tm-table-column prop="runtime"/>
          </tm-table>
        `,

        created() {
          this.testData = getTestData();
        }
      }, true);

      setTimeout(() => {
        const cells = toArray(vm.$el.querySelectorAll('.tm-table__footer .cell'));
        expect(cells[0].innerText).to.equal('Time');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('custom summary method', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData" show-summary :summary-method="getSummary">
            <tm-table-column prop="name" />
            <tm-table-column prop="release"/>
            <tm-table-column prop="director"/>
            <tm-table-column prop="runtime"/>
          </tm-table>
        `,

        created() {
          this.testData = getTestData();
        },

        methods: {
          getSummary(param) {
            const { columns, data } = param;
            const result = [];
            columns.forEach(column => {
              const prop = column.property;
              if (prop === 'release') {
                const dates = data.map(item => item[prop]);
                const releaseYears = dates.map(date => Number(date.slice(0, 4)));
                result.push(releaseYears.reduce((prev, curr) => {
                  return prev + curr;
                }));
              } else {
                result.push('');
              }
            });
            return result;
          }
        }
      }, true);

      setTimeout(() => {
        const cells = toArray(vm.$el.querySelectorAll('.tm-table__footer .cell'));
        expect(cells[1].innerText).to.equal('9996');
        destroyVM(vm);
        done();
      }, DELAY);
    });
  });

  describe('multi level column', () => {
    it('should works', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData">
            <tm-table-column prop="name" />
            <tm-table-column label="group">
              <tm-table-column prop="release"/>
              <tm-table-column prop="director"/>
            </tm-table-column>
            <tm-table-column prop="runtime"/>
          </tm-table>
        `,

        created() {
          this.testData = null;
        }
      }, true);

      setTimeout(() => {
        const trs = vm.$el.querySelectorAll('.tm-table__header tr');
        expect(trs.length).equal(2);
        const firstRowHeader = trs[0].querySelectorAll('th .cell').length;
        const secondRowHeader = trs[1].querySelectorAll('th .cell').length;
        expect(firstRowHeader).to.equal(3);
        expect(secondRowHeader).to.equal(2);

        expect(trs[0].querySelector('th:first-child').getAttribute('rowspan')).to.equal('2');
        expect(trs[0].querySelector('th:nth-child(2)').getAttribute('colspan')).to.equal('2');
        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('should works', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData">
            <tm-table-column prop="name" />
            <tm-table-column label="group">
              <tm-table-column label="group's group">
                <tm-table-column prop="release" />
                <tm-table-column prop="runtime"/>
              </tm-table-column>
              <tm-table-column prop="director" />
            </tm-table-column>
            <tm-table-column prop="runtime"/>
          </tm-table>
        `,

        created() {
          this.testData = null;
        }
      }, true);

      setTimeout(() => {
        const trs = vm.$el.querySelectorAll('.tm-table__header tr');
        expect(trs.length).equal(3);
        const firstRowHeader = trs[0].querySelectorAll('th .cell').length;
        const secondRowHeader = trs[1].querySelectorAll('th .cell').length;
        const thirdRowHeader = trs[2].querySelectorAll('th .cell').length;
        expect(firstRowHeader).to.equal(3);
        expect(secondRowHeader).to.equal(2);
        expect(thirdRowHeader).to.equal(2);

        expect(trs[0].querySelector('th:first-child').getAttribute('rowspan')).to.equal('3');
        expect(trs[0].querySelector('th:nth-child(2)').getAttribute('colspan')).to.equal('3');
        expect(trs[1].querySelector('th:first-child').getAttribute('colspan')).to.equal('2');
        expect(trs[1].querySelector('th:nth-child(2)').getAttribute('rowspan')).to.equal('2');

        destroyVM(vm);
        done();
      }, DELAY);
    });

    it('should work in one column', done => {
      const vm = createVue({
        template: `
          <tm-table :data="testData">
            <tm-table-column label="group">
              <tm-table-column prop="release"/>
            </tm-table-column>
          </tm-table>
        `,

        created() {
          this.testData = null;
        }
      }, true);

      setTimeout(() => {
        const trs = vm.$el.querySelectorAll('.tm-table__header tr');
        expect(trs.length).equal(2);
        const firstRowLength = trs[0].querySelectorAll('th .cell').length;
        const secondRowLength = trs[1].querySelectorAll('th .cell').length;
        expect(firstRowLength).to.equal(1);
        expect(secondRowLength).to.equal(1);

        expect(trs[0].querySelector('th:first-child').getAttribute('rowspan')).to.equal('1');
        expect(trs[0].querySelector('th:first-child').getAttribute('colspan')).to.equal('1');
        destroyVM(vm);
        done();
      }, DELAY);
    });
  });

  describe('dynamic column attribtes', () => {
    const DELAY = 50;

    it('label', (done) => {
      const vm = createVue({
        template: `
          <tm-table :data="testData">
            <tm-table-column prop="name" :label="label"/>
            <tm-table-column prop="release" />
            <tm-table-column prop="director" />
            <tm-table-column prop="runtime" />
          </tm-table>
        `,

        data() {
          return {
            label: 'name'
          };
        },

        created() {
          this.testData = getTestData();
        }
      }, true);

      setTimeout(() => {
        expect(vm.$el.querySelector('.tm-table__header th .cell').textContent).to.equal('name');
        vm.label = 'NAME';
        vm.$nextTick(() => {
          expect(vm.$el.querySelector('.tm-table__header th .cell').textContent).to.equal('NAME');
          destroyVM(vm);
          done();
        });
      }, DELAY);
    });

    it('align', (done) => {
      const vm = createVue({
        template: `
          <tm-table :data="testData">
            <tm-table-column prop="name" :align="align"/>
          </tm-table>
        `,

        data() {
          return {
            align: 'left'
          };
        },

        created() {
          this.testData = getTestData();
        }
      }, true);

      setTimeout(() => {
        expect(vm.$el.querySelectorAll('.tm-table__body td.is-right').length === 0).to.be.true;
        vm.align = 'right';
        vm.$nextTick(() => {
          expect(vm.$el.querySelectorAll('.tm-table__body td.is-right').length > 0).to.be.true;
          destroyVM(vm);
          done();
        });
      }, DELAY);
    });

    it('header-align', (done) => {
      const vm = createVue({
        template: `
           <tm-table :data="testData">
            <tm-table-column prop="name" :align="align" :header-align="headerAlign"/>
          </tm-table>
        `,

        data() {
          return {
            align: 'left',
            headerAlign: null
          };
        },

        created() {
          this.testData = getTestData();
        }
      }, true);

      vm.$nextTick(() => {
        expect(vm.$el.querySelectorAll('.tm-table__header th.is-left').length).to.above(0);
        expect(vm.$el.querySelectorAll('.tm-table__header th.is-center').length).to.equal(0);
        expect(vm.$el.querySelectorAll('.tm-table__header th.is-right').length).to.equal(0);
        vm.align = 'right';
        vm.$nextTick(() => {
          expect(vm.$el.querySelectorAll('.tm-table__header th.is-left').length).to.equal(0);
          expect(vm.$el.querySelectorAll('.tm-table__header th.is-center').length).to.equal(0);
          expect(vm.$el.querySelectorAll('.tm-table__header th.is-right').length).to.above(0);
          vm.headerAlign = 'center';
          vm.$nextTick(() => {
            expect(vm.$el.querySelectorAll('.tm-table__header th.is-left').length).to.equal(0);
            expect(vm.$el.querySelectorAll('.tm-table__header th.is-center').length).to.above(0);
            expect(vm.$el.querySelectorAll('.tm-table__header th.is-right').length).to.equal(0);
            vm.headerAlign = null;
            vm.$nextTick(() => {
              expect(vm.$el.querySelectorAll('.tm-table__header th.is-left').length).to.equal(0);
              expect(vm.$el.querySelectorAll('.tm-table__header th.is-center').length).to.equal(0);
              expect(vm.$el.querySelectorAll('.tm-table__header th.is-right').length).to.above(0);
              destroyVM(vm);
              done();
            });
          });
        });
      });
    });

    it('width', (done) => {
      const vm = createVue({
        template: `
          <tm-table :data="testData" :fit="false">
            <tm-table-column prop="name" :width="width"/>
          </tm-table>
        `,

        data() {
          return {
            width: 100
          };
        },

        created() {
          this.testData = getTestData();
        }
      }, true);

      setTimeout(() => {
        expect(vm.$el.querySelector('.tm-table__body col').getAttribute('width')).to.equal('100');
        vm.width = 200;
        setTimeout(() => {
          expect(vm.$el.querySelector('.tm-table__body col').getAttribute('width')).to.equal('200');
          destroyVM(vm);
          done();
        }, 100);
      }, DELAY);
    });

    it('min-width', (done) => {
      const vm = createVue({
        template: `
          <tm-table :data="testData" :fit="false">
            <tm-table-column prop="name" :min-width="width"/>
          </tm-table>
        `,

        data() {
          return {
            width: 100
          };
        },

        created() {
          this.testData = getTestData();
        }
      }, true);

      setTimeout(() => {
        expect(vm.$el.querySelector('.tm-table__body col').getAttribute('width')).to.equal('100');
        vm.width = 200;
        setTimeout(() => {
          expect(vm.$el.querySelector('.tm-table__body col').getAttribute('width')).to.equal('200');
          destroyVM(vm);
          done();
        }, 100);
      }, DELAY);
    });

    it('fixed', (done) => {
      const vm = createVue({
        template: `
          <tm-table :data="testData">
            <tm-table-column :fixed="fixed" />
            <tm-table-column prop="release" />
            <tm-table-column prop="director" />
            <tm-table-column prop="runtime" />
          </tm-table>
        `,

        data() {
          return {
            fixed: false
          };
        },

        created() {
          this.testData = getTestData();
        }
      }, true);

      setTimeout(() => {
        expect(!vm.$el.querySelector('.tm-table__fixed')).to.be.true;
        vm.fixed = true;
        setTimeout(() => {
          expect(!!vm.$el.querySelector('.tm-table__fixed')).to.be.true;
          destroyVM(vm);
          done();
        }, 100);
      }, DELAY);
    });

    it('prop', (done) => {
      const vm = createVue({
        template: `
          <tm-table :data="testData">
            <tm-table-column :prop="prop" />
            <tm-table-column prop="release" />
            <tm-table-column prop="director" />
            <tm-table-column prop="runtime" />
          </tm-table>
        `,

        data() {
          return {
            prop: 'name'
          };
        },

        created() {
          this.testData = getTestData();
        }
      }, true);

      setTimeout(() => {
        let firstColumnContent = vm.$el.querySelector('.tm-table__body td .cell').textContent;
        let secondColumnContent = vm.$el.querySelector('.tm-table__body td:nth-child(2) .cell').textContent;
        expect(firstColumnContent !== secondColumnContent).to.be.true;
        vm.prop = 'release';
        setTimeout(() => {
          firstColumnContent = vm.$el.querySelector('.tm-table__body td .cell').textContent;
          secondColumnContent = vm.$el.querySelector('.tm-table__body td:nth-child(2) .cell').textContent;
          expect(firstColumnContent === secondColumnContent).to.be.true;
          destroyVM(vm);
          done();
        }, 100);
      }, DELAY);
    });
  });

  describe('methods', () => {
    const createTable = function(prop = '') {
      return createVue({
        template: `
          <tm-table ref="table" :data="testData" @${prop}="handleEvent">
            <tm-table-column type="selection" />
            <tm-table-column prop="name" />
            <tm-table-column prop="release" />
            <tm-table-column prop="director" />
            <tm-table-column prop="runtime"/>
          </tm-table>
        `,

        methods: {
          handleEvent(selection) {
            this.fireCount++;
            this.selection = selection;
          }
        },

        created() {
          this.testData = getTestData();
        },

        data() {
          return { selection: null, testData: this.testData, fireCount: 0 };
        }
      }, true);
    };

    it('toggleRowSelection', () => {
      const vm = createTable('selection-change');
      vm.$refs.table.toggleRowSelection(vm.testData[0]);
      expect(vm.selection).to.length(1);
      expect(vm.fireCount).to.equal(1);

      // test use second parameter
      vm.$refs.table.toggleRowSelection(vm.testData[0], true);
      expect(vm.fireCount).to.equal(1);

      vm.$refs.table.toggleRowSelection(vm.testData[0], false);
      expect(vm.fireCount).to.equal(2);
      expect(vm.selection).to.length(0);

      destroyVM(vm);
    });

    it('clearSelection', () => {
      const vm = createTable('selection-change');
      vm.$refs.table.toggleRowSelection(vm.testData[0]);
      expect(vm.selection).to.length(1);
      expect(vm.fireCount).to.equal(1);

      // clear selection
      vm.$refs.table.clearSelection();
      expect(vm.fireCount).to.equal(2);
      expect(vm.selection).to.length(0);

      vm.$refs.table.clearSelection();
      expect(vm.fireCount).to.equal(2);

      destroyVM(vm);
    });
  });

  it('hover', done => {
    const vm = createVue({
      template: `
        <tm-table :data="testData">
          <tm-table-column prop="name" label="片名" fixed />
          <tm-table-column prop="release" label="发行日期" />
          <tm-table-column prop="director" label="导演" />
          <tm-table-column prop="runtime" label="时长（分）" />
        </tm-table>
      `,

      created() {
        this.testData = getTestData();
      }
    }, true);
    setTimeout(() => {
      const tr = vm.$el.querySelector('.tm-table__body-wrapper tbody tr');
      triggerEvent(tr, 'mouseenter', true, false);
      setTimeout(() => {
        expect(tr.classList.contains('hover-row')).to.true;
        triggerEvent(tr, 'mouseleave', true, false);
        setTimeout(() => {
          expect(tr.classList.contains('hover-row')).to.false;
          destroyVM(vm);
          done();
        }, DELAY);
      }, DELAY);
    }, DELAY);
  });

  it('highlight-current-row', done => {
    const vm = createVue({
      template: `
        <tm-table :data="testData" highlight-current-row>
          <tm-table-column prop="name" label="片名" />
          <tm-table-column prop="release" label="发行日期" />
          <tm-table-column prop="director" label="导演" />
          <tm-table-column prop="runtime" label="时长（分）" />
        </tm-table>
      `,

      created() {
        this.testData = getTestData();
      }
    }, true);
    setTimeout(() => {
      const tr = vm.$el.querySelector('.tm-table__body-wrapper tbody tr');
      triggerEvent(tr, 'click', true, false);
      setTimeout(() => {
        expect(tr.classList.contains('current-row')).to.be.true;
        const rows = vm.$el.querySelectorAll('.tm-table__body-wrapper tbody tr');

        triggerEvent(rows[2], 'click', true, false);
        setTimeout(() => {
          expect(tr.classList.contains('current-row')).to.be.false;
          expect(rows[2].classList.contains('current-row')).to.be.true;
          destroyVM(vm);
          done();
        }, DELAY);
      }, DELAY);
    }, DELAY);
  });
});
