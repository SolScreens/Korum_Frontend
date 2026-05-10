import type { Meta, StoryObj } from '@storybook/react';
import ProgressDots from './ProgressDots';

const meta = {
  title: 'Shared/ProgressDots',
  component: ProgressDots,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1: Story = { args: { total: 3, current: 0 } };
export const Step2: Story = { args: { total: 3, current: 1 } };
export const Step3: Story = { args: { total: 3, current: 2 } };
export const TwoSteps: Story = { args: { total: 2, current: 0 } };
export const FiveSteps: Story = { args: { total: 5, current: 2 } };
