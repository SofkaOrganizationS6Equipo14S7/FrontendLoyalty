import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { usersService, ecommercesService, rolesService } from '@/infrastructure/api';
import { normalizeText } from '@/lib/utils';
import type { UserResponse, EcommerceResponse, RoleResponse } from '@/domain/types';

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
  const [roles, setRoles] = useState<RoleResponse[]>([]);
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
      const [res, ecomRes, rolesRes] = await Promise.all([
        usersService.list({ page, size: PAGE_SIZE }),
        ecommercesService.list().catch(() => ({ content: [] })),
        rolesService.list().catch(() => []),
      ]);
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
      setEcommerces(ecomRes.content || []);
      setRoles(rolesRes || []);
    } catch {
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = users.filter((u) => normalizeText(u.username).includes(normalizeText(search)));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        await usersService.update(editingUser.uid, {
          username: form.username,
          email: form.email,
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
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Error saving user';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u: UserResponse) => {
    try {
      await usersService.update(u.uid, { active: !u.isActive });
      toast.success(u.isActive ? 'User deactivated' : 'User activated');
      load();
    } catch {
      toast.error('Error updating user status');
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
    filtered, ecommerces, roles, loading, search, setSearch,
    page, setPage, totalPages, totalElements, PAGE_SIZE,
    showModal, setShowModal, editingUser, form, setForm, saving,
    openCreate, openEdit, handleSave,
    handleToggleActive,
    deleteTarget, setDeleteTarget, handleDelete,
  };
}
