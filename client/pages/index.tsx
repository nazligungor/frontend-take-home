import React, { useState, useCallback, useMemo } from "react";
import { Text, Theme, TextField, Button, Flex } from "@radix-ui/themes";
import { Tabs, Toast } from "radix-ui";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { useUsers, useRoles, useUserSearch, deleteUser } from "../src/apiUtils";
import { EditRoleDialog } from "../src/EditRoleDialog";
import { UsersTable } from "../src/UsersTable";
import { RolesTable } from "../src/RolesTable";

function MainApp() {
    const [query, setQuery] = useState("");
    const { users, loading: usersLoading, page, next, fetchPage } = useUsers();
    const { roles, loading: rolesLoading, refetch: refetchRoles } = useRoles();
    const { results, search, loading: searchLoading } = useUserSearch();

    const goToNextPage = () => {
        if (next) fetchPage(next);
    };

    const goToPrevPage = () => {
        if (page > 1) fetchPage(page - 1);
    };

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [openRoleEdit, setOpenRoleEdit] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        search(value);
    };

    const showUsers = useMemo(() => (query !== "" ? results : users), [results, users]);
    const isLoading = (usersLoading || searchLoading || rolesLoading) && showUsers.length === 0;

    const onDeleteUser = useCallback(
        async (id: string) => {
            const success = await deleteUser(id);
            if (success) {
                await fetchPage(page);
                setToastMessage("User deleted");
                setToastOpen(true);
            }
        },
        [fetchPage]
    );

    const onEditRoleSuccess = useCallback(async () => {
        await refetchRoles();
        setToastMessage("Role edited");
        setToastOpen(true);
    }, [refetchRoles]);

    return (
        <div className="App">
            <Theme>
                <Tabs.Root className="TabsRoot" defaultValue="user">
                    <Tabs.List className="TabsList" aria-label="Manage your account">
                        <Tabs.Trigger className="TabsTrigger" value="user">
                            User
                        </Tabs.Trigger>
                        <Tabs.Trigger className="TabsTrigger" value="roles">
                            Roles
                         </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="user">
                        <div className="TextField">
                            <TextField.Root
                                className="SearchBar"
                                value={query}
                                onChange={handleChange}
                                placeholder="Search users..."
                            >
                                <TextField.Slot>
                                    <MagnifyingGlassIcon height="16" width="16" />
                                </TextField.Slot>
                            </TextField.Root>
                            <Button className="Button">
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <PlusIcon height="16" width="16" />{" "}
                                    <Text style={{ fontSize: "14px" }}>Add user</Text>
                                </div>
                            </Button>
                        </div>

                        <UsersTable
                            isLoading={isLoading}
                            users={showUsers}
                            roles={roles}
                            onDeleteUser={onDeleteUser}
                        />
                        <Flex justify="end" align="center" gap="2" mt="4">
                            <Button onClick={goToPrevPage} disabled={page === 1}>
                                Previous
                            </Button>
                            <Button onClick={goToNextPage} disabled={!next}>
                                Next
                            </Button>
                        </Flex>
                    </Tabs.Content>

                    <Tabs.Content value="roles">
                        <RolesTable
                            roles={roles}
                            rolesLoading={rolesLoading}
                            onEditRole={(id) => {
                                setOpenRoleEdit(true);
                                setSelectedRoleId(id);
                            }}
                        />
                        <EditRoleDialog
                            open={openRoleEdit}
                            onOpenChange={setOpenRoleEdit}
                            roleId={selectedRoleId}
                            onEditRoleSuccess={onEditRoleSuccess}
                        />
                    </Tabs.Content>
                </Tabs.Root>

                <Toast.Provider swipeDirection="right">
                    <Toast.Root className="ToastRoot" open={toastOpen} onOpenChange={setToastOpen}>
                        <Toast.Description>{toastMessage}</Toast.Description>
                    </Toast.Root>
                    <Toast.Viewport className="ToastViewport" />
                </Toast.Provider>
            </Theme>
        </div>
    );
}

export default MainApp;
