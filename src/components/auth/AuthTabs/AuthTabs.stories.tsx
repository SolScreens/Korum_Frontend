import type { Meta, StoryObj } from '@storybook/react';
import AuthTabs from './AuthTabs';

const meta = {
  title: 'Auth/AuthTabs',
  component: AuthTabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { onChange: () => {} },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginActive: Story = { args: { activeTab: 'login' } };
export const SignupActive: Story = { args: { activeTab: 'signup' } };
