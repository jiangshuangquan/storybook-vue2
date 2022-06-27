<!-- 自定义 气泡组件实例 -->
<template>
    <el-popover
        :popper-class="`common-mixins-popover${ $attrs['popper-class'] ? ' ' + $attrs['popper-class'] : '' }`"
        ref="popper"
        v-bind="{ ...$attrs }"
    >
        <slot></slot>
    </el-popover>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { CreatePopperMixin } from '@/mixins/create-popper/CreatePopper';


@Component({
    name: 'CommonMixinsPopover',
    inheritAttrs: false
})
export default class CommonMixinsPopover extends Mixins(CreatePopperMixin) {

}
</script>
<style lang="less" scoped>
.confirm-bar {
    width: 100%;
}
</style>
