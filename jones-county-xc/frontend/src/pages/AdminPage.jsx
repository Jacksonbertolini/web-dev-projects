import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { API_BASE } from '@/lib/api'

// ── API helpers ──────────────────────────────────────────────────────────────

async function fetchAthletes() {
  const res = await fetch(`${API_BASE}/athletes`)
  if (!res.ok) throw new Error('Failed to fetch athletes')
  return res.json()
}

async function createAthlete(data) {
  const res = await fetch(`${API_BASE}/athletes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create athlete')
  return res.json()
}

async function updateAthlete({ id, ...data }) {
  const res = await fetch(`${API_BASE}/athletes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update athlete')
  return res.json()
}

async function deleteAthlete(id) {
  const res = await fetch(`${API_BASE}/athletes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete athlete')
}

// ── Athlete form ─────────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', grade: '', personal_record: '', events: '' }

function toPayload(form) {
  return {
    name: form.name.trim(),
    grade: parseInt(form.grade, 10),
    personal_record: form.personal_record.trim() || null,
    events: form.events.trim() || null,
  }
}

function AthleteForm({ initial, onSubmit, onCancel, isPending }) {
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name,
          grade: String(initial.grade),
          personal_record: initial.personal_record ?? '',
          events: initial.events ?? '',
        }
      : EMPTY_FORM
  )

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(toPayload(form))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="af-name">Name</Label>
        <Input
          id="af-name"
          value={form.name}
          onChange={set('name')}
          required
          placeholder="First Last"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="af-grade">Grade</Label>
        <Input
          id="af-grade"
          type="number"
          min={6}
          max={12}
          value={form.grade}
          onChange={set('grade')}
          required
          placeholder="9"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="af-pr">
          Personal Record <span className="text-gray-400 font-normal">(optional)</span>
        </Label>
        <Input
          id="af-pr"
          value={form.personal_record}
          onChange={set('personal_record')}
          placeholder="18:30"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="af-events">
          Events <span className="text-gray-400 font-normal">(optional)</span>
        </Label>
        <Input
          id="af-events"
          value={form.events}
          onChange={set('events')}
          placeholder="5K, 3200m"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAthlete, setEditingAthlete] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login', { replace: true })
    return null
  }

  const { data: athletes = [], isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['athletes'] })
  }

  const createMutation = useMutation({
    mutationFn: createAthlete,
    onSuccess: () => { invalidate(); setDialogOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: updateAthlete,
    onSuccess: () => { invalidate(); setDialogOpen(false); setEditingAthlete(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAthlete,
    onSuccess: () => { invalidate(); setDeleteTarget(null) },
  })

  function openAdd() {
    setEditingAthlete(null)
    setDialogOpen(true)
  }

  function openEdit(athlete) {
    setEditingAthlete(athlete)
    setDialogOpen(true)
  }

  function handleFormSubmit(payload) {
    if (editingAthlete) {
      updateMutation.mutate({ id: editingAthlete.id, ...payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const formPending = createMutation.isPending || updateMutation.isPending

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin — Manage Athletes</h2>
        <Button onClick={openAdd}>Add Athlete</Button>
      </div>

      {/* Mutation errors */}
      {(createMutation.error || updateMutation.error || deleteMutation.error) && (
        <div role="alert" className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {(createMutation.error || updateMutation.error || deleteMutation.error)?.message}
        </div>
      )}

      {isLoading && (
        <div role="status" className="text-gray-500 text-center py-12">Loading athletes…</div>
      )}

      {error && (
        <div role="alert" className="text-red-600 text-center py-12">Error: {error.message}</div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide border-b border-gray-200">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left w-20">Grade</th>
                <th className="px-4 py-3 text-left">Personal Record</th>
                <th className="px-4 py-3 text-left">Events</th>
                <th className="px-4 py-3 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {athletes.map((athlete) => (
                <tr key={athlete.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{athlete.name}</td>
                  <td className="px-4 py-3 text-gray-600">{athlete.grade}</td>
                  <td className="px-4 py-3 font-mono text-blue-600">
                    {athlete.personal_record ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {athlete.events ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(athlete)}
                        aria-label={`Edit ${athlete.name}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(athlete)}
                        aria-label={`Delete ${athlete.name}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {athletes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No athletes yet. Click "Add Athlete" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setDialogOpen(false); setEditingAthlete(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAthlete ? `Edit ${editingAthlete.name}` : 'Add Athlete'}</DialogTitle>
          </DialogHeader>
          <AthleteForm
            initial={editingAthlete}
            onSubmit={handleFormSubmit}
            onCancel={() => { setDialogOpen(false); setEditingAthlete(null) }}
            isPending={formPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete athlete?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong> and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
