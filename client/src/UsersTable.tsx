import React from "react";
import { Table, IconButton, Text } from "@radix-ui/themes";
import { DropdownMenu } from "radix-ui";
import { groupBy } from "lodash";
import { User, Role } from "../../server/src/models";
import { formatDate } from "./apiUtils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export const UsersTable = ({
  isLoading,
  users,
  roles,
  onDeleteUser,
}: {
  isLoading: boolean;
  users: User[];
  roles: Role[];
  onDeleteUser: (id: string) => void;
}) => {
  const rolesById = groupBy(roles, "id");

  return (
    <Table.Root variant="surface" size="2">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell style={{ width: "33%" }}>User</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ width: "33%" }}>Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ width: "33%" }}>Joined</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {isLoading && (
          <Table.Row>
            <Table.Cell colSpan={2}>
              <Text align="center" size="2" color="gray">
                Loading...
              </Text>
            </Table.Cell>
          </Table.Row>
        )}
        {users &&
          users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img
                    src={user.photo}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span>
                    {user.first} {user.last}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>{rolesById[user.roleId]?.[0].name}</Table.Cell>
              <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <IconButton variant="ghost" size="1" radius="full">
                      <DotsHorizontalIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content sideOffset={5} className="DropdownMenuContent">
                    <DropdownMenu.Item
                      className="DropdownMenuItem"
                      onSelect={() => console.log("Edit", user.id)}
                    >
                      Edit user
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="DropdownMenuItem"
                      onSelect={() => onDeleteUser(user.id)}
                    >
                      Delete user
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};
