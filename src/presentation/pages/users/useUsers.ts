import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { usersService, ecommercesService } from '@/infrastructure/api';
import type { UserResponse, EcommerceResponse } from '@/domain/types';

interface UserFormState {
  username: string;
  email: string;
  password: string;
  roleId: string;
  ecommerceId: string;
}

const EMPTY_FORM: UserFormState = { username: '', email: '', password: '', roleId: '', ecommerceId: '' };
const PAGE_SIZE = 5;

export function useUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [ecommerces, setEcommerces] = useState<EcommerceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, ecomRes] = await Promise.all([
        usersService.list({ page, size: PAGE_SIZE }),
        ecommercesService.list().catch(() => ({ content: [] })),
      ]);
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
      setEcommerces(ecomRes.content || []);
    } catch {
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        await usersService.update(editingUser.uid, {
          username: form.username,
          email: form.email,
          roleId: form.roleId,
          ecommerceId: form.ecommerceId || undefined,
        });
        toast.success('User updated');
      } else {
        await usersService.create({
          username: form.username,
          email: form.email,
          password: form.password,
          roleId: form.roleId,
          ecommerceId: form.ecommerceId || undefined,
        });
        toast.success('User created');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Error saving user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await usersService.delete(deleteTarget.uid);
      toast.success('User deleted');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Error deleting user');
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (u: UserResponse) => {
    setEditingUser(u);
    setForm({ username: u.username, email: u.email || '', password: '', roleId: u.roleId, ecommerceId: u.ecommerceId || '' });
    setShowModal(true);
  };

  return {
    filtered, ecommerces, loading, search, setSearch,
    page, setPage, totalPages, totalElements, PAGE_SIZE,
    showModal, setShowModal, editingUser, form, setForm, saving,
    openCreate, openEdit, handleSave,
    deleteTarget, setDeleteTarget, handleDelete,
  };
}
