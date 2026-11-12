"use client";

import { useState, useEffect, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import AdminTable from "@/components/admin/AdminTable";
import PersonModal from "@/components/admin/PersonModal";
import ViewDrawer from "@/components/admin/ViewDrawer";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminDashboardPage() {
  const [people, setPeople] = useState([]);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [idTypeFilter, setIdTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [selectedPersonForEdit, setSelectedPersonForEdit] = useState(null);

  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [viewPersonId, setViewPersonId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPersonForDelete, setSelectedPersonForDelete] = useState(null);

  const [isExporting, setIsExporting] = useState(false);

  // Fetch people list
  const fetchPeople = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search: search.trim(),
        status: statusFilter,
        idType: idTypeFilter,
      });

      const res = await fetch(`/api/admin/people?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setPeople(data.people || []);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Fetch people error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, idTypeFilter]);

  useEffect(() => {
    fetchPeople(1);
  }, [fetchPeople]);

  // Optimistic Check-in Toggle
  const handleCheckInToggle = async (personId) => {
    // 1. Optimistic update in UI
    setPeople((prev) =>
      prev.map((p) => {
        if (p._id === personId) {
          const nextCheckedIn = !p.checkedIn;
          return {
            ...p,
            checkedIn: nextCheckedIn,
            checkedInAt: nextCheckedIn ? new Date().toISOString() : null,
          };
        }
        return p;
      })
    );

    // Update stats optimistically
    const target = people.find((p) => p._id === personId);
    if (target) {
      const isNowChecked = !target.checkedIn;
      setStats((prev) => ({
        ...prev,
        checkedIn: prev.checkedIn + (isNowChecked ? 1 : -1),
        pending: prev.pending + (isNowChecked ? -1 : 1),
      }));
    }

    // 2. Perform backend update
    try {
      const res = await fetch(`/api/admin/people/${personId}/checkin`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        // Rollback on failure
        fetchPeople(pagination.page);
      }
    } catch (err) {
      console.error("Checkin toggle error:", err);
      fetchPeople(pagination.page);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/admin/export");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nazrul_utsav_2026_registrations_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("CSV এক্সপোর্ট করতে সমস্যা হয়েছে।");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Header */}
      <AdminHeader
        onAddClick={() => {
          setSelectedPersonForEdit(null);
          setIsPersonModalOpen(true);
        }}
        onExportClick={handleExportCsv}
        isExporting={isExporting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Data Table with Filters and Search */}
        <AdminTable
          people={people}
          pagination={pagination}
          onPageChange={(newPage) => fetchPeople(newPage)}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          idTypeFilter={idTypeFilter}
          onIdTypeFilterChange={setIdTypeFilter}
          onCheckInToggle={handleCheckInToggle}
          onView={(id) => {
            setViewPersonId(id);
            setIsViewDrawerOpen(true);
          }}
          onEdit={(person) => {
            setSelectedPersonForEdit(person);
            setIsPersonModalOpen(true);
          }}
          onDelete={(person) => {
            setSelectedPersonForDelete(person);
            setIsDeleteModalOpen(true);
          }}
        />
      </main>

      {/* Add / Edit Person Modal */}
      <PersonModal
        isOpen={isPersonModalOpen}
        onClose={() => setIsPersonModalOpen(false)}
        person={selectedPersonForEdit}
        onSaved={() => fetchPeople(pagination.page)}
      />

      {/* View Registrant Details Drawer (with signed private document preview) */}
      <ViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false);
          setViewPersonId(null);
        }}
        personId={viewPersonId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPersonForDelete(null);
        }}
        person={selectedPersonForDelete}
        onDeleted={() => fetchPeople(pagination.page)}
      />
    </div>
  );
}

