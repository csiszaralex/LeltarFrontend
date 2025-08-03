'use client';
import Modal from '@/app/components/Modal';
import { apiFetch } from '@/lib/api';
import { Label } from '@radix-ui/react-label';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowAltCircleRight, FaBuilding, FaEdit, FaPlus, FaTrash, FaUser } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Owner } from '../types/owner.type';
import { Nullable } from '../types/utils.type';

export default function OwnersPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Nullable<Owner>>(null);
  const [ownerToDelete, setOwnerToDelete] = useState<Nullable<Owner>>(null);
  const [formData, setFormData] = useState({ name: '', type: 'PERSON' });
  const [error, setError] = useState<Nullable<string>>(null);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    const data = await apiFetch<Owner[]>('/owner');
    if (data.ok) {
      setOwners(data.data);
    } else {
      setError(data.error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!ownerToDelete) return;
    const res = await apiFetch(`/owner/${ownerToDelete.id}`, { method: 'DELETE' });
    setOwnerToDelete(null);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    loadOwners();
  };

  const openModal = (owner: any = null) => {
    if (owner) {
      setEditingOwner(owner);
      setFormData({ name: owner.name, type: owner.type });
    } else {
      setEditingOwner(null);
      setFormData({ name: '', type: 'PERSON' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOwner) {
      await apiFetch(`/owner/${editingOwner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      await apiFetch(`/owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    setShowModal(false);
    loadOwners();
  };

  const goOwner = (id: number) => {
    router.push(`/owners/${id}`);
  };

  return (
    <div className='p-6 relative'>
      <h1 className='text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100'>Tulajdonosok</h1>
      <div className='overflow-hidden rounded-lg shadow border border-zinc-200 dark:border-zinc-800'>
        <table className='min-w-full bg-white dark:bg-zinc-900'>
          <thead>
            <tr className='bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>Név</th>
              <th className='py-3 px-6 text-left'>Típus</th>
              <th className='py-3 px-6 text-center'>Items</th>
              <th className='py-3 px-6 text-center'>Műveletek</th>
            </tr>
          </thead>
          <tbody className='text-gray-700 dark:text-gray-200 text-sm font-light'>
            {owners.map((o) => (
              <tr
                key={o.id}
                className='border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition'
              >
                <td className='py-3 px-6'>{o.name}</td>
                <td className='py-3 px-6'>
                  {o.type === 'PERSON' ? <FaUser size={18} /> : <FaBuilding size={18} />}
                </td>
                <td className='py-3 px-6 text-center'>{o.items}</td>
                <td className='py-3 px-6 flex justify-center gap-3'>
                  <Button
                    onClick={() => openModal(o)}
                    className='bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 dark:bg-yellow-500 dark:hover:bg-yellow-300 dark:text-black'
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    onClick={() => setOwnerToDelete(o)}
                    className='bg-red-500 hover:bg-red-600 text-white rounded-full p-2 dark:bg-red-600 dark:hover:bg-red-400'
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    onClick={() => goOwner(o.id)}
                    className='bg-green-500 hover:bg-green-600 text-white rounded-full p-2 dark:bg-green-600 dark:hover:bg-green-500'
                  >
                    <FaArrowAltCircleRight />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => openModal()}
        className='fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg'
      >
        <FaPlus size={20} />
      </button>

      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title={editingOwner ? 'Tulajdonos szerkesztése' : 'Új tulajdonos hozzáadása'}
      >
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <div className='grid w-full max-w-sm items-center gap-3'>
            <Label htmlFor='name'>Név</Label>
            <Input
              type='text'
              id='name'
              placeholder='Név'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className='grid w-full max-w-sm items-center gap-3'>
            <Label htmlFor='type'>Típus</Label>
            <ToggleGroup
              type='single'
              value={formData.type}
              onValueChange={(val) => val && setFormData({ ...formData, type: val })}
              className='flex gap-2'
            >
              <ToggleGroupItem
                value='PERSON'
                aria-label='Személy'
                className={`flex items-center justify-between w-25 h-12 rounded-md border transition-colors px-2 cursor-pointer
                  ${
                    formData.type === 'PERSON'
                      ? 'bg-white text-black'
                      : 'bg-black text-white border-gray-600 hover:bg-gray-800'
                  }`}
              >
                <FaUser size={18} />
                <span>Személy</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value='COMPANY'
                aria-label='Cég'
                className={`flex items-center justify-between w-18 h-12 rounded-md border transition-colors px-2 cursor-pointer
                ${
                  formData.type === 'COMPANY'
                    ? 'bg-white text-black'
                    : 'bg-black text-white border-gray-600 hover:bg-gray-800'
                }`}
              >
                <FaBuilding size={18} />
                <span>Cég</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className='flex justify-end gap-2 mt-2'>
            <Button type='button' variant='secondary' onClick={() => setShowModal(false)}>
              Mégse
            </Button>
            <Button type='submit' variant='default'>
              Mentés
            </Button>
          </div>
        </form>
      </Modal>

      <Modal<Owner>
        open={ownerToDelete}
        onOpenChange={setOwnerToDelete}
        title='Biztosan törlöd?'
        description={`Biztosan törölni szeretnéd a(z) "${ownerToDelete?.name}" tulajdonost?`}
      >
        <div className='flex justify-end gap-2'>
          <Button variant='secondary' onClick={() => setOwnerToDelete(null)}>
            Mégse
          </Button>
          <Button variant='destructive' onClick={handleDeleteConfirm}>
            Törlés
          </Button>
        </div>
      </Modal>

      <Modal<string>
        open={error}
        onOpenChange={setError}
        title='Hiba történt'
        description={error || ''}
        variant='destructive'
        footer={
          <div className='flex justify-end gap-2'>
            <Button variant='secondary' onClick={() => setError(null)}>
              Bezár
            </Button>
          </div>
        }
      />
    </div>
  );
}
