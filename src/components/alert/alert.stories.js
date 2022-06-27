import { action } from '@storybook/addon-actions';
import myAlert from './main.vue';

export default {
  title: 'myAlert',
  component: myAlert,
  argTypes: {
    close: { action: 'close' },
  },
};

const Template = (args, { argTypes }) => ({
  components: { myAlert },
  props: Object.keys(argTypes),
  template: '<my-alert @close="close" v-bind="$props" />',
});

export const Success = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Success.args = {
  title: '成功提示的文案',
  type: 'success',
};

export const Info = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Info.args = {
  title: '消息提示的文案',
  type: 'info',
};

export const warning = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
warning.args = {
  title: '警告提示的文案',
  type: 'warning',
};

export const error = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
error.args = {
  title: '错误提示的文案',
  type: 'error',
};
