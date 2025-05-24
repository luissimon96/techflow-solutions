import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof Logo> = {
  title: 'Common/Logo',
  component: Logo,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {},
}; 