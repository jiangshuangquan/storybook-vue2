<template>
    <div class="select-panel">
        <div
            v-if="filter"
            class="filter-wrapper"
        >
            <el-input
                size="small"
                v-model="keywords"
                :placeholder="filterPlaceholder"
            ></el-input>
        </div>
        <div
            class="el-select-dropdown is-multiple"
            v-if="filteredOptions.length && !loading"
        >
            <div class="el-select-dropdown__wrap">
                <div class="el-select-dropdown__list">
                    <template v-if="additions && additions.length">
                        <div
                            v-for="item of additions"
                            :class="['el-select-dropdown__item', {'is-slot': $scopedSlots.item, 'selected': calcSelected(item.value)}]"
                            :key="`addition-${item.value}`"
                            @click="handleItemClick(item.value)"
                        >
                            <template v-if="$scopedSlots.addition">
                                <slot
                                    name="addition"
                                    :data="item"
                                ></slot>
                            </template>
                            <template v-else>{{item.label}}</template>
                        </div>
                        <el-divider></el-divider>
                    </template>
                    <template v-for="(item,index) of filteredOptions">
                        <div
                            v-if="item !== 'DIVIDER'"
                            :class="['el-select-dropdown__item', {'is-slot': $scopedSlots.item, 'selected': calcSelected(item.value)}]"
                            :key="item.value"
                            @click="handleItemClick(item.value)"
                        >
                            <template v-if="$scopedSlots.item">
                                <slot
                                    name="item"
                                    :data="item"
                                ></slot>
                            </template>
                            <template v-else>{{item.label}}</template>
                        </div>
                        <el-divider
                            v-else
                            :key="index"
                        ></el-divider>
                    </template>
                </div>
            </div>
        </div>
        <div
            v-if="loading"
            class="loading"
        ><i class="el-icon-loading"></i>加载中</div>
        <div
            v-else-if="!options.length"
            class="blank"
        >
            暂无可用选项
        </div>
        <div
            v-else-if="keywords && !filteredOptions.length"
            class="blank"
        >
            无搜索结果
        </div>
    </div>
</template>
<script>
import TwoWay from '../../mixins/two-way-js';

export default {
  mixins: [TwoWay],
  props: {
    options: {
      default: () => [],
    },
    additions: {
      default: () => [],
    },
    filter: {
      type: Boolean,
      default: false,
    },
    multi: {
      type: Boolean,
      default: false,
    },
    loading: Boolean,
    filterPlaceholder: {
      default: () => '检索',
    },
  },
  data() {
    return {
      keywords: '',
    };
  },
  computed: {
    filteredOptions() {
      if (this.keywords) { return this.options.filter((item) => item.label !== undefined && item.label.search(this.keywords) > -1); }
      return this.options;
    },
  },
  methods: {
    handleItemClick(value) {
      if (!this.multi) {
        if (this.currentValue === value) {
          this.currentValue = '';
        } else {
          this.currentValue = value;
        }
      } else if (this.currentValue.includes(value)) {
        this.currentValue.splice(this.currentValue.findIndex((item) => item === value), 1);
      } else {
        this.currentValue.push(value);
      }
    },
    calcSelected(value) {
      if (!this.multi) return this.currentValue === value;
      return this.currentValue.includes(value);
    },
  },
  watch: {
    currentValue: {
      handler() {
        this.$emit('change');
      },
      deep: true,
    },
  },
};
</script>
<style lang="less">
.select-panel {
    user-select: none;

    .filter-wrapper {
        padding: 16px 16px 0;
    }
    .el-select-dropdown {
        position: relative;
        margin: 8px 0;
        overflow-y: auto;
        box-shadow: none;
        border: none;

        .el-select-dropdown__list {
            padding: 0;
            .el-select-dropdown__item {
                padding: 0 32px 0 16px;

                &.selected {
                    font-weight: normal;

                    &::after {
                        right: 16px;
                    }
                }

                &.is-slot {
                    height: auto;

                    &.selected::after {
                        top: 0;
                    }
                }
            }

            .el-divider--horizontal {
                width: auto;
                margin: 8px 16px;
            }
        }
    }

    .loading,
    .blank {
        color: @color-text-placeholder;
        text-align: center;
        line-height: 64px;

        i {
            margin-right: 8px;
        }
    }
}
</style>
