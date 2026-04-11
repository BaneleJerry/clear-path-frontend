import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    AlertCircle, CheckCircle, Search,
    Trash2, Pencil, Plus, X, Loader2, Building2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import {
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
} from "../orgThunk";
import { clearMessages } from "../orgSlice";
import type { OrganizationRecord, OrganizationCreateRequest } from "../orgService";

type OrgType = "INDIVIDUAL" | "COMPANY";

const TYPE_BADGE: Record<OrgType, string> = {
    INDIVIDUAL: "bg-blue-100 text-blue-800",
    COMPANY: "bg-purple-100 text-purple-800",
};

// ─── Slide-over Panel ─────────────────────────────────────────────────────────
function SlideOver({
    initial,
    onSubmit,
    onClose,
    submitting,
}: {
    initial?: OrganizationRecord;
    onSubmit: (data: OrganizationCreateRequest) => void;
    onClose: () => void;
    submitting: boolean;
}) {
    const [name, setName] = useState(initial?.name ?? "");
    const [type, setType] = useState<OrgType>(
        (initial?.type as OrgType) ?? "INDIVIDUAL"
    );
    const [visible, setVisible] = useState(false);

    // Animate in on mount
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // wait for animation out
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), type });
    };

    const isEdit = !!initial;

    const inputCls =
        "w-full text-sm px-3 py-2 border border-border rounded-lg bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

    return createPortal(
        <>
            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 40,
                    background: "rgb(var(--token-surface) / 0.1)",
                    backdropFilter: "blur(3px)",
                    WebkitBackdropFilter: "blur(3px)",
                    transition: "opacity 300ms ease",
                    opacity: visible ? 1 : 0,
                }}
            />

            {/* Panel */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 50,
                    width: "100%",
                    maxWidth: "420px",
                    transition: "transform 300ms ease",
                    transform: visible ? "translateX(0)" : "translateX(100%)",
                }}
                className="bg-surface border-l border-border flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {isEdit ? "Edit organisation" : "New organisation"}
                            </p>
                            <p className="text-xs text-text-secondary">
                                {isEdit ? "Update the details below" : "Fill in the details below"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-text-secondary">
                            Organisation name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Acme Corp"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputCls}
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-text-secondary">
                            Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as OrgType)}
                            className={inputCls}
                        >
                            <option value="INDIVIDUAL">Individual</option>
                            <option value="COMPANY">Company</option>
                        </select>
                        <p className="text-xs text-text-secondary">
                            {type === "INDIVIDUAL"
                                ? "A personal or solo organisation for individual clients."
                                : "A company or team organisation for business clients."}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !name.trim()}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-text-primary text-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isEdit ? "Save changes" : "Create organisation"}
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────
function ConfirmDialog({
    org,
    onConfirm,
    onCancel,
}: {
    org: OrganizationRecord;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return createPortal(
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgb(var(--token-surface) / 0.1)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
            }}
        >
            <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm mx-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Delete organisation</p>
                        <p className="text-xs text-text-secondary">This cannot be undone</p>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-text-primary">{org.name}</span>?
                </p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrganisationsPage() {
    const dispatch = useAppDispatch();
    const { organizations, loading, error, successMessage } =
        useAppSelector((s) => s.organizations);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [submitting, setSubmitting] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState<OrganizationRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<OrganizationRecord | null>(null);

    useEffect(() => {
        dispatch(fetchOrganizations());
    }, [dispatch]);

    useEffect(() => {
        if (!successMessage && !error) return;
        const t = setTimeout(() => dispatch(clearMessages()), 4000);
        return () => clearTimeout(t);
    }, [successMessage, error, dispatch]);

    const handleCreate = async (data: OrganizationCreateRequest) => {
        setSubmitting(true);
        await dispatch(createOrganization(data));
        setSubmitting(false);
        setShowCreate(false);
    };

    const handleEdit = async (data: OrganizationCreateRequest) => {
        if (!editTarget?.id) return;
        setSubmitting(true);
        await dispatch(updateOrganization({ id: editTarget.id, data }));
        setSubmitting(false);
        setEditTarget(null);
    };

    const handleDelete = () => {
        if (!deleteTarget?.id) return;
        dispatch(deleteOrganization(deleteTarget.id));
        setDeleteTarget(null);
    };

    const filtered = organizations.filter((o) => {
        const matchSearch =
            search === "" ||
            o.name?.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || o.type === typeFilter;
        return matchSearch && matchType;
    });

    const card = "bg-surface border border-border rounded-xl p-6";
    const inputCls =
        "text-sm px-3 py-2 border border-border rounded-lg bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

    return (
        <div className="flex flex-col gap-6">

            {/* Slide-over panels */}
            {showCreate && (
                <SlideOver
                    onSubmit={handleCreate}
                    onClose={() => setShowCreate(false)}
                    submitting={submitting}
                />
            )}
            {editTarget && (
                <SlideOver
                    initial={editTarget}
                    onSubmit={handleEdit}
                    onClose={() => setEditTarget(null)}
                    submitting={submitting}
                />
            )}
            {deleteTarget && (
                <ConfirmDialog
                    org={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Page title */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium">Organisations</h2>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage all organisations
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-text-primary text-surface text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New organisation
                </button>
            </div>

            {/* Feedback */}
            {successMessage && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className={card}>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search organisations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputCls} pl-9 w-full`}
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className={inputCls}
                    >
                        <option value="all">All types</option>
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="COMPANY">Company</option>
                    </select>
                    <span className="text-xs text-text-secondary ml-auto">
                        {filtered.length} of {organizations.length} organisations
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className={card}>
                {loading ? (
                    <div className="py-12 text-center text-sm text-text-secondary">
                        Loading organisations...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-12 text-center text-sm text-text-secondary">
                        No organisations found.
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                {["Name", "Type", "Created", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider pb-3 border-b border-border"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((org) => (
                                <tr
                                    key={org.id}
                                    className="border-b border-border last:border-0 hover:bg-bg transition-colors"
                                >
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="font-medium text-text-primary">
                                                {org.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_BADGE[org.type as OrgType] ?? "bg-gray-100 text-gray-600"}`}>
                                            {org.type === "INDIVIDUAL" ? "Individual" : "Company"}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-text-secondary text-xs">
                                        {org.createdAt
                                            ? new Date(org.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditTarget(org)}
                                                title="Edit"
                                                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(org)}
                                                title="Delete"
                                                className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}