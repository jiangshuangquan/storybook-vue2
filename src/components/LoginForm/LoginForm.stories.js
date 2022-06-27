// LoginForm.stories.js

import { userEvent, within } from '@storybook/testing-library';

import { expect } from '@storybook/jest';

import LoginForm from './LoginForm.vue';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Form',
  component: LoginForm,
};

const Template = (args, { argTypes }) => ({
  components: { LoginForm },
  props: Object.keys(argTypes),
  template: '<LoginForm v-bind="$props" v-on="$props" />',
});

export const EmptyForm = Template.bind({});

export const FilledForm = Template.bind({});
FilledForm.play = async ({ canvasElement }) => {
  // Starts querying the component from its root element
  const canvas = within(canvasElement);
  console.log(canvas);

  // 👇 Simulate interactions with the component
  await userEvent.type(canvas.getByTestId('first'), 'email@provider.com');

  await userEvent.type(canvas.getByTestId('secound'), 'a-random-password');

  // See https://storybook.js.org/docs/vue/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
  await userEvent.click(canvas.getByRole('button'));

  // 👇 Assert DOM structure
  await expect(
    canvas.getByText(
      '年龄不能为空',
    ),
  ).toBeInTheDocument();
};
