"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, getMe } from "@/services/auth.service";
import { addCredits } from "@/services/credit.service";
import styles from "./page.module.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAmounts, setAddAmounts] = useState<{ [key: string]: number }>({});
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const initAdmin = async () => {
      try {
        const res = await getMe();
        if (res.success && res.data) {
          if (res.data.role !== "admin") {
            router.push("/dashboard");
            return;
          }
          // If admin, load users
          loadUsers();
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        router.push("/dashboard");
      }
    };

    initAdmin();
  }, [router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async (userId: string) => {
    const amount = addAmounts[userId];
    if (!amount || amount <= 0) return;

    try {
      setProcessing((prev) => ({ ...prev, [userId]: true }));
      const res = await addCredits(userId, amount);
      if (res.success) {
        // Update locally
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, credits: u.credits + amount } : u
          )
        );
        // Clear input
        setAddAmounts((prev) => ({ ...prev, [userId]: 0 }));
      }
    } catch (error) {
      console.error("Failed to add credits:", error);
      alert("Failed to add credits");
    } finally {
      setProcessing((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleAmountChange = (userId: string, value: string) => {
    const num = parseInt(value, 10);
    setAddAmounts((prev) => ({
      ...prev,
      [userId]: isNaN(num) ? 0 : num,
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>Manage users and AI credits</p>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Current Credits</th>
                <th>Add Credits</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`${styles.roleBadge} ${
                        u.role === "admin" ? styles.roleAdmin : styles.roleUser
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{u.credits.toLocaleString()}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <input
                        type="number"
                        min="1"
                        placeholder="Amount"
                        className={styles.input}
                        value={addAmounts[u.id] || ""}
                        onChange={(e) =>
                          handleAmountChange(u.id, e.target.value)
                        }
                        disabled={processing[u.id]}
                      />
                      <button
                        className={styles.btn}
                        onClick={() => handleAddCredits(u.id)}
                        disabled={
                          processing[u.id] ||
                          !addAmounts[u.id] ||
                          addAmounts[u.id] <= 0
                        }
                      >
                        {processing[u.id] ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
