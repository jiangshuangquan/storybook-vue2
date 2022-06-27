<template>
    <div class="radio-dropdown-container">
        <el-select
            ref="select"
            v-model="value"
            size="small"
            :class="{ 'radio-dropdown': true, 'in-body': !container }"
            popper-class="radio-dropdown-popper"
            :popper-append-to-body="false"
            :automatic-dropdown="true"
            @change="handleOptionChange"
            @visible-change="handleVisibleChange"
        >
            <el-option
                v-for="(item, index) in options"
                :key="`${item}${index}`"
                :label="item"
                :value="item"
                :disabled="disabled"
            />
        </el-select>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

import ElSelectModifier from '@/packages/element-ui/el-select.vue';

@Component({})
export default class RadioSelect extends Vue {
    @Prop() disabled!: boolean;

    @Prop() valueChange?: (arg: string) => void;

    @Ref('select') selectRef?: ElSelectModifier;

    value = '';

    options: string[] = [];

    container: HTMLElement | null = null;

    handleVisibleChange(visible: boolean) {
        if (!visible) {
            this.container?.querySelector('i')?.classList.remove('expand');
            this.container = null;
            document.body.appendChild(this.$el);
        }

        let frElement = document.querySelector('.html-edit-mode') as HTMLDivElement;
        !frElement &&
            (frElement = document.querySelector('.param-document-html-main .html-fill-mode') as HTMLDivElement);
        if (!frElement) {
            return;
        }

        // 防止下拉框打开时，下拉选项被遮住
        frElement.style.overflowX = visible ? 'initial' : 'auto';
    }

    handleOptionChange(val: string) {
        typeof this.valueChange === 'function' && this.valueChange(val);
    }

    toggleShow(container: HTMLElement, options: string[], value = '') {
        // 展开
        if (!this.container) {
            container.appendChild(this.$el);
            container.querySelector('i')?.classList.add('expand');
            this.options = options;
            this.container = container;
            this.value = value;
            this.selectRef?.focus();

            // 选项的内容过多，导致占据多行
            // 点击时，保证下拉框在最后一行的下面
            setTimeout(() => {
                const el = document.querySelector<HTMLElement>('.radio-dropdown-popper');

                if (!el) {
                    return;
                }

                el.style.top = parseFloat(el.style.top) + container.offsetHeight - 30 + 'px';
            });
        }
        // 折叠
        else {
            this.container.querySelector('i')?.classList.remove('expand');
            // 打开另一个下拉框
            if (this.container !== container) {
                setTimeout(() => this.toggleShow(container, options, value));
            }
            this.selectRef?.blur();
        }
    }

    handleSelectBlur() {
        // 反选
        typeof this.valueChange === 'function' && this.valueChange('');

        _.delay(() => {
            this.selectRef?.blur();
        }, 300);
    }

    // 下拉框在表格中时，要阻止事件的进一步传播
    handleStopPropagation(e: Event) {
        if (
            // @ts-ignore
            (e.path as HTMLElement[]).some(
                el =>
                    el?.className?.includes('radio-dropdown-popper')
            )
        ) {
            return;
        }

        e.stopPropagation();
    }

    mounted() {
        this.$el.addEventListener('click', this.handleStopPropagation, true);
        this.$el.querySelector('.radio-dropdown-popper')?.addEventListener('click', this.handleSelectBlur, true);
    }

    beforeDestroy() {
        this.$el.removeEventListener('click', this.handleStopPropagation, true);
        this.$el.querySelector('.radio-dropdown-popper')?.removeEventListener('click', this.handleSelectBlur, true);
    }

    destroy() {
        this.$destroy();
        this.$el.parentElement?.removeChild(this.$el);
    }
}
</script>

<style lang="less" scoped>
.radio-dropdown {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    &.in-body {
        z-index: -9999;
    }
}
</style>
<style lang="less">
[data-qys-type='radio'][data-layout='dropdown'] {
    i {
        transition: all 300ms 50ms;
        transform-origin: center;
        &.expand {
            transform: rotateZ(180deg);
        }
    }
}
.radio-dropdown {
    .el-input {
        opacity: 0;
    }

    .el-input__inner {
        cursor: pointer !important;
    }
    .radio-dropdown-popper {
        position: absolute !important;
        left: 0 !important;
    }
}
</style>
