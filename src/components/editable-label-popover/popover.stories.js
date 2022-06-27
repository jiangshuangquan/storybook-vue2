import MyPopover from './editable-label-popover.vue';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'MyPopover',
  component: MyPopover,
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { MyPopover },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<my-popover v-bind="args" />',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
  text: '测试',
};
