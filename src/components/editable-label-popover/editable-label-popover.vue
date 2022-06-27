<template>
    <div :class="['editable-label-popover', { 'ellipsis-mode': ellipsis }]">
        <span
            class="text"
            :style="acceptTextStyle"
        >
            {{ text }}
        </span>

        <el-popover
            v-if="!hiddenEdit"
            v-model="popoverVisible"
            placement="bottom"
            width="220"
            trigger="manual"
            popper-class="editable-label-popover-popper"
            @show="onPopoverShow"
        >
            <qys-icon-button
                slot="reference"
                ref="btn"
                class="btn-edit"
                icon-class="icon-pencil"
                @click.native.stop="() => popoverVisible = true"
            />

            <div
                v-click-outside="closePopover"
                class="popover-content"
            >
                <el-input
                    ref="input"
                    v-model="temp"
                    type="textarea"
                    size="small"
                    show-word-limit
                    :maxlength="inputMaxlength"
                    :placeholder="inputPlaceholder"
                    :rows="1"
                    :autosize="{ minRows: 1, maxRows: 4 }"
                    @keydown.native.enter="doSubmit"
                />
                <div class="btns">
                    <el-button
                        size="mini"
                        type="text"
                        @click="popoverVisible = false"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="!temp"
                        :loading="submitLoading"
                        @click="doSubmit"
                    >
                        确定
                    </el-button>
                </div>
            </div>
        </el-popover>
    </div>
</template>
<script lang="ts">
import type { ElInput } from 'element-ui/types/input';
import {
  Vue, Component, Prop, Ref, Watch,
} from 'vue-property-decorator';

import _ from 'lodash';
import QysIconButton from '../qys-icon-button/index.vue';

@Component
export default class EditableLabelPopover extends Vue {
    @Prop({
      type: Boolean,
    })
    hiddenEdit!: boolean;

    @Prop({
      type: Boolean,
    })
    ellipsis!: boolean;

    @Prop()
    text!: string;

    /**
     * ### 文字的样式
     *
     * 会对样式进行过滤，仅接受以下属性：
     * - fontSize
     * - lineHeight
     * - color
     * - fontWeight
     * - fontStyle
     */
    @Prop()
    textStyle!: Pick<CSSStyleDeclaration, 'fontSize' | 'lineHeight' | 'color' | 'fontWeight' | 'fontStyle'>;

    @Prop()
    inputMaxlength!: number;

    @Prop({
      default: () => '请输入',
    })
    inputPlaceholder!: string;

    /**
     * 处理名称修改的函数
     *
     * - 接受一个形参text，此形参为修改后的值，在执行时会代入当前输入框的value
     * - 需要返回一个Promise，在函数执行前会添加loading覆盖层，在Promise resolve时关闭弹框，在reject时保留弹框但移除覆盖层
     * - 其他的后续操作（例如刷新页面数据）可直接在传入的handler的then中执行，与本组件内部逻辑互不干扰
     */
    @Prop()
    handler!: (text: string) => Promise<any>;

    temp = '';

    popoverVisible = false;

    submitLoading = false;

    io: IntersectionObserver | null = null;

    @Ref('input')
    refInput!: ElInput;

    @Ref('btn')
    refBtn!: QysIconButton;

    /**
     * 过滤后的属性
     */
    get acceptTextStyle() {
      return _.pick(this.textStyle as CSSStyleDeclaration, ['fontSize', 'lineHeight', 'color', 'fontWeight', 'fontStyle']);
    }

    onPopoverShow() {
      this.temp = this.text;

      this.$nextTick(() => {
        // this.refInput?.focus();
      });
    }

    doSubmit() {
      if (this.temp === this.text) {
        this.popoverVisible = false;
        return;
      }

      this.submitLoading = true;
    }

    openPopover() {
      this.popoverVisible = true;
    }

    closePopover() {
      this.popoverVisible = false;
    }

    /**
     * 开始 IntersectionObserver
     */

    mounted() {
      this.io = new IntersectionObserver(
        (entries) => {
          const { intersectionRatio } = entries[0];
        },
        {
          threshold: [0, 1],
        },
      );
    }

    @Watch('hiddenEdit')
    watcherHiddenEdit(newVal: boolean) {
      if (!newVal) {
        this.popoverVisible = false;
      }
    }
}
</script>
<style lang="less">
// .editable-label-popover {
//     .ellipsis-mode {
//         // .flex(flex-start);

//         .text {
//             display: inline-block;
//             max-width: 100%;
//             // .ellipsis();
//         }

//         .btn-edit {
//             margin-left: 4px;
//         }
//     }

//     .btn-edit {
//         i {
//             color: @color-info !important;
//         }
//     }
// }

// .editable-label-popover-popper {
//     .popover-content {
//         textarea {
//             resize: none;
//         }

//         .btns {
//             margin-top: 16px;
//             text-align: right;
//         }
//     }
// }
</style>
