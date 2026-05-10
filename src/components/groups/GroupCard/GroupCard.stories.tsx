import type { Meta, StoryObj } from '@storybook/react';
import GroupCard from './GroupCard';
import type { Group, GroupMember } from '../../../types';

const meta = {
  title: 'Groups/GroupCard',
  component: GroupCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GroupCard>;

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

const baseGroup: Group = {
  id: 'g1',
  name: 'Movie Night Crew',
  created_by: 'u1',
  created_at: '2024-01-01T00:00:00Z',
  members: [
    makeMember('Sarah Johnson', 'u1'),
    makeMember('Ali Hassan', 'u2'),
    makeMember('Priya Patel', 'u3'),
  ],
};

export const Default: Story = { args: { group: baseGroup } };

export const SingleMember: Story = {
  args: { group: { ...baseGroup, members: [makeMember('Sarah Johnson', 'u1')] } },
};

export const ManyMembers: Story = {
  args: {
    group: {
      ...baseGroup,
      members: [
        makeMember('Sarah Johnson', 'u1'),
        makeMember('Ali Hassan', 'u2'),
        makeMember('Priya Patel', 'u3'),
        makeMember('Tom Kim', 'u4'),
        makeMember('Elena Ruiz', 'u5'),
      ],
    },
  },
};

export const LongName: Story = {
  args: { group: { ...baseGroup, name: 'Friday Night Movie Extravaganza with the Whole Gang' } },
};
