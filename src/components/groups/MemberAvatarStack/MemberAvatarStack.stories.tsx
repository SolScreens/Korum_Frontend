import type { Meta, StoryObj } from '@storybook/react';
import MemberAvatarStack from './MemberAvatarStack';
import type { GroupMember } from '../../../types';

const meta = {
  title: 'Groups/MemberAvatarStack',
  component: MemberAvatarStack,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MemberAvatarStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeMember = (name: string, id: string): GroupMember => ({
  id: `m-${id}`,
  user_id: id,
  group_id: 'g1',
  role: 'member',
  joined_at: '2024-01-01T00:00:00Z',
  user: { id, email: `${id}@test.com`, display_name: name, avatar_url: null, created_at: '' },
});

const members = [
  makeMember('Sarah Johnson', 'u1'),
  makeMember('Ali Hassan', 'u2'),
  makeMember('Priya Patel', 'u3'),
  makeMember('Tom Kim', 'u4'),
  makeMember('Elena Ruiz', 'u5'),
];

export const OneMember: Story = { args: { members: members.slice(0, 1) } };
export const ThreeMembers: Story = { args: { members: members.slice(0, 3) } };
export const Overflow: Story = { args: { members, max: 3 } };
export const ExactMax: Story = { args: { members: members.slice(0, 4), max: 4 } };
