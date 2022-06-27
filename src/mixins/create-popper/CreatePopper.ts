import Vue from 'vue';
import { Ref, Component } from 'vue-property-decorator';
const stop = (e: Event) => e.stopPropagation();

/**
 * CreatePopper 
 * - 用于动态创建popper组件
 * - 封装了动态创建方法，popper组件开发者无需绑定 reference 
 * - 只需在调用时动态传入充当reference的DOM节点
 * 
 * @author QYS、猫港鱼未归
 * @time 2020/03/04
 * @description  用于动态创建popper组件
 */

@Component({})
export class CreatePopperMixin extends Vue {
    /**
     * 当前popper组件的 ref 
     * - 用户必须写 否则无法调用
     * - template 中 ref 值固定为 popper
     */
    @Ref('popper')
    refPopover!: any;

    /**
     * 生成 popper 组件实例
     * @param target 触发popper的元素 用户传入
     */
    createPopper(target: Element) {
        try {
            if (target === this.refPopover.referenceElm) {
                this.triggerPopper();
            } else if (this.refPopover.referenceElm) {
                this.refPopover.referenceElm = target;
                this.refPopover.createPopper();
            } else {
                this.refPopover.referenceElm = target;
                this.refPopover.createPopper();
                this.triggerPopper();
            }
        } catch (error) {
            this.$message.error(new Error('请检查是否按照组件要求 配置 ref'))
        }
    }

    /** 触发Element popper组件显隐 */
    triggerPopper(e?: any) {
        if(this.refPopover) {
            this.refPopover.showPopper = !this.refPopover?.showPopper;
        }
        if(this.refPopover?.showPopper) {
            this.addEventListener();
        } else {
            this.removeEventListener();
        }
    }

    /** 事件监听 */
    addEventListener() {
        this.refPopover.referenceElm.addEventListener('click', stop);
        document.addEventListener('click', this.triggerPopper);
    }

    /** 销毁 */
    doDestory() {
        this.removeEventListener();
    }

    /** 移除事件监听 */
    removeEventListener() {
        this.refPopover?.referenceElm?.removeEventListener?.('click', stop);
        document.removeEventListener('click', this.triggerPopper);
        this.refPopover.referenceElm = null;
    }
}

