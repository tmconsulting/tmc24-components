import { createVue, destroyVM } from '../util';

describe('Dialog', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', done => {
    vm = createVue({
      template: `
        <div>
          <tm-dialog :title="title" :visible="visible"></tm-dialog>
        </div>
      `,

      data() {
        return {
          title: 'dialog test',
          visible: true
        };
      }
    }, true);
    const dialog = vm.$children[0];
    setTimeout(() => {
      expect(document.querySelector('.v-modal')).to.exist;
      expect(vm.$el.querySelector('.tm-dialog__title').textContent).to.equal('dialog test');
      expect(dialog.$el.style.display).to.not.equal('none');
      done();
    }, 10);
  });

  it('render correct content', done => {
    vm = createVue({
      template: `
        <div>
          <tm-dialog :title="title" :visible="visible">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <tm-button @click.native="dialogVisible = false">取消</tm-button>
              <tm-button type="primary" @click.native="dialogVisible = false">确定</tm-button>
            </span>
          </tm-dialog>
        </div>
      `,

      data() {
        return {
          title: 'dialog test',
          visible: true
        };
      }
    }, true);
    setTimeout(() => {
      const footerBtns = vm.$el.querySelectorAll('.tm-dialog__footer .tm-button');
      expect(vm.$el.querySelector('.tm-dialog__body span').textContent).to.equal('这是一段信息');
      expect(footerBtns.length).to.equal(2);
      expect(footerBtns[0].querySelector('span').textContent).to.equal('取消');
      expect(footerBtns[1].querySelector('span').textContent).to.equal('确定');
      done();
    }, 100);
  });

  it('append to body', done => {
    vm = createVue({
      template: `
        <div>
          <tm-dialog :title="title" append-to-body :visible="visible"></tm-dialog>
        </div>
      `,

      data() {
        return {
          title: 'dialog test',
          visible: true
        };
      }
    }, true);
    const dialog = vm.$children[0];
    setTimeout(() => {
      expect(dialog.$el.parentNode).to.equal(document.body);
      done();
    }, 10);
  });

  it('open and close', done => {
    vm = createVue({
      template: `
        <div>
          <tm-dialog :title="title" :visible.sync="visible">
            <span>这是一段信息</span>
          </tm-dialog>
        </div>
      `,

      data() {
        return {
          title: 'dialog test',
          visible: false
        };
      }
    }, true);
    const dialog = vm.$children[0];
    expect(dialog.$el.style.display).to.equal('none');
    vm.visible = true;
    setTimeout(() => {
      expect(dialog.$el.style.display).to.not.equal('none');
      vm.visible = false;
      setTimeout(() => {
        expect(dialog.$el.style.display).to.equal('none');
        done();
      }, 400);
    }, 50);
  });

  describe('props', () => {
    const getDialogVm = (props, options) => {
      return createVue(Object.assign({
        template: `
          <div>
            <tm-dialog ${ props } :title="title" :visible="visible">
              <span>这是一段信息</span>
            </tm-dialog>
          </div>
        `,

        data() {
          return {
            title: 'dialog test',
            visible: true
          };
        }
      }, options), true);
    };

    it('fullscreen', () => {
      vm = getDialogVm('fullscreen');
      expect(vm.$el.querySelector('.tm-dialog').classList.contains('is-fullscreen')).to.true;
    });

    it('top', () => {
      vm = getDialogVm('top="100px"');
      expect(vm.$el.querySelector('.tm-dialog').style.marginTop).to.equal('100px');
    });

    it('custom-class', () => {
      vm = getDialogVm('custom-class="my-dialog"');
      expect(vm.$el.querySelector('.tm-dialog').classList.contains('my-dialog')).to.true;
    });
  });

  it('events', done => {
    vm = createVue({
      template: `
        <div>
          <tm-dialog
            @open="handleOpen"
            @close="handleClose"
            :title="title"
            :visible.sync="visible">
            <span>这是一段信息</span>
          </tm-dialog>
        </div>
      `,

      methods: {
        handleOpen() {
          this.state = 'open';
        },

        handleClose() {
          this.state = 'closed';
        }
      },

      data() {
        return {
          state: '',
          title: 'dialog test',
          visible: false
        };
      }
    }, true);
    vm.visible = true;
    setTimeout(() => {
      expect(vm.state).to.equal('open');
      vm.visible = false;
      setTimeout(() => {
        expect(vm.state).to.equal('closed');
        done();
      }, 50);
    }, 50);
  });
});
