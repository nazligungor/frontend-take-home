import { useEffect, useState, useCallback } from "react";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState<number | null>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    const res = await fetch(`http://localhost:3002/users?page=${pageNum}`);
    const json = await res.json();
    setUsers(json.data);
    setNext(json.next); // This tells us if there's a next page
    setPage(pageNum);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPage(1); // initial fetch
  }, [fetchPage]);

  return {
    users,
    loading,
    page,
    next,
    fetchPage,
  };
}

export function useRoles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    let result: any[] = [];
    let page = 1;
    let next: number | null = 1;

    while (next) {
      const res = await fetch(`http://localhost:3002/roles?page=${page}`);
      const json = await res.json();
      result = result.concat(json.data);
      next = json.next;
      page = next || 0;
    }

    setRoles(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, loading, refetch: fetchRoles };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function useUserSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(query: string) {
    setLoading(true);
    const res = await fetch(`http://localhost:3002/users?search=${encodeURIComponent(query)}`);
    const json = await res.json();
    setResults(json.data);
    setLoading(false);
  }

  return { results, search, loading };
}

export async function deleteUser(id: string): Promise<boolean> {
  const res = await fetch(`http://localhost:3002/users/${id}`, {
    method: "DELETE",
  });

  return res.ok;
}

export async function updateRoleName(id: string, newName: string): Promise<boolean> {
  const res = await fetch(`http://localhost:3002/roles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  });

  return res.ok;
}
